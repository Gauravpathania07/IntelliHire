import { chatClient } from "../lib/stream";

export async function getStreamToken(req,res){
    try{
        //use clerk id for stream but not the mongo db id  as it should match with stream client 
        const token= chatClient.createToken(req.user.clerkId);
        req.status(200).json({
            token:token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image
        })
    }catch(err){
        console.log("Internal server error in chatController ",err.message);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}