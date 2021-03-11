import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@e-commerce-social-media/common';
import { Ticket } from '../../models/ticket';;

import { queueGroupName } from './queue-group-name';

import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher';
// import { natsWrapper } from '../../nats-wrapper';    // solved by protected not private in the client in common


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;  // to avoid any typos

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket){
            throw new Error('Ticket not found ...');
        }

        ticket.set({ orderId: data.id });

        await ticket.save()
        // new TicketUpdatedPublisher(natsWrapper.client);  // solved by protected not private in the client in common
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();
    }

}