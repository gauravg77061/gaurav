const express=require('express');
const app=express();

const {isAuth,isUser}= require('./middlleware/auth');

// class  4 kaa 

app.use('/admin',isAuth);

app.use('/user/login' ,(req,res)=>{
    res.send('login successfuly');
})

app.get('/admin/user',(req,res)=>{
    res.send('All user data');
})

app.get('/admin/delete',(req,res)=>{
    res.send("user deleted");
})

app.get('/user/data',isUser,(req,res)=>{
    console.log('data ');
    res.send('User Data');
})


// class 3

// aggar mein specific call deta hu toh vo  specific http request handle karega

// ye wala run karne se sirf ye hi chale baaki waale post get delete nahi chalenge kyuki ye sabke liye validd ar ye maater karta h

// app.use('/user',(req,res)=>{
//  res.send("HAHAHAHAH")
// })

// app.get('/user',(req,res)=>{
//     res.send({firstName : 'Gaurav ' , LastName : 'kummar'})
// })

// app.post('/user',(req,res)=>{
//     res.send("Data save succesfully in DB!")
// })
// //delete http request
// app.delete('/user',(req,res)=>{
//     res.send("delted successfully");
// })
// // this wll match all the http calls 
// app.use('/test',(req,res) =>{
//     res.send("server is running fron test route");
// })
// app.use((req,res)=>{
//     res.send ("hello this coming from port 3000");
// });



app.listen(3000,()=>{
    console.log("server is running at port number 3000")
})