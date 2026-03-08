import { X, Loader2, Sparkles } from "lucide-react";
 
import React, {   useState, useEffect } from "react";
import { magicLinkAPI } from "@/api/auth/magicLinkApi";
 
 
type Props = {
   
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Auth = ({  setOpen}: Props) => {

     
      const [email, setEmail] = useState("");
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState(false);
    
     
    useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
      
    
      const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
    
  

      const handleMagicLink = async (email: string) => {
        try {
          setError("");
          setSuccess(false);
          if (!email.trim()) { setError("Email is required"); return; }
          if (!validateEmail(email)) { setError("Please enter a valid email address"); return; }
          setIsLoading(true);
          const res = await magicLinkAPI(email);
          if (!res) { setError("Something went wrong. Please try again."); return; }
          if (res.success) {
            setSuccess(true);
            setEmail("");
            setTimeout(() => { setOpen(false); setSuccess(false); }, 3000);
          } else {
            setError(res.msg || "Failed to send magic link");
          }
        } catch (error: any) {
          console.error("Magic link error:", error);
          setError(error?.response?.data?.msg || "Failed to send magic link. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) handleMagicLink(email);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEmail("");
    setError("");
    setSuccess(false);
  };
  return (
    <div>
       
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-[#0f0f1a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-[0_0_80px_rgba(124,58,237,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-linear-to-r from-transparent via-violet-500 to-transparent rounded-full" />

            {/* Header */}
            <div className="flex justify-between items-start mb-7">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                <p className="text-sm text-slate-500">Sign in or create your account</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-600 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <div className="shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Magic link sent!</p>
                    <p className="text-xs text-emerald-500/70">Check your inbox to continue.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyPress={handleKeyPress}
                  placeholder="you@example.com"
                  disabled={isLoading || success}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    error
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-white/10 focus:ring-violet-500/30 focus:border-violet-500/40"
                  }`}
                  autoComplete="email"
                />
                {error && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              {/* Magic Link Button */}
              <button
                onClick={() => handleMagicLink(email)}
                disabled={isLoading || success}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending Magic Link...</>
                ) : success ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Sent Successfully</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Continue with Magic Link</>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.07]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0f0f1a] text-slate-600 font-medium">or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <a
                href={`${import.meta.env.VITE_BACKEND_DEV_URL || "http://localhost:3000/api/v1"}/auth/google`}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </a>

              {/* Terms */}
              <p className="text-[11px] text-slate-600 text-center pt-1">
                By continuing, you agree to our{" "}
                <a href="#" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
    
    </div>
  )
}

export default Auth