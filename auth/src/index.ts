import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { errorHandler } from './middleware/error-handler';

import { NotFoundError } from './errors/NotFoundError';

const app = express();

app.use( json() ) ;

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

app.listen(3000, ()=>{
    console.log('Listening to port 3000');
});