  import Dashboard from "./pages/Dashboard";
 
  import { ToastContainer } from 'react-toastify';
 
import Layout from "./pages/Layout";
 const App = () => {
   return (
     <div>
      <ToastContainer/>
      <Layout/>
     
      <Dashboard/>
     </div>
   )
 }
 
 export default App