import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
//                                      client id
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // optional callback
    // const subscription = stan.subscribe('ticket:created');

    const options = stan.subscriptionOptions()
        .setManualAckMode(true);                     // if the Event lossed (information that event handel "add the ..." not saved in DB)
                                                    // Resend the event after 30s if no Ack

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