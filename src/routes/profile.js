const express=require('express');
const { userAuth } = require('../middlleware/auth');
const { validateEditProfileData } = require("../util/validation");

const profileRouter=express.Router();

profileRouter.get('/view',userAuth,async(req,res)=>{

    try {
        const user=req.user;
        if(!user){
            throw new Error("User not present");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send("Error "+error.message);
    }

})

profileRouter.patch('/edit',userAuth,async(req,res)=>{
    try {
      if( ! validateEditProfileData(req)){
        throw new Error("Invalid edt request");
      }

      const loggedInUser=req.user;
    //  console.log(loggedInUser);
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
    } catch (error) {
        res.status(400).send("Error :"+error.message);
    }
})



module.exports=profileRouter;