const express=require('express');
const { userAuth } = require('../middlleware/auth');

const requestRouter=express.Router();

requestRouter.post('/sendingConnectionRequest',userAuth,async(req,res)=>{

    try {
        const user=req.user;
        if(!user){
            throw new Error("User nt present ");
        }
        res.send(user.firstName+" sent the connection request")
    } catch (error) {
        res.status(400).send("error "+error.message);
    }

})

module.exports = requestRouter;