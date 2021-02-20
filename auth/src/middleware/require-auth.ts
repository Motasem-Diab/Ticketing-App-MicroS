
import { Request, Response, NextFunction} from 'express';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser){
        // res.status(401).send();
        throw new NotAuthorizedError();
    }

    next();
}