const express=require('express');

const authRouter=express.Router();

const bcrypt=require('bcrypt');

const validator=require('validator');

const User = require('../models/user');   // path apne project ke hisaab se

const {validatorSingupData}=require('../util/validation');


authRouter.post('/signup',async(req,res)=>{
    try {
        
        const{firstName,lastName,emailId,password} = req.body;

        // I have created another file for the validation in utils folder 
         validatorSingupData(req);
         

        // checking whether this email id is present or not 
         const checkForEmail=await User.findOne({emailId});

         //if present than don't go further throw an error 

         if(checkForEmail){
            throw new Error('Email already registered');
         }

         //converting mormal password into hash password 

        const hashPassword=await bcrypt.hash(password,10);

       // console.log(hashPassword);

       // creating new user with these details 

        const user=new User({
            firstName,
            lastName,
            emailId,
            password:hashPassword
        })

await user.save();
res.send('signup successfully');

    } catch (error) {
        res.status(400).send("Error"+error.message);
    }
})

//login

authRouter.post('/login',async(req,res)=>{

    try {
        
        //fetching emailid and password from the body

        const {emailId,password}=req.body;

        //validating email

        if(!validator.isEmail(emailId)){
            throw new Error("Invalid email id");
        }

        //fetching user 

        const user=await User.findOne({emailId:emailId});

        //if user not Exist throw an error

        if(!user){
            throw new Error("Inavid credentials");
        }

        //validating password 

        const isPassword=await user.validatePassword(password);

        //if password true

        if(isPassword){

            //getting token from user model

            const token=await user.getJwt();

            //sending cookie with request

            res.cookie("token",token);
            
            //sending status

            res.send(user);

        }
        else{

            //iif validation fails than thrrow an error

            throw new Error('Invalid credentials');
        }

    } catch (error) {

        res.status(400).send('Error '+error.message);
    }

})

//logout 

authRouter.post('/logout',async(req,res)=>{

    //No need of authentication here for logout 

    try {

        //expiring cookie changing date to date now

        res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("Logout successfully");
    } catch (error) {
        res.status(400).send("error "+ error.message);
    }
    
})


module.exports=authRouter;