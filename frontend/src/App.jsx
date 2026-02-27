
import './App.css'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/clerk-react'

function App() {
 

  return (
    <>
      <h1>Welcome to the Major Project</h1>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <SignedOutButton/>
      </SignedIn>
      <UserButton/>
    </>
  )
}

export default App;
