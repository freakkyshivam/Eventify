  import Login from "./pages/Login"
  import  Register  from "./pages/Register"
  import { ToastContainer } from 'react-toastify';
 
 const App = () => {
   return (
     <div>
      <ToastContainer/>
      <Login/>
      <Register/>
     </div>
   )
 }
 
 export default App