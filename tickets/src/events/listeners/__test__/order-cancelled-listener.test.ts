
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@e-commerce-social-media/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../models/ticket';
import { json } from 'express';


const setup = async () => {
    // Create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = mongoose.Types.ObjectId().toHexString();
    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'title',
        price: 1,
        userId: 'trash',

    });
    ticket.set({ orderId });
    await ticket.save();

    // fake data object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId };
};

it('Updates the ticket, publishes an event, and acks the msg ', async ()=> {

    const { listener, ticket, data, msg, orderId } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    const ticketUpdateData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdateData.orderId).not.toBeDefined();
});