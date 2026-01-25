const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("✅ Connected to MongoDB successfully!");
        // console.log(`📊 Database: ${process.env.MONGODB_URL}`);
    })
    .catch((err)=> {
        console.error("❌ MongoDB connection error:");
        console.error(err.message);
        
    })
}

module.exports = connectDB;