
import nats from 'node-nats-streaming';

console.clear();

// client                               client id
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});


stan.on('connect', () => {
    console.log('Publisher connected to nats');

    // We have to convert it to JSON "string"
    const data = JSON.stringify({
        id: '123',
        title: 'title',
        price: 20
    });
    
    //              channel        data     optional call back
    stan.publish('ticket:created', data,  () => {
        console.log('Event published');
    });
});