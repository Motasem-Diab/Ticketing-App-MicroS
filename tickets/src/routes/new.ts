import express, {Request, Response} from 'express' ;
import { requireAuth, validateRequest } from '@e-commerce-social-media/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';


const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt:0 }).withMessage('Price must be greater than Zero')
], validateRequest, 
async (req: Request, res: Response) => {
    const {title, price} = req.body;

    const ticket = {
        title,
        price,
        userId: req.currentUser!.id
    };
    await Ticket.build(ticket).save();

    const DBticket = await Ticket.find(ticket)

    // const ticket = Ticket.build({
    //     title,
    //     price,
    //     userId: req.currentUser!.id
    // });
    // ticket.save();
    res.status(201).send(DBticket);
});


export { router as createTicketRouter };