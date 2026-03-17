
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import './App.css'

function App() {

  return (
    <>
     <h1>Welcome</h1>
    <SignedOut>
      <SignInButton mode='modal'> Login</SignInButton>
    </SignedOut>
      
    
     <SignedIn>
      <SignOutButton>Logout</SignOutButton>
     </SignedIn>

     <UserButton></UserButton>
    </>

  )
}

export default App
