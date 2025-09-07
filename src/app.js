const express=require('express');
const  connectDB=require('./config/dataBase');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const app=express();

app.post("/signup",async(req,res)=>{
    const userObj={
        firstName:"Gaurav",
        lastName :'Gupta',
        emailId:'Gaurav@1233gmail.com',
        password:'Gaurav@123'
    }
    const user=new User(userObj);
    //await user.save();

    try {
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.error("something went wrong");
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


