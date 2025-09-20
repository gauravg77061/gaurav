const  express= require('express');
const { userAuth } = require('../middlleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter=express.Router();

const safeData= ["firstName","lastName","age","skills","about"];

// all the request sent to me 

userRouter.get('/request/recived',userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;

        const connectRequest = await ConnectionRequest.find({
            toUserId:loggedInUser,
            status:'Interested'
        }).populate('fromUserId',safeData);

        res.json({
            message:'Data fetched successfully',
            data:connectRequest
        })

    } catch (error) {
        res.status(400).json({
            message:"error"+ error.message
        })
    }
})

// all the other user connected to logged in user 

userRouter.get('/connections',userAuth, async(req,res)=>{
    try {
        
        const loggedInUser=req.user;

        const connection = await ConnectionRequest.find({
           $or:[

            {fromUserId:loggedInUser},
            {toUserId:loggedInUser},

           ],
           status :"Accepted"
        }).populate("fromUserId",safeData)
        .populate("toUserId",safeData);

        const data=connection.map((row)=>{
            if(row.fromUserId.toString() === loggedInUser.toString()){
                return row.toUserId
            }

            return row.fromUserId;
        })

        res.json({
            message:"connected Users",
            data
        })


    } catch (error) {
        return res.status(400).json({
            message:"error "+ error.message
        });
    }
})

module.exports =userRouter;

