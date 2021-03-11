
import { OrderCreatedListener } from '../order-created-listeners';
import { OrderCreatedEvent, OrderStatus } from '@e-commerce-social-media/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../models/ticket';
import { json } from 'express';


const setup = async () => {
    // Create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'title',
        price: 1,
        userId: 'trash'
    });
    await ticket.save();

    // fake data object
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'trash',
        expiresAt: 'trash',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };
};

it('Sets the userId of the tikcet ', async ()=> {

    const { listener, ticket, data, msg } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id)
});


it('acks the msg', async ()=> {

    const { listener, ticket, data, msg } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});


it('publishes a ticket updated event', async ()=> {

    const { listener, ticket, data, msg } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // // @ts-ignore
    // console.log(natsWrapper.client.publish.mock.calls[0][1])
    const ticketUpdateData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdateData.orderId).toEqual(data.id);
});