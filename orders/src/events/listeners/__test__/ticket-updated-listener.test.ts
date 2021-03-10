import { TicketUpdatedListener } from '../../listeners/ticket-updated-listener';
import { TicketUpdatedEvent } from '@e-commerce-social-media/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../../models/ticket';


const setup = async () => {
    // Create an instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // Create and save the ticket
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'title1',
        price: 1
    });
    await ticket.save();

    // create a fake data object
    const data: TicketUpdatedEvent['data']= {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new title',
        price: 2,
        userId: 'trash'
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket};
};


it('finds, updates, and saves a ticket', async ()=> {
    const { listener, data, msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    const ticketUpdated = await Ticket.findById(ticket.id);

    expect(ticketUpdated!.title).toEqual(data.title);
    expect(ticketUpdated!.price).toEqual(data.price);
    expect(ticketUpdated!.version).toEqual(data.version);
});


it('acks the msg', async ()=> {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});


it('throws an error and not call ack if the event has wrong version number', async ()=> {
    const { listener, data, msg, ticket} = await setup();

    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        
    }
    
    expect(msg.ack).not.toHaveBeenCalled();
});