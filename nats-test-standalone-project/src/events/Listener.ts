import { Message, Stan } from 'node-nats-streaming';

import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}


export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg:Message): void ;
    private client: Stan ;
    protected ackWait = 5 * 1000 ; // 5s

    // Connected client
    constructor(client: Stan){
        this.client = client
    }

    subscriptionOptions(){
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()    // Resend all the missed event when the service is down
            .setManualAckMode(true)         // if the Event lossed (information that event handel "add the ..." not saved in DB)
                                            // Resend the event after 30s if no Ack
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName); // To resend only the events that not proccessed
                        // The Queue group is important here to not delete the Durable when restart the service
    }

    listen(){
        //                                      channel      Queue group (optional)  optional
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message #${msg.getSequence()} received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message){
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));  // Just in case
    }
}