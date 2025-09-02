const express=require('express');
const app=express();




app.use('/test',(req,res) =>{
    res.send("server is running fron test route");
})
app.use((req,res)=>{
    res.send ("hello this coming from port 3000");
});



app.listen(3000,()=>{
    console.log("server is running at port number 3000")
})