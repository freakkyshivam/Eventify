  import Dashboard from "./pages/Dashboard";
 
  import { ToastContainer } from 'react-toastify';
 import HomePage from "./pages/Home";
import Navbar from "./components/Navbar";
 const App = () => {
   return (
     <div>
      <ToastContainer/>
      <Navbar/>
      <HomePage/>
     
      <Dashboard/>
     </div>
   )
 }
 
 export default App