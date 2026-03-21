import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { useUser } from '@clerk/clerk-react';
import {Toaster} from "react-hot-toast";


function App() {
  // from clerk to protect the routes ...if the user is signed in or not 
  const {isSignedIn}= useUser();

  return (
    
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/problems' element={isSignedIn?<ProblemsPage/>:<Navigate to={"/"}/>}/>
    </Routes>
    <Toaster toastOptions={{duration:3000}}/>
    </>
     

  )
}

export default App
