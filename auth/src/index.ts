import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';


import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';


import { errorHandler } from './middleware/error-handler';

import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);  // to use https below

app.use( json() ) ;

app.use(
    cookieSession({
        signed: false,   // not encrypted
        secure: true,   // only with https connection
    })
)

// app.get('/api/users/currentuser', (req,res)=>{
//     res.send('okk');
// });

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// app.all('*', ()=>{
//     throw new NotFoundError();
// });
app.all('*', async()=>{
    throw new NotFoundError();
});
// // or use
// app.all('*', async (req, res, next)=>{
//     next(new NotFoundError());
// });

app.use(errorHandler);



const start = async () =>{
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
        console.log('Listening to port 3000 .,');
    });
};

start();



// app.listen(3000, ()=>{ console.log('Listening to port 3000');} );