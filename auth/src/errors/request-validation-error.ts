
import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class RequesValidationError extends CustomError {
    
    statusCode = 400

    constructor(public errors: ValidationError[]){
        super('Validation Error'); // logging
        // when extends a built-in class
        Object.setPrototypeOf(this, RequesValidationError.prototype);
    }

    serializeError(){
        return this.errors.map(err => {
            return { message: err.msg, filed: err.param};
        });
    }
}