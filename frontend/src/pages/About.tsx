 


 import { Calendar,Users, Zap, Award } from "lucide-react"

 const About = () => {
   return (
     <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to make your event management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Easy Event Creation
              </h3>
              <p className="text-gray-600">
                Set up your event in minutes with our intuitive interface. Add details, set pricing, and publish instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Seamless Registration
              </h3>
              <p className="text-gray-600">
                Attendees can register with just a few clicks. Support for both free and paid events with secure payments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-linear-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Real-time Analytics
              </h3>
              <p className="text-gray-600">
                Track registrations, revenue, and engagement with powerful analytics and insights dashboard.
              </p>
            </div>

            {/* Feature 4 - NEW */}
            <div className="group p-8 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Become an Organizer
              </h3>
              <p className="text-gray-600">
                Request organizer status and unlock advanced features to create and manage professional events.
              </p>
            </div>
          </div>
        </div>
      </section>
   )
 }
 
 export default About