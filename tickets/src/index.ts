import mongoose from 'mongoose';

import { app } from './app';

import { natsWrapper } from './nats-wrapper';


const start = async () =>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is not defined !!!');
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI is not defined !!!');
    }

    try{                
        //       ticketing is like what we put in infra file and the url also
        await natsWrapper.connect('ticketing', 'sladkfjhaksld', 'http://nats-srv:4222');
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

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