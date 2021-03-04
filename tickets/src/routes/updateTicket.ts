import express, {Request, Response} from 'express' ;
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@e-commerce-social-media/common';

import { TicketUpdatedPublisher } from '../events/publishers/TicketUpdatedPublisher';
import { natsWrapper } from '../nats-wrapper';


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

    // no await here (dont wait until it is finished)
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    // send the updated
    res.send(ticket);
});

export { router as updateTicketRouter}