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


const app=express();

app.use(cookieParser());

app.use(express.json());

app.post("/signup",async(req,res)=>{
    
    //await user.save();
    // aese kar sakte h  par pura kaa pura fetch nahi karna chaiye 
    //const user=new User(req.body);

    //new way to fetch
    const{firstName,lastName,emailId,password}=req.body;

    const passwordHash=await bcrypt.hash(password,10);

    console.log(passwordHash);

    try {
       // const user=new User(req.body);
       //yaha hamen validate kar li ki ye cheez theek h ki nahi while signup
       validatorSingupData(req);

   const user=new User({
    firstName,
    lastName,
    emailId,
    password:passwordHash
   })
       // console.log(req.body);
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.error(error.message);
    }
})


// login

app.post('/login',async(req,res)=>{
    try {
        const {emailId,password}=req.body;
        // validate whether email entered is valid or not 

       // console.log(req);

        if(!validator.isEmail(emailId)){
            throw new Error("Invalid email id ");
        }

        const user=await  User.findOne({emailId:emailId});

        if(!user){
            throw new Error("Invalid credentials");
            
        }

        const isPassword = await user.validatePassword(password);

        if(isPassword){
            //ye token aa raha h user model se 
           const token=await user.getJwt();

            res.cookie("token",token);

            res.send("Login successfully");
        }
        else{
            throw new Error("invalid credentials");
        }


    } catch (error) {
        res.status(400).send("Error : "+error);
    }
})

// get rofile details

app.get('/profile',userAuth,async(req,res) =>{

    try {

       const user = req.user;

       res.send(user);

        
    } catch (error) {
        res.status(400).send("error"+error.message);
    }
})


// sending cnnection request and details of person of send the request

app.post('/sendingConnectionRequest',userAuth,async(req,res)=>{

    try {

        //yaha par ye req.user verify ho kar middleware se aa raha h
        const user=req.user;

    res.send(user.firstName + " sent the connection request");
    } catch (error) {
        res.status(400).send("Error " +error.message);
    }
})



connectDB().
then(()=>{
    //first connect with db
    console.log('Data base connected successfully');
    // than connect with server
    app.listen(3000,()=>{
    console.log("server is running at port number 3000")
})
})
.catch((err)=>{
    console.error(("Data base can not be connected"));
})


