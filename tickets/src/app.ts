import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';



import { errorHandler } from '@e-commerce-social-media/common';

import { NotFoundError } from '@e-commerce-social-media/common';

const app = express();
app.set('trust proxy', true);  // to use https below

app.use( json() ) ;

app.use(
    cookieSession({
        signed: false,   // not encrypted
        secure: process.env.NODE_ENV !== 'test'   // only with https connection
    })
)




app.all('*', async()=>{
    throw new NotFoundError();
});


app.use(errorHandler);

export { app } ;