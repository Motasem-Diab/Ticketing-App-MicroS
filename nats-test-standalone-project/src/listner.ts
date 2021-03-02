import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
//                                      client id
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // When close the connection please exit, so it will not receive any event, 
    // if we didnt do that we will send an event to it before the 10s then wait for Ack, not receive it then send it againg to another in Queue group
    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    // optional callback
    // const subscription = stan.subscribe('ticket:created');

    const options = stan.subscriptionOptions()
        .setManualAckMode(true)                     // if the Event lossed (information that event handel "add the ..." not saved in DB)
                                                    // Resend the event after 30s if no Ack
        .setDeliverAllAvailable()   // Resend all the missed event when the service is down
        .setDurableName('accounting-service');  // To resend only the events that not proccessed
                                                // The Queue group is important here to not delete the Durable when restart the service

    //                                      channel      Queue group (optional)  optional
    const subscription = stan.subscribe('ticket:created', 'listenerQueueGroup',  options);

    // Look at Message Doc. here
    subscription.on('message', (msg: Message)=> {
        // console.log('Message received');
        const data = msg.getData();

        if(typeof data === 'string'){
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
        }

        msg.ack();  // Send Ack
    });

});


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());