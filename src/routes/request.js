const express=require('express');
const { userAuth } = require('../middlleware/auth');

const requestRouter=express.Router();

requestRouter.post('/sendingConnectionRequest',userAuth,async(req,res)=>{

    try {
        //fetching user details after authenticating from userAuth.
        //cn refer userAuth middle ware for more infromation
        const user=req.user;
        if(!user){

            //validatiing user

            throw new Error("User nt present ");
        
        }
        //sending res 

        res.send(user.firstName+" sent the connection request")
    } catch (error) {
        res.status(400).send("error "+error.message);
    }

})

module.exports = requestRouter;