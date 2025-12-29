
const socket=require("socket.io");
const crypto = require("crypto");
const {Chat}=require("../models/chat");

const getSecretRoomId =(userId,targetUserId) =>{
    return crypto
    .createHash("sha256")
    .update([userId,targetUserId].sort().join("_"))
    .digest("hex")
}

const initializeSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:["http://localhost:5173",
                "https://newsite.club"
            ]
        },
    });

    io.on("connection",(socket)=>{
        //handle event 

        // chat joining event 

        socket.on("joinChat",({firstName,lastName,userId,targetUserId})=>{
            const roomId=getSecretRoomId(userId,targetUserId);
            //console.log(firstName+" joined room  "+ roomId);
            socket.join(roomId);
           
        })

        //send message

        socket.on("sendMessage",async({firstName,lastName,userId,targetUserId,textMessage})=>{
           // console.log(textMessage);
           //console.log(firstName);
           // const roomId=getSecretRoomId(userId,targetUserId);
            //console.log(firstName + " "+ textMessage);

            // when I am sending the message here is the place where I need to store the chat 

            try {

                 const roomId=getSecretRoomId(userId,targetUserId);

                //finding the chat whether it is present or not 

                let  chat = await Chat.findOne({
                    participants:{$all:[userId,targetUserId]},
                });

                //if chat not present create a chat 

                if(!chat){
                    chat=new Chat({
                        participants:[userId,targetUserId],
                        messages:[],
                    })
                }

                //now append the chat into messages 

                chat.messages.push({
                    senderId:userId,
                    text:textMessage,
                })

                await chat.save();

                  io.to(roomId).emit("messageRecived",{firstName,lastName,textMessage});
                
            } catch (error) {
                console.log(error);
                
            }

           // io.to(roomId).emit("messageRecived",{firstName,textMessage});
        })

        // disconnect

        socket.on("disconnect",()=>{

        });
    });

}

module.exports=initializeSocket;