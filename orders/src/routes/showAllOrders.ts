import express, {Request, Response} from 'express' ;
import { requireAuth, validateRequest } from '@e-commerce-social-media/common';
import { Order } from '../../models/order';


const router = express.Router();

router.get('/api/orders', requireAuth, async(req:Request, res:Response) => {
    
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    res.send(orders);
});

export { router as showAllOrdersRouter };