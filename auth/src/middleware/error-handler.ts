
import { Request, Response, NextFunction} from 'express';

import { RequesValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // we want to response in a consistent way (general structure)
    
    if( err instanceof RequesValidationError){
        console.log('this is a validation error');
        const formattedErrors = err.errors.map(error => {
            return { message: error.msg, filed: error.param};
        });
        res.status(400).send({ errors: formattedErrors });
    }
    
    else if(err instanceof DatabaseConnectionError){
        console.log('DB error');
        res.status(500).send({ errors: [{message: err.reason}] })
    }


    res.status(400).send({ errors:[{message: 'Something went wrong'}] });
};