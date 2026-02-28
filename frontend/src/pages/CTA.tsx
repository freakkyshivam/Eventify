import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import Auth from "./Auth";

const CTA = () => {

  const [open,setOpen] = useState(false);
   return (
     
      <section className="py-20 bg-gray-200 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-gray-400">
            Join thousands of organizers who trust Eventify for their events
          </p>
          <Button 
            onClick={()=> setOpen(true)}
            size="lg" 
            className="bg-purple-600 text-black hover:bg-purple-500 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start for Free
          </Button>
        </div>

        {open && (
          <Auth setOpen = {setOpen}/>
        )}
      </section>
  )
}

export default CTA