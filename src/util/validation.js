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
module.exports={
 validatorSingupData,
}