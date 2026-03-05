import { Calendar  } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { handleLogout } from "@/api/auth/logout";
 

const Navbar = () => {
   
 

  // const navigate = useNavigate();
  const {  session } = useAuth();

  const isAuthenticated = session ? true : false;
  const roleLabel = session?.user?.role
   
  return (
    <div className="bg-[#080810]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/6 ">

      

      {/* ── Navbar ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 group-hover:bg-violet-600/30 transition-all duration-200">
              <Calendar className="h-4 w-4 text-violet-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors duration-200">
              Eventify
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200"
                >
                  Logout
                </button>

               
                <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-none">{roleLabel}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Account</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl   flex items-center justify-center cursor-pointer hover:scale-105   transition-all duration-200 ">
                    <img className="w-9 h-9 rounded-xl text-white font-bold text-xs" src={session?.user?.profileImage}/>
                  </div>
                </div>
              </>
            )  
            }
          </div>

          

        </div>
      </nav>
    </div>
  );
};

export default Navbar;