import express, {Request, Response} from 'express' ;
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@e-commerce-social-media/common';


const router = express.Router();


router.put('/api/tickets/:id', 
requireAuth, 
[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt:0 }).withMessage('Price must be greater than Zero')
],
validateRequest, 
async (req:Request, res:Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();

    // send the updated
    res.send(ticket);
});

export { router as updateTicketRouter}