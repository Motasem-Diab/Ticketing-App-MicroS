
import { CustomError } from "./CustomError";

export class DatabaseConnectionError extends CustomError{

    statusCode = 500
    reason = 'Error connection to DB';

    constructor(){
        super('Error connection to DB'); //for loging purpose
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeError() {
        return [
            { message: this.reason}
        ];
    }
}