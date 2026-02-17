import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-black/10">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">
                Join thousands of event enthusiasts
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Discover Events
              </span>
              <br />
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                That Matter
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl mb-12 text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create unforgettable experiences, connect with your community, and manage events seamlessly — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
              onClick={()=>navigate('/events')}
                size="lg" 
                className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Browse Events
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-black border-2 border-black hover:bg-black hover:text-white w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </div>

           
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default HomePage;