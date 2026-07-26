import config from "./config.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("database connected 👍");
        
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;