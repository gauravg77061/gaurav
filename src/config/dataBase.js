const mongoose = require('mongoose');


const connectDB= async() =>{

    await mongoose.connect(
        "mongodb+srv://gauravg77061_db_user:Gaurav@cluster0.yjyrxsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
}

module.exports = connectDB;