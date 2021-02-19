import express, {Request, Response} from 'express' ;
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user' ;

import { RequesValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { BadRequesError } from '../errors/BadRequestError';

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
    async (req: Request, res: Response)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // return res.status(400).send(error.array());
            // throw new Error('Invalid email or password .,');
            throw new RequesValidationError(errors.array());
        }
        const { email, password } = req.body;

        const existingUser = await User.findOne( {email} );
        if(existingUser){
            // console.log('Already used Email .,');
            // return res.send({});
            throw new BadRequesError('Already used Email .,,');
        }

        const user = User.build({
            email: email,
            password
        });
        await user.save();
        console.log('user added ...');

        // Generate token

        // Move it at begining
        // if(!process.env.JWT_KEY){
        //     throw new Error('jwt key not found !!!');
        // }

        const token = jwt.sign( {
            id:user.id, 
            email:user.email
        }, 
        process.env.JWT_KEY ! // ! dont worry we already checked that
        );

        // Store it in a session
        // req.session.jwt = token;
        req.session = {
            jwt: token
        };

        res.status(201).send(user);

});

export { router as signupRouter };