import express, {Request, Response} from 'express' ;
import { requireAuth, validateRequest } from '@e-commerce-social-media/common';
import { body } from 'express-validator';


const router = express.Router();

router.delete('/api/orders/:orderId', async(req:Request, res:Response) => {
    res.send({});
});

export { router as deleteOrderRouter };