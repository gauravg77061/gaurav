const  express= require('express');
const { userAuth } = require('../middlleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter=express.Router();

const safeData= ["firstName","lastName","age","skills","about","photoUrl","gender"];

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


userRouter.get('/feed',userAuth,async(req,res)=>{
    try {
        
        const loggedInUser=req.user;

        const connectRequest=await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId  toUserId");

        const hideAllUser = new Set();

        connectRequest.forEach(element => {
            hideAllUser.add(element.fromUserId.toString());
            hideAllUser.add(element.toUserId.toString());
        });

//        console.log(hideAllUser);

        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideAllUser)}},
//isko hata kar run karna h ek baar

               {_id:{$ne:loggedInUser._id}},
            ]
        }).select(safeData);

        res.send(users);

    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})





module.exports =userRouter;

