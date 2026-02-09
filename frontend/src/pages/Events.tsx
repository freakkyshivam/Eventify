 import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const Events = () => {
  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">Upcoming Events</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-black">Sample Event {id}</h3>
                <p className="text-gray-600 mb-4">Online · Free</p>
                <Button className="w-full bg-black text-white hover:bg-gray-800">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  )
}

export default Events