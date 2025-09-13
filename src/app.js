const express=require('express');
const  connectDB=require('./config/dataBase');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const {validatorSingupData}= require('./util/validation');
const bcrypt=require('bcrypt');
const validator = require('validator');

const app=express();

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
//fetching user by email or GET API to fetch single user

app.get('/user', async(req,res)=>{
    const userEmail=req.body.emailId;
    try {
        
        const user =await User.find({emailId:userEmail});
        if(user.length === 0){
           throw new Error("User not  found!");
           
        }
        else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send(error.message);
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

        const isPassword = await bcrypt.compare(password,user.password);

        if(isPassword){
            res.send("Login successfully");
        }
        else{
            throw new Error("invalid credentials");
        }


    } catch (error) {
        res.status(400).send("Error : "+error);
    }
})

// fetching all the user by get api

app.get('/feed',async(req,res)=>{
    try {
        const user=await User.find({});
       
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
//delete 
app.delete('/delete',async(req,res) =>{
    const userId=req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// find by id and update 
app.patch('/user',async(req,res)=>{

    //isme mujhe manually hatani pad rahi h user id 
    const userId = req.body.userId;
    const data= {...req.body};
     delete data.userId; 
     // destructure am mein apne app remove kar deta h
     // const {userId,...data}=req.body;
    try {

        //kya kya cheez update karne ke liye allowed 
        const allowed_update=["photoUrl","gender","age","skills"];

        const isAllowed= Object.keys(data).every(k=>allowed_update.includes(k));
        if(!isAllowed){
throw new Error("update not allowed");
        }

        const user = await User.findOneAndUpdate( {_id:userId} , data, { new: true ,runValidators:true});
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send(error.message);
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


