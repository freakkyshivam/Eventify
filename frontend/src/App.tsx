  import Dashboard from "./pages/Dashboard";
 import { Route,Routes } from "react-router-dom";
  import { ToastContainer } from 'react-toastify';
  import { Slide } from "react-toastify";
  import Navbar from "./components/Navbar";

 
 import Events from "./pages/Events";
 import HomePage from "./pages/Hero";
import CreateEvent from "./pages/CreateEvent";
import EventDetailPage from "./pages/EventDetails";
import EditEventPage from "./components/Dashboard/utils/EditEventPage";
import EventRegistrationsPage from "./pages/EventRegistrationPage";
 const App = () => {
   return (
     <div>
     <ToastContainer
  position="bottom-right"
  autoClose={3000}
  transition={Slide}
  hideProgressBar
  closeButton ={false}
  toastClassName={() =>
    "relative overflow-hidden backdrop-blur-xl bg-[#0d1117]/90 border border-[#1e2d3d] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.4)] text-[#f0f4f8] py-3 px-4 flex gap-2 mb-2"
  }
/>
       
       <Navbar/>
      <Routes>
     
      <Route path="/" element={<HomePage/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/dashboard/:tab" element={<Dashboard/>}/>
       <Route path="/events" element={<Events/>}/>
       <Route path="/create-events" element={<CreateEvent/>}/>
       <Route path="/events/:slug" element={<EventDetailPage />} />
       <Route path="/organizer/events/:slug/edit" element={<EditEventPage />} />
       <Route path="/events/:slug/registrations" element={<EventRegistrationsPage />} />
      </Routes>
    
      </div>
   )
 }
 
 export default App