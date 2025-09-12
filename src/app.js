const express=require('express');
const  connectDB=require('./config/dataBase');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const app=express();

app.use(express.json());

app.post("/signup",async(req,res)=>{
    
    //await user.save();
    const user=new User(req.body);

    try {
       // const user=new User(req.body);
        console.log(req.body);
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.error("something went wrong");
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
    const userId = req.body.userId;
    const data= req.body;
    try {
        const user = await User.findOneAndUpdate( {_id:userId} , data, { new: true });
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


