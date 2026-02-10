import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <section id="home" className="min-h-screen bg-white flex items-center">
      {/* Hero */}
      <div className="w-full text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover & Join Events Easily
            </h1>
            <p className="text-lg sm:text-xl mb-10 text-gray-600 max-w-2xl mx-auto">
              Create, manage, and attend events — free or paid — in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto px-8"
              >
                Browse Events
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-black border-2 border-black hover:bg-white   w-full sm:w-auto px-8"
              >
                Create Event
              
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;