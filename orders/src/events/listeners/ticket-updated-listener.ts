import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@e-commerce-social-media/common';
import { Ticket } from '../../../models/ticket';

import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const { id, title, price } = data;

        // const ticket = await Ticket.findById(id);

        // to use it in concurrency issues chapter 19
        // const ticket = await Ticket.findOne({ 
        //     _id:id,
        //     version: data.version - 1
        // });
        const ticket = await Ticket.findByEvent(data);


        if(!ticket){
            throw new Error('Ticket not found !!!');
        }

        ticket.set({ title, price});

        await ticket.save();

        msg.ack();
    }
}