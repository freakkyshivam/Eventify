import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

const CTA = () => {
  return (
     
      <section className="py-20 bg-linear-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-gray-300">
            Join thousands of organizers who trust Eventify for their events
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start for Free
          </Button>
        </div>
      </section>
  )
}

export default CTA