
import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError{
    statusCode = 404;

    constructor(){
        super('Rout not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError(){
        return [
            {message: 'Not Found'}
        ];
    }
}