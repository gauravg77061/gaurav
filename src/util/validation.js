const validator= require('validator');
const validatorSingupData = (req) =>{

    const {firstName, lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not Valid");
    }
    else if (!validator.isEmail(emailId)){
throw new Error("Inavlid credentials");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("please enter strong password");
    }

}

const validateEditProfileData= (req)=>{
    const allowedEditFields=["firstName","lastName","emailId","skills","photoUrl","about","gender","age"];

    const isEditAllowed=Object.keys(req.body).every((field) =>allowedEditFields.includes(field));
    return isEditAllowed;

};



module.exports={
 validatorSingupData,
 validateEditProfileData,
 
}