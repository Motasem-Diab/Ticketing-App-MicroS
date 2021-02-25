import express, {Request, Response} from 'express' ;
import { body, validationResult } from 'express-validator';
import { RequesValidationError } from '../errors/request-validation-error';
import { User, UserDoc } from '../models/user';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../common/src/middleware/validate-request';
import { BadRequesError } from '../errors/BadRequestError';
import { Password } from '../services/Password';

const router = express.Router();

router.post('/api/users/signin',
    [
    body('email')
        .isEmail()
        .withMessage('Email must be valid .,'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Must supply a Password')
    ],
    validateRequest,
    async (req: Request, res: Response)=>{
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     throw new RequesValidationError(errors.array());
        // }
        const { email, password } = req.body;


        var exitsingUser = await User.findOne({ email:email });
        if(!exitsingUser){
            throw new BadRequesError('Invalid credintials');
        }

        const passwordMatch = await Password.compare(exitsingUser.password, password);
        if(!passwordMatch){
            throw new BadRequesError('Invalid credintials');
        }

        console.log(`user ${exitsingUser.email} signed in `);
        const token = jwt.sign( {
            id:exitsingUser.id, 
            email:exitsingUser.email
        }, 
        process.env.JWT_KEY ! // ! dont worry we already checked that
        );

        // Store it in a session
        // req.session.jwt = token;
        req.session = {
            jwt: token
        };

        res.status(200).send(exitsingUser);

    });

export { router as signinRouter };








