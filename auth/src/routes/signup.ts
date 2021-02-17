import express, {Request, Response} from 'express' ;
import { body, validationResult } from 'express-validator';

import { RequesValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/signup', 
    [
    body('email')
        .isEmail()
        .withMessage('Email must be valid .,'),
    body('password')
        .trim()
        .isLength( {min:4, max:20} )
        .withMessage('Password must be between 4 and 20 .,')
    ],
    (req: Request, res: Response)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // return res.status(400).send(error.array());
            // throw new Error('Invalid email or password .,');
            throw new RequesValidationError(errors.array());
            
        }

        const { email, password } = req.body;

        console.log('Creating User ...');
        //throw new Error('Error connecting to DB');

        // throw new DatabaseConnectionError();

        res.send({});
});

export { router as signupRouter };