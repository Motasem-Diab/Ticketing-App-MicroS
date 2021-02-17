
import { Request, Response, NextFunction} from 'express';

import { RequesValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // we want to response in a consistent way (general structure)
    
    if( err instanceof RequesValidationError){
        console.log('this is a validation error');
        res.status(err.statusCode).send({ errors: err.serializeError() });
    }

    else if(err instanceof DatabaseConnectionError){
        console.log('DB error');
        res.status(err.statusCode).send({ errors: err.serializeError() })
    }


    res.status(400).send({ errors:[{message: 'Something went wrong'}] });
};