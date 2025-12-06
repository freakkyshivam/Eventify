import { useState } from "react"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
 

const Login = () => {
    const [isShow, setIsShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(null);

    return (
        <section className="flex justify-center items-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 h-screen relative overflow-hidden" id='login'>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>
 
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                  
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-300 text-sm">Enter your credentials to continue</p>
                    </div>

                    <form method="post" className="flex flex-col gap-5">

                 

                        <div className="relative">
                            <label className="text-slate-300 text-sm font-medium mb-2 block">Email</label>
                            <div className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm border-2 ${focusedInput === 'email' ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-white/10'} rounded-2xl py-3 px-4 transition-all duration-300`}>
                                <Mail className={`w-5 h-5 ${focusedInput === 'email' ? 'text-blue-400' : 'text-slate-400'} transition-colors`} />
                                <input 
                                    type="text"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
                                />
                            </div>
                        </div>

                    
                        <div className="relative">
                            <label className="text-slate-300 text-sm font-medium mb-2 block">Password</label>
                            <div className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm border-2 ${focusedInput === 'password' ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-white/10'} rounded-2xl py-3 px-4 transition-all duration-300`}>
                                <Lock className={`w-5 h-5 ${focusedInput === 'password' ? 'text-blue-400' : 'text-slate-400'} transition-colors`} />
                                <input
                                    type={isShow ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsShow(!isShow)}
                                    className="text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                    {isShow ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                         
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                        </div>

                     
                        <button 
                            type="submit" 
                            className="group relative bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl py-3 px-6 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-slate-400 text-sm">OR</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                     <div className="flex gap-3 mb-6">
                            <button 
                                type="button"
                                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                        </div>

                
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account? 
                            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors">Sign up</a>
                        </p>
                    </div>
                </div>

 
                <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-blue-500/20 to-transparent rounded-3xl blur-3xl"></div>
            </div>
        </section>
    )
}

export default Login