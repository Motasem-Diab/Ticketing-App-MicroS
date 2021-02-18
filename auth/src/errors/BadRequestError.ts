
import { CustomError } from './CustomError';

export class BadRequesError extends CustomError {
    
    statusCode = 400;

    constructor(private msg: string){
        super(msg); // logging
        // when extends a built-in class
        Object.setPrototypeOf(this, BadRequesError.prototype);
    }

    serializeError(){
        return [ {message: this.msg} ]
    }
}