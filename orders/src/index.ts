import mongoose from 'mongoose';

import { app } from './app';

import { natsWrapper } from './nats-wrapper';

import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';


const start = async () =>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is not defined !!!');
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI is not defined !!!');
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL is not defined !!!');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID is not defined !!!');
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID is not defined !!!');
    }

    

    try{                
        //       ticketing is like what we put in infra file and the url also
        //                                          unique id
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        useCreateIndex: true
        });
        console.log('Connected to auth DB ..,.');
    }
    catch (err){
        console.log('Cant connect to auth DB .. !!!', err)
    }

    app.listen(3000, ()=>{ 
        console.log('Listening to port 3000');
    });
};

start();



// app.listen(3000, ()=>{ console.log('Listening to port 3000');} );