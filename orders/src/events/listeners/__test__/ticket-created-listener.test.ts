
import { TicketCreatedListener } from '../../listeners/ticket-created-listener';
import { TicketCreatedEvent } from '@e-commerce-social-media/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../../models/ticket';


const setup = async () => {
    // Create an instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    // Create a fake data object
    const data: TicketCreatedEvent['data']= {
        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'title1',
        price: 1,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg};
};

it('creates and saves a ticket', async ()=> {

    const { listener, data, msg } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    // make sure that the ticket is created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.title).toEqual(data.title);
});


it('acks the message', async ()=> {

    const { listener, data, msg } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    // make sure that ack function is called
    expect(msg.ack).toHaveBeenCalled()
});