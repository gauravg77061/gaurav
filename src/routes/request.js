const express=require('express');
const { userAuth } = require('../middlleware/auth');
const ConnectionRequest=require('../models/connectionRequest');
const  User  = require('../models/user');

const requestRouter=express.Router();

requestRouter.post('/send/:status/:toUserId',userAuth,async(req,res)=>{
    try {
        // user geting from auth after authentication
        const fromUserId=req.user;

        // parameters se pass kiya h id 
        //jisko hame request bhejni h


        const toUserId=req.params.toUserId;

        //same for status

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

        const existingUser=await ConnectionRequest.findOne({
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

       //creating new entity for  db after passing all the validation


        const newconnectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,

        });

            //saving data 


        const data=await newconnectionRequest.save();

        //sending response

        res.json({
            message:"connection request send successfully",
            data
        });

    } catch (error) {
        res.status(400).send("error"+error.message);
    }
})

requestRouter.post('/review/:status/:requestId',userAuth,async(req,res) =>{
    try {
        const loggedInUser=req.user;

        console.log(loggedInUser);

        const {status,requestId} =req.params ;

        const allowedStatus=['Interested','Ignored'];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:'Status not allowed'
            });
        }

        const connectRequest=await ConnectionRequest.findOne({
            fromUserId:requestId,
            toUserId:loggedInUser,
            status:"Interested"
        })
       // console.log(loggedInUser);

       if(!connectRequest){
        return res.status(400).json({
            message:'Request not found'
        });
       }

       connectRequest.status='Accepted';

       const data = await connectRequest.save();

       res.json({
        message:'Request'+data.status+'Successfully',
        data,
       });

    } catch (error) {
        return res.status(400).json({
            message:"error"+
            error.message
        });
    }
})

module.exports = requestRouter;

