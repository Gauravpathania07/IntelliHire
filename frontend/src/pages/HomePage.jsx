import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

export default function HomePage() {
  return (
    <div>
     <button className='btn btn-secondary' onClick={()=>{
        toast.success("This is a success")
     }}>Click me</button>
    <SignedOut>
      <SignInButton mode='modal'>
        Login
      </SignInButton>
    </SignedOut>
      
    
     <SignedIn>
      <SignOutButton></SignOutButton>
     </SignedIn>

     <UserButton></UserButton>
    </div>
  )
}
