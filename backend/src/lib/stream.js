import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"

const apiKey= ENV.STREAM_API_KEY
const apiSecret= ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream api key or stream api key secret is missing ");
}

export const chatClient=StreamChat.getInstance(apiKey,apiSecret);

//upsert->create+update user
export const upsertStreamUser= async (userData)=>{
    try{
        await chatClient.upsertUsers([userData])
        console.log("Stream user upserted successfully ",userData)
    }catch(err){
        console.error("Error upserting the stream user", err);
    }
}

export const deleteStreamUser= async (userId)=>{
    try{
        await chatClient.deleteUser(userId)
        console.log("Stream user deleted successfully ",userId)
    }catch(err){
        console.error("Error deleting the stream user", err);
    }
}

//to do : add another method to generateToken 