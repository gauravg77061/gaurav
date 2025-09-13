const mongoose = require('mongoose');
const validator= require('validator');
const UserSchema=  new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid error")
            }
        }
        }
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("password is not strong ")
                }
            }
        }
    },
    photoUrl:{
        type:String
    },
    skills:{
        type:[String]
    },
    about:{
        type:String,
        default:"This is the default value of user"
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    age:{
type :Number ,
min:0,
max:150
    }
  
} , { timestamps: true });

const User=mongoose.model("User",UserSchema);

module.exports=User;