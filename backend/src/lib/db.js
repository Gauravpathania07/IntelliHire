import mongoose from "mongoose"
import { ENV } from "./env.js"
export const connectDB= async ()=>{
    try{
        if(!ENV.DB_URL){
            throw new error("DB_URL is not defined in ENV file");
        }
        const conn=await mongoose.connect(ENV.DB_URL);
        console.log("Connected to DB", conn.connection.host)
    }catch(err){
        console.error("Error connecting to DB", err);
        process.exit(1);   // exiting with failure
    }

}