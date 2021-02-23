import mongoose from 'mongoose';

import { app } from './app';



const start = async () =>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY not defined !!!');
    }

    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
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