const express=require('express');
const  connectDB=require('./config/dataBase');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const {validatorSingupData}= require('./util/validation');
const bcrypt=require('bcrypt');
const validator = require('validator');
const jwt= require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {userAuth}=require('./middlleware/auth');
const authRouter=require ('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
require("dotenv").config();
const cors=require('cors');
const paymentRouter = require('./routes/payment');

const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));

app.use(cookieParser());

app.use(express.json());

app.use('/auth',authRouter);

app.use('/profile',profileRouter);

app.use('/request',requestRouter);

app.use('/user',userRouter);

app.use('/payment',paymentRouter);

// sending cnnection request and details of person of send the request

// app.post('/sendingConnectionRequest',userAuth,async(req,res)=>{

//     try {

//         //yaha par ye req.user verify ho kar middleware se aa raha h
//         const user=req.user;

//     res.send(user.firstName + " sent the connection request");
//     } catch (error) {
//         res.status(400).send("Error " +error.message);
//     }
// })



connectDB().
then(()=>{
    //first connect with db
    console.log('Data base connected successfully');
    // than connect with server
    app.listen(process.env.PORT,()=>{
    console.log("server is running at port number 3000")
})
})
.catch((err)=>{
    console.error(("Data base can not be connected"));
})


