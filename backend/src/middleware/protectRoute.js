import { requireAuth } from "@clerk/express";
import User from "../models/user.model.js";
// its an array of middlewares so browser runs it one by one sequentially 
export const protectRoute =[
    requireAuth(),
    async (req,res,next)=>{
        try{
            const clerkId=req.auth().userId;
            if(!clerkId){
                return res.status(401).json({
                    message:"Unauthorized --invalid token"
                })
            }

            //find user in db using clerkId
            const user= await User.findOne({clerkId})
            if(!user){
                return res.status(404).json({
                    message:"User not found!"
                })
            }

            //attach user to req object 
            req.user=user;
            next();
        }catch(err){
            console.error("Errorin protectRoute middleware ",err);
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
    }
]