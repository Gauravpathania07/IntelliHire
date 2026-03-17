import express from "express"
import {ENV} from "./lib/env.js"
import { connectDB } from "./lib/db.js";
const app= express();

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"success"
    })
})


const startServer=async ()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>{
        console.log("server is running at the port:", ENV.PORT);
})
    }catch(err){
        console.error("Error starting the server", err);

    }
}
startServer();