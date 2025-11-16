
import jwt from 'jsonwebtoken';
import User from '../models/user.js';   // .js extension likhna mat bhoolna
import cookieParser from 'cookie-parser';



const userAuth= async(req, res,next)=>{
    try {
        const {token}=req.cookies;
        //console.log(token);

        if(!token){
            return res.status(401).send("Please Login");
        }

        const decodedMessage = await jwt.verify(token,"DEV@Tinder$790");

        const {_id}=decodedMessage;

        const user =await User.findById({_id});

        //console.log(_id);

        if(!user){
            throw new Error('Errorin finding user id');
        }

        req.user =user;

        next();

    } catch (error) {
        res.status(400).send("Error message "+error.message);
    }
}

export{
    userAuth
}