import { useState } from "react"
import { Lock, Mail, ArrowRight, User } from "lucide-react"
import FormInput from "@/components/custom/FormInput";
import FormFooter from "@/components/custom/FormFooter";
import { signupApi } from "@/api/axiosInstance";
import type { FormEvent } from "react";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{name?:string; email?: string; password?: string }>({});
    const handleSubmit = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
         const newErrors: { email?: string; password?: string } = {};

 if (!name) newErrors.name = "Name is required";
  if (!email) newErrors.email = "Email is required";
  if (!password) newErrors.password = "Password is required";

  setErrors(newErrors);
        setLoading(true)
        try {
            const data = await signupApi({name,email,password});
            
            if(data.success){
                 setName("");
        setEmail("");
        setPassword("")
            }

        console.log(data);
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
        
        
    }

    return (
        <section className="flex justify-center items-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 h-screen relative overflow-hidden" id='login'>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Create account</h1>
                        <p className="text-slate-300 text-sm">Sign up to get started</p>
                    </div>

                    <form 
                    method="post"
                    onSubmit={handleSubmit}
                     className="flex flex-col gap-5">

                        <FormInput
                            label="Name"
                            name="name"
                            Icon={User}
                            placeholder="Enter your Name"
                            value={name}
                            onChange={setName}
                            type="text"
                            focusColor="purple"
                            error={errors.name}
                        />


                        <FormInput
                            label="Email"
                            name="email"
                            Icon={Mail}
                            placeholder="Enter your email"
                            value={email}
                            onChange={setEmail}
                            type="email"
                            focusColor="purple"
                            error={errors.email}
                        />


                        <FormInput
                            label="Password"
                            name="password"
                            Icon={Lock}
                            placeholder="Enter your password"
                            value={password}
                            onChange={setPassword}
                            type="password"
                            focusColor="purple"
                            error={errors.password}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative bg-linear-to-r from-purple-400 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl py-3 px-6 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : "cursor-pointer"}`}
                        >
                            <span>Create account</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <FormFooter
                        message="Already have account ? "
                        text="Sign in"
                    />


                </div>


                <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-blue-500/20 to-transparent rounded-3xl blur-3xl"></div>
            </div>
        </section>
    )
}

export default Register