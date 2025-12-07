const Razorpay=require('razorpay');

var instance=new Razorpay({
    key_id:process.env.API_KEY_RAZORPAY,
    key_secret:process.env.SECRET_KEY_RAZORPAY,
});

module.exports=instance;