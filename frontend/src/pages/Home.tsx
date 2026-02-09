
import { Button } from "@/components/ui/button";



const HomePage = () => {

  return (
    <section id="home" className="min-h-screen bg-black">



      {/* Hero */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Discover & Join Events Easily
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Create, manage, and attend events — free or paid — in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Browse Events
              </Button>
              <Button size="lg" className="bg-transparent text-white border border-white hover:bg-white hover:text-black">
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