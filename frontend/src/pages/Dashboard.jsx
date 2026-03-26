import {useNavigate} from "react-router";
import {useUser} from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import Navbar from "../components/Navbar.jsx"
import WelcomeSection from "../components/WelcomeSection.jsx";
import StatsCards from "../components/StatsCards.jsx";
import ActiveSessions from "../components/ActiveSessions.jsx";
import RecentSessions from "../components/RecentSessions.jsx";
import CreateSessionModal from "../components/CreateSessionModal.jsx";


export default function Dashboard() {
  const navigate= useNavigate();
  const {user}= useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig,setRoomConfig]= useState({problem:"", difficulty:""});
  const createSessionMutation= useCreateSession();
  const {data:activeSessionsData, isLoading:activeSessionLoading}= useActiveSessions();
  const {data:recentSessionsData, isLoading:recentSessionLoading}= useMyRecentSessions();

  const activeSessions= activeSessionsData?.sessions || [];
  const recentSessions= recentSessionsData?.sessions || [];

  const handleCreateRoom =()=>{
    if(!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate({
      problem:roomConfig.problem,
      difficulty:roomConfig.difficulty.toLowerCase()
    },{
      onSuccess:(data)=>{
        setShowCreateModal(false);
        navigate(`/session/${data.session._id}`)
      }
    })
  }

  const isUserInSession = (session)=>{
    if(!user.id) return false;
    return session.host?.clerkId===user.id || session.participant?.clerkId===user.id
  }

  return (
    <>
     <div className="min-h-screen bg-base-300">
        <Navbar/>
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={activeSessionLoading}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={recentSessionLoading} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  )
}
