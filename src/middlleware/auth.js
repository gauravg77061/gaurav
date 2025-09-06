const isAuth =(req,res,next)=>{
    const token ='xyz';
    const isAuthe= token ==='xyz';
    if(!isAuthe){
        res.status(401).send('unauth');
    }
    else{
        next();
    }
}
const isUser=(req,res,next)=>{
    const token='abc';
    const isUserAuth= token === 'abc';
    if(!isUserAuth){
        res.status(401).send('not a User ');
    }
    else{
        next();
    }
}
export{
    isAuth,
    isUser,
}