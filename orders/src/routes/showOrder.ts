import express, {Request, Response} from 'express' ;
import { BadRequesError, NotAuthorizedError, NotFoundError } from '@e-commerce-social-media/common';
import { Order } from '../../models/order'
import mongoose  from 'mongoose';


const router = express.Router();

router.get('/api/orders/:orderId', async(req:Request, res:Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.orderId) ;
    if(!isValidId){
        throw new BadRequesError('Invalid give order id');
    }

    const order = await Order.findById(req.params.orderId).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter };