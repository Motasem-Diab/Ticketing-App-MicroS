import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@e-commerce-social-media/common';

import { queueGroupName } from './queue-group-name';

import { expirationQueue } from '../../queues/expiration-queue';


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;  // to avoid any typos

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('wiating for this time ', delay);

        await expirationQueue.add({
            orderId: data.id
        }
        // , {
        //     delay: delay
        // }
        );

        msg.ack();
    }

}