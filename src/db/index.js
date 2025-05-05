import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        //basically hold data return by these 
        const connectionResponse = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongodb connected !! DB host : ${connectionResponse.connection.host}`)
    } catch (error) {
        console.log("error :", error);
        //use to exit process like throw
        process.exit(1)
    }
}

export default connectDB
