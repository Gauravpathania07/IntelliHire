import express from "express"
import {ENV} from "./lib/env.js"
import { connectDB } from "./lib/db.js";
import path from "path"
import cors from "cors"
import {serve} from "inngest/express"
import { inngest, functions} from "./lib/inngest.js";
import {clerkMiddleware} from "@clerk/express"
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"

const app= express();

const __dirname= path.resolve()


//middlewares
// for reading the req object 
app.use(express.json());
//server allows browser cookies in req ...by using credentials true
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}));

app.use("/api/inngest", serve({client:inngest, functions}))
// this adds an auth field to request object: req.auth()
app.use(clerkMiddleware())

app.use("/api/chat",chatRoutes)
app.use("/api/session",sessionRoutes)

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"success"
    })
})

//make it ready for deployment 
if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist","index.html"));
    })
}
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