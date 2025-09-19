const express=require('express');
const { userAuth } = require('../middlleware/auth');
const connectionRequest=require('../models/connectionRequest');
const  User  = require('../models/user');

const requestRouter=express.Router();

requestRouter.post('/send/:status/:toUserId',userAuth,async(req,res)=>{
    try {
        
        const fromUserId=req.user;


        const toUserId=req.params.toUserId;

        const status=req.params.status;

        // validation 1 - status in dono mein se kuch hona chaiye 

        const allowedStatus=["Interested","Ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type"+status
            })
        }

        //validaton 2 -> user a ne request send kari hui h 
        //toh user A->B ko send naa kar paaye 
        // same user B->A ko wapis naa kar paaye 

        const existingUser=await connectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ],
        });

        //sending status from here only 

        if(existingUser){
            return res.status(400).json({
                message:"Connection request already exist"
            })
        }

         // validation 3 -> user jo logged in h vo khud ko request naa send kar paaye 

       // const toUserIdCheck=await connectionRequest.findById(toUserId);


 if (fromUserId.equals(toUserId)) {
  return res.status(400).json({
    message: "cannot send connection request to yourself"
  });
}
        //validation 4 -> jisko request send kar rahe h vo present hona chaiye 
        //agar vo present h nahi h toh jaani hi nahi chaiye request 

        const toUser=await User.findById(toUserId);

        if(!toUser){
            return res.status(400).json({
                message:"User not found"
            });
        }

       


        const newconnectionRequest=new connectionRequest({
            fromUserId,
            toUserId,
            status,

        });

        const data=await newconnectionRequest.save();

        res.json({
            message:"connection request send successfully",
            data
        });

    } catch (error) {
        res.status(400).send("error"+error.message);
    }
})

module.exports = requestRouter;

