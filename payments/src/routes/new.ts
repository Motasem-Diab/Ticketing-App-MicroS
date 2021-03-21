import express, {Request, Response} from 'express' ;
import { requireAuth, validateRequest, BadRequesError, NotFoundError, NotAuthorizedError, OrderStatus } from '@e-commerce-social-media/common';
import { body } from 'express-validator';
import { Order } from '../models/order';

import { stripe } from '../stripe';


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

    await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });

    res.status(201).send({ success:true });

});


export { router as createChargeRouter };