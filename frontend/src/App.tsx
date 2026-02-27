  import Dashboard from "./components/Dashboard/Dashboard";
 import { Route,Routes } from "react-router-dom";
  import { ToastContainer } from 'react-toastify';
  import Navbar from "./components/Navbar";

 
 import Events from "./pages/Events";
//  import Footer from "./components/Footer";
 import Layout from "./pages/Layout";
import CreateEvent from "./pages/CreateEvent";

 const App = () => {
   return (
     <div>
       <ToastContainer/>
       
       <Navbar/>
      <Routes>
     
      <Route path="/" element={<Layout/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/events" element={<Events/>}/>
       <Route path="/create-events" element={<CreateEvent/>}/>
      </Routes>
      {/* <Footer/> */}
     </div>
   )
 }
 
 export default App