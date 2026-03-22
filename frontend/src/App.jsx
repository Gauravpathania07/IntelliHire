import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { useUser } from '@clerk/clerk-react';
import {Toaster} from "react-hot-toast";
import Dashboard from './pages/Dashboard';


function App() {
  // from clerk to protect the routes ...if the user is signed in or not 
  const {isSignedIn,isLoaded}= useUser();

  //prevents the flickering effect of pages ...must use loading effect here
  if(!isLoaded){
    return null;
  }

  return (
    
    <>
    <Routes>
      <Route path='/' element={!isSignedIn?<HomePage/>:<Navigate to={"/dashboard"}/>}/>
      <Route path='/dashboard' element={isSignedIn?<Dashboard/>:<Navigate to={"/"}/>}/>
      <Route path='/problems' element={isSignedIn?<ProblemsPage/>:<Navigate to={"/"}/>}/>
    </Routes>
    <Toaster toastOptions={{duration:3000}}/>
    </>
     

  )
}

export default App
