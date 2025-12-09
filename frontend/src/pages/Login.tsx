import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import FormInput from "@/components/custom/FormInput";
import FormFooter from "@/components/custom/FormFooter";
import { loginApi } from "@/api/axiosInstance";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginValidation, type LoginFormValues } from "./validation";

const Login:React.FC = () => {
  const [identifiers, setIdentifiers] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifiers?: string;
    password?: string;
  }>({});

    

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { identifiers?: string; password?: string } = {};

    if (!identifiers) newErrors.identifiers = "Email or username is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      const data = await loginApi({ identifiers, password });

      if (data?.success) {
        setIdentifiers("");
        setPassword("");
        toast("Hello " + data?.user?.name); 
        console.log(data);
      }else {
        toast.error(data?.message || "Login failed");
      }
     
    } catch (error) {
      console.error(error);
       toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex justify-center items-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 h-screen relative overflow-hidden"
      id="login"
    >
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-300 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <form
            method="post"
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <FormInput
              label="Email or username"
              name="identifiers"
              Icon={Mail}
              placeholder="Enter your email or username"
              value={identifiers}
              onChange={setIdentifiers}
              type="text"
              focusColor="blue"
              error={errors.identifiers}
            />

            <FormInput
              label="Password"
              name="password"
              Icon={Lock}
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              type="password"
              focusColor="blue"
              error={errors.password}
            />
            <button
              type="submit"
              disabled={loading}
              className={`group relative bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl py-3 px-6 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2  ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <FormFooter message="Don't have account ?" text=" Sign up" />

          <div className="text-center text-sm">
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-blue-500/20 to-transparent rounded-3xl blur-3xl"></div>
      </div>
    </section>
  );
};

export default Login;
