const mongoose=require ('mongoose');

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    toUserId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
        required:true 
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["Ignored","Interested","Rejected","Accepted"],
            message:`{VALUE} is incorrect ststus type`
        }
    }
   

}, {
        timestamps:true
    });

    const connectionRequestModel=new mongoose.model(
        "connectionRequest",
        connectionRequestSchema
    );

    module.exports=connectionRequestModel;