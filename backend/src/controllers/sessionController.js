import { sessionModel } from "../models/session.model.js"
import {chatClient, streamClient} from "../lib/stream.js"
export async function createSession(req,res){
    try{
        const {problem,difficulty}= req.body;
        const userId=req.user._id;
        const clerkId=req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({
                message:"Problem and difficulty are required"
            })
        }

        //generate a unique call id for stream video 
        const callId= `session_${Data.now()}_${Math.random().toString(36).substring(7)}`
        // create session in db
        const session = await sessionModel.create({
          problem,
          difficulty,
          host: userId,
          callId,
        });

        //create stream video call
        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()}
            }
        })

        // chat messaging 
        const channel= chatClient.channel("messaging",callId, {
            name:`${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
        })
        await channel.create()
        //todo email etc
        res.status(201).json({session})
    }catch(err){
        console.log("Error in createSession controller",err.message);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
export async function getActiveSessions(_,res){
    try{
        const sessions = sessionModel
          .find({ status: "active" })
          .populate("host", "name profileImage email clerkId")     // adds fields of user into host basically takesout exact values of the host 
          .sort({ createdAt: -1 })                                 // sorts in descending order the fetched values...can be either 1,-1
          .limit(20);                                             // only first 20 not all
          res.status(200).json({
            sessions
          })
    }catch(err){
        console.log("Error in getActiveSessions controller",err.message);
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}
export async function getMyRecentSessions(req,res){
    try{
      const userId = req.user._id;
      //get the sessions where the user is either host or participant
      const sessions = await sessionModel
        .find({
          status: "completed",
          $or: [{ host: userId }, { participant: userId }],
        })
        .sort({ createdAt: -1 })
        .limit(20);

        res.status(200).json({sessions})
    }catch(err){
        console.log("Error in getMyRecentSessions controller",err.message);
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}
export async function getSessionById(req,res){
    try {
      const { id } = req.params;
      const session = await sessionModel
        .find(id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId");

        if(!session){
            return res.status(401).json({
                message:"Session not found."
            })
        }

        res.status(200).json({session})
    } catch (err) {
        console.log("Error in getSessionById controller",err.message);
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}
export async function joinSession(req,res){
    try{
        const {id}= req.params;
        const userId= req.user._id;
        const clerkId= req.user.clerkId;

        const session =await sessionModel.findById(id);
        if(!session){
            return res.status(401).json({
                message:"Session not found."
            })
        }

        //check if session is already full or not
        if(session.participant){
            return res.status(404).json({
                message:"Session is full"
            })
        }
        session.participant=userId
        await session.save()

        const channel= chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({session})
    }catch(err){
        console.log("Error in joinSession controller",err.message);
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}
export async function endSession(req,res){
    try{
        const {id}= req.params;
        const userId= req.user._id;

        const session =await sessionModel.findById(id);
        if(!session){
            return res.status(401).json({
                message:"Session not found."
            })
        }

        //check if the user is host or not 
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({
                message:"Only the host can end the session"
            })
        }

        //check if the session is already completed
        if(session.status === "completed"){
            return res.status(400).json({
                message:"Session is already completed!"
            })
        }

        session.status="completed"
        await session.save();

        //delete stream video call
        const call=streamClient.video.call("default",session.callId);
        await call.delete({hard:true});

        //delete stream chat channel
        const channel= chatClient.channel("messaging",session.callId);
        await channel.delete();


    }catch(err){
        console.log("Error in endSession controller",err.message);
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}

