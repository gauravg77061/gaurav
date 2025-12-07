const mongoose = require('mongoose');
const validator= require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

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
        type:String,
         default: "https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg?semt=ais_hybrid&w=740&q=80"
         

    },
    isPremium:{
        type:String,
        default:false,
    },
    memberShipType:{
        type:String,
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

UserSchema.methods.getJwt=async function() {
    const user =this;
    const token= await jwt.sign({_id:user.id},"DEV@Tinder$790");

    return token;
}

UserSchema.methods.validatePassword= async function (passwordEntered) {
    const user=this;
    //yha par user mein this store ho chuka isliye user.passwrod 
    //user.password = this.password ke 
    const hashPassword=user.password;
    const isPasswordValid=await bcrypt.compare(passwordEntered,hashPassword);
    return isPasswordValid;
}

const User=mongoose.model("User",UserSchema);

module.exports=User;