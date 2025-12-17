const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const defaultUri = "mongodb://127.0.0.1:27017/genvonation";
        const uri = process.env.MONGO_URI || defaultUri;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`Database connected Successfully: ${mongoose.connection.host}`);
        return true;
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
       
    }
};

module.exports = connectDB;