import express, {Request, Response} from 'express' ;
import { requireAuth, validateRequest, BadRequesError, NotFoundError, NotAuthorizedError, OrderStatus } from '@e-commerce-social-media/common';
import { body } from 'express-validator';
import { Order } from '../models/order';

import { stripe } from '../stripe';

import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post('/api/payments', requireAuth, 
[
    body('token').not().isEmpty().withMessage('token is required'),
    body('orderId').not().isEmpty().withMessage('orderId is required')
], validateRequest, 
async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    if(order.status === OrderStatus.Cancelled){
        throw new BadRequesError('the order is cancelled, cant pay for this order');
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });

    // save the payment
    const payment = Payment.build({
        orderId,
        stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripId: payment.stripeId
    });

    res.status(201).send(payment);

});


export { router as createChargeRouter };