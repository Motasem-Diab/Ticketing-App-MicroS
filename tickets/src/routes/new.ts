import express, {Request, Response} from 'express' ;
import { requireAuth, validateRequest } from '@e-commerce-social-media/common';
import { body } from 'express-validator';


const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt:0 }).withMessage('Price must be greater than Zero')
], validateRequest, async (req: Request, res: Response) => {
    res.status(200).send({});
});


export { router as createTicketRouter };