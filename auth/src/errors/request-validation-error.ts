
import { ValidationError } from 'express-validator';

export class RequesValidationError extends Error {
    constructor(public errors: ValidationError[]){
        super();

        // when extends a built-in class
        Object.setPrototypeOf(this, RequesValidationError.prototype);
    }
}