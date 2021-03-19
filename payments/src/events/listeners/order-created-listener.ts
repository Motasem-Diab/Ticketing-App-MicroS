import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@e-commerce-social-media/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;  // to avoid any typos

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
    
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        });
        await order.save();

        msg.ack();
    }

}