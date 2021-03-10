import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';

import mongoose from 'mongoose';


// Fake client
import { natsWrapper } from '../../nats-wrapper';
import { mongo } from 'mongoose';


it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'title1',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

// it.todo('emits a order cancelled event');

it('emits a order cancelled event', async ()=> {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'title1',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  
  // console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});