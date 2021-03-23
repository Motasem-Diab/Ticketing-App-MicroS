import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@e-commerce-social-media/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../../models/order';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;  // to avoid any typos

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        
        const order = await Order.findById(data.orderId);
        if(!order){
            throw new Error('Order not found');
        }
        order.set({
            status: OrderStatus.Complete
        });
        order.save();
        // should emit an event of order updated , but in this project its the last step

        msg.ack();
    }

}