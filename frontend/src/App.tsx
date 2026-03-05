  import Dashboard from "./pages/Dashboard";
 import { Route,Routes } from "react-router-dom";
  import { ToastContainer } from 'react-toastify';
  import { Slide } from "react-toastify";
  import Navbar from "./components/Navbar";

 
 import Events from "./pages/Events";
//  import Footer from "./components/Footer";
 import Layout from "./pages/Layout";
import CreateEvent from "./pages/CreateEvent";
import EventDetailPage from "./pages/EventDetails";
import EditEventPage from "./components/Dashboard/utils/EditEventPage";

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
    "relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl text-white py-3 px-4 flex gap-2 mb-2"
  }
/>
       
       <Navbar/>
      <Routes>
     
      <Route path="/" element={<Layout/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/events" element={<Events/>}/>
       <Route path="/create-events" element={<CreateEvent/>}/>
       <Route path="/events/:slug" element={<EventDetailPage />} />
       <Route path="/organizer/events/:slug/edit" element={<EditEventPage />} />
      </Routes>
    
      {/* <Footer/> */}
     </div>
   )
 }
 
 export default App