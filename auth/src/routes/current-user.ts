// This will return null if the JWT is invalid or not logged in else return the current user info

import express from 'express' ;
import jwt from 'jsonwebtoken';


import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req,res)=>{
    
    // Moved to a middleware
    // if(!req.session || !req.session.jwt){  // or use if(!req.session?.jwt)
    //     return res.send({ currentuser: null});
    // }
    // try{
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    //     res.send({ currentuser: payload});
    // }
    // catch(err){
    //     return res.send({ currentuser: null});
    // }

    res.send({ currentuser: req.currentUser });
});

export { router as currentUserRouter };