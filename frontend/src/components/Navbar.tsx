import { Calendar, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { magicLinkAPI } from "@/api/magicLinkApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { fetchUser } from "@/api/userApi";
import { handleLogout } from "@/api/userApi";

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
 
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const {setSession, session} = useAuth();
   
   
  const isAuthenticated = session ? true : false;  
  const userRole = session?.user?.role;  

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect( ()=>{

    const ft = async()=>{
      const response = await fetchUser();
      setSession({
      user: response.user,
      access_token: response.accessToken
      }); 
    }
    
ft()
        
  })
  const handleMagicLink = async (email: string) => {
    try {
      setError("");
      setSuccess(false);

      if (!email.trim()) {
        setError("Email is required");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);

      const res = await magicLinkAPI(email);

      if (!res) {
        setError("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        setSuccess(true);
        setEmail("");
        setTimeout(() => {
          setShowAuthModal(false);
          setSuccess(false);
        }, 3000);

        
        
      } else {
        setError(res.msg || "Failed to send magic link");
      }
    } catch (error: any) {
      console.error("Magic link error:", error);
      setError(
        error?.response?.data?.msg ||
          "Failed to send magic link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleMagicLink(email);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setEmail("");
    setError("");
    setSuccess(false);
  };

 

  return (
    <div className="bg-black sticky top-0 z-40 shadow-lg">
      {/* Auth Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium">
                    Magic link sent! Check your email.
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  disabled={isLoading || success}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors ${
                    error
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  autoComplete="email"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              <Button
                onClick={() => handleMagicLink(email)}
                disabled={isLoading || success}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed py-6 text-base rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : success ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sent Successfully
                  </>
                ) : (
                  "Continue with Magic Link"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <a
                href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/google`}
                className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-3 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </a>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-gray-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-gray-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Calendar className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Eventify</span>
            </Link>

             

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="hidden md:flex text-black bg-white hover:bg-gray-400"
                  >
                    Logout
                  </Button>
                  <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-white font-semibold text-sm">
                      {userRole === "admin" ? "A" : userRole === "organizer" ? "O" : "U"}
                    </span>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-black hover:bg-gray-200 transition-all duration-200 px-6 rounded-lg font-medium"
                >
                  Start Today
                </Button>
              )}

              
            </div>
          </div>

         
        </div>
      </nav>
    </div>
  );
};

export default Navbar;