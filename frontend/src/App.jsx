


import './App.css'
import './index.css'


import Index from './pages/Index/Index';
import Dashboard from './pages/Dashboard/Dashboard';
import ChatAssistant from './pages/ChatAssistant/ChatAssistant';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import MainLayout from './components/Index/MainLayout';



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, 
        element: <Index />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "chat",
        element: <ChatAssistant />
      }
    ]
  }
])

function App() {
  

  return (
    
    <RouterProvider router={router} />
  )
}

export default App
