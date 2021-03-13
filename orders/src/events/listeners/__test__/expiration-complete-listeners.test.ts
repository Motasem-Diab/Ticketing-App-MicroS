
import { ExpirationCompleteListener } from '../../listeners/expiration-complete-listeners';
import { ExpirationCompleteEvent, OrderStatus } from '@e-commerce-social-media/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../../models/ticket';
import { Order } from '../../../../models/order';


const setup = async () => {
    // Create an instance of listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'title1',
        price: 1
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'trash',
        expiresAt: new Date(),
        ticket,

    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket, order};
};


it('Updates the order status to cancelled', async ()=> {

    const { listener, data, msg, order} = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('emit an OrderCancelled event', async ()=> {

    const { listener, data, msg, order} = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id)
});


it('acks the message', async ()=> {

    const { listener, data, msg } = await setup();

    // Call the onMessage function with data object and message object
    await listener.onMessage(data, msg);

    // make sure that ack function is called
    expect(msg.ack).toHaveBeenCalled()
});