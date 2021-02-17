
import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class RequesValidationError extends CustomError {
    
    statusCode = 500

    constructor(public errors: ValidationError[]){
        super();
        // when extends a built-in class
        Object.setPrototypeOf(this, RequesValidationError.prototype);
    }

    serializeError(){
        return this.errors.map(err => {
            return { message: err.msg, filed: err.param};
        });
    }
}