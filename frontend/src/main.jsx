import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router"
import { ClerkProvider } from '@clerk/clerk-react'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if(!publishableKey){
  throw new error("Missing clerk publishable key")
}

const queryClient= new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
