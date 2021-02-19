import express, {Request, Response} from 'express' ;
import { body, validationResult } from 'express-validator';
import { RequesValidationError } from '../errors/request-validation-error';

import { validateRequest } from '../middleware/validate-request';

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
    (req: Request, res: Response)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new RequesValidationError(errors.array());
        }
        const { email, password } = req.body;
    });

export { router as signinRouter };