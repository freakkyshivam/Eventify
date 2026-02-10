import Navbar from "@/components/Navbar"
import HomePage from "./Home"
import Events from "./Events"
import Footer from '@/components/Footer'

const Layout = () => {
  return (
    <div>
        <Navbar/>
        <HomePage/>
        <Events/>
        <Footer/>
    </div>
  )
}

export default Layout