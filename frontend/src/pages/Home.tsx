 
 
import { Calendar, Zap, ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { useState } from "react";
import Auth from "./Auth";

const HomePage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [open, setOpen]  = useState(false);

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-hidden">

   <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[90px] animate-pulse delay-500" />
        {/* Subtle grid */}
        {/* <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        /> */}
      </div>
     

      {/* ── Hero Section ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-20 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
          </span>
          <Users className="w-3.5 h-3.5" />
          Join thousands of event enthusiasts
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] mb-6 max-w-4xl">
          <span className="text-white">Discover Events</span>
          <br />
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              That Matter
            </span>
            {/* Underline accent */}
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-linear-r from-violet-500/0 via-violet-500/70 to-violet-500/0 rounded-full" />
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed mb-10">
          Create unforgettable experiences, connect with your community, and manage events seamlessly —{" "}
          <span className="text-slate-300 font-medium">all in one place.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          {
            session?.user.role === "attendee" ? (
              <button
            onClick={() => navigate("/events")}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_45px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Calendar className="w-5 h-5" />
            Browse Events
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
            )
            :
            (
              <button
            onClick={() => navigate("/create-events")}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_45px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Calendar className="w-5 h-5" />
            Create Event
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
            )
          }
          

          {session ? (

            <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            Dashboard
          </button>

        
          
          )
          :
          (<button
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            Start today
          </button>

          )
        }
          
        </div>

        {open &&
        <Auth setOpen={setOpen}/>
        }
         
      </section>

    
     

    </div>
  );
};

export default HomePage;