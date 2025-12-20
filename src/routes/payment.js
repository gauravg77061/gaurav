const express= require('express');
const { userAuth } = require('../middlleware/auth');

const razorpayInstance=require('../util/razorpay');
const Payment=require("../models/payment");
const { memberShipAmount } = require('../util/constants');
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

const paymentRouter=express.Router();

paymentRouter.post('/create',userAuth,async(req,res)=>{
    try {

        // it will return promise 
        const{memberShipType}=req.body;
        const{firstName,lastName,emailId}=req.user;
        const order = await razorpayInstance.orders.create({
            "amount":memberShipAmount[memberShipType]*100,
            "currency":"INR",
            "receipt":"receipt#1",
            
            "notes":{
                firstName,
                lastName,
                emailId,
                memberShipType:memberShipType,

            }
        });

        //save in data base 
//console.log(order);

const payment= new Payment({
    userId:req.user._id,
    orderId:order.id,
    status:order.status,
    amount:order.amount,
    currency:order.currency,
    receipt:order.receipt,
    notes:order.notes,
});

const savedPayment = await payment.save();
        // return response back to frontend 

        res.json({...savedPayment.toJSON(),keyId:process.env.API_KEY_RAZORPAY});
        
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong");
    }
});


paymentRouter.post('/webhook',async(req,res)=>{
    try {
       
        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body),
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET);

        if(!isWebhookValid){
            return res.status(400).json({msg:"Webhook signature invald"});
        }

        // update status in db
        //update the user as premium
        // return the response 

        const paymentDetails=req.body.payload.payment.entity;

        const payment =await Payment.findOne({orderId:paymentDetails.order_id});
        payment.status= paymentDetails.status;
        await payment.save();

        const user=await User.findOne({_id:payment.userId});
        user.isPremium=true;
        user.memberShipType=payment.notes.memberShipType;

        await user.save();

        //can do this if i want to any thing 

        // if(req.body.event === "payment.captured"){

        // }

        // if(req.body.event === " payment.failed"){

        // }

        return res.status(200).json({msg:"Webhook received successfully"});

        
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
})


paymentRouter.get("/verify",userAuth,(req,res)=>{
    const user=req.user.toJSON();
    //console.log(user);
    if(user.isPremium){
        return res.json({...user});
    }
    else{
        return res.json({...user});
    }
})

module.exports=paymentRouter;