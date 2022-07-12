const mongoose = require('mongoose');
//connect to database
const mongoURL = "mongodb+srv://rajwinder2003:rajwinder2003@cluster0.azsp0.mongodb.net/newdb"
const connectToMongo = ()=>{
    mongoose.connect(mongoURL,()=>{
        console.log("connected to mongo Successfuly");
    })
}

module.exports = connectToMongo;