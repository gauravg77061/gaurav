const express=require('express');
const { userAuth } = require('../middlleware/auth');

const profileRouter=express.Router();

profileRouter.get('/view',userAuth,async(req,res)=>{

    try {
        const user=req.user;
        if(!user){
            throw new Error("User not present");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send("Error "+error.message);
    }

})

module.exports=profileRouter;