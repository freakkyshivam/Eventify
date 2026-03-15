import { useState, useEffect } from "react";
import {
  Award, CheckCircle2, Clock, Sparkles,
  ArrowRight, Shield, AlertCircle
} from "lucide-react";
 
import { useAuth } from "@/hooks/useHook";
import { organizerRequestApi } from "@/api/user/userApi";

type Status = "idle" | "loading" | "sent" | "already_sent" | "error";

export default function RequestOrganizerTab() {
  const { session } = useAuth();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (session?.user?.organizer_request === true) {
      setStatus("already_sent");
    }
  }, [session]);

  const handleRequest = async () => {
    if (status !== "idle" && status !== "error") return;
    try {
      setStatus("loading");
     const res = await  organizerRequestApi();
     if(res.success){
        setStatus("sent");
     }
      
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      const msg  = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg ?? "";
      if (code === 409 || msg.toLowerCase().includes("already")) {
        setStatus("already_sent");
      } else {
        setStatus("error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-7 max-w-sm mx-auto">

      {/* ── IDLE / LOADING / ERROR ── */}
      {(status === "idle" || status === "loading" || status === "error") && (
        <>
          <div className="w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.15)]">
            <Award className="w-9 h-9 text-violet-400" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#f0f4f8] mb-2 font-display">Request Organizer Access</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              No forms. No fuss. Click the button and our team will review your request within{" "}
              <span className="text-[#f0f4f8] font-medium">24 hours</span>.
            </p>
          </div>

          {status === "error" && (
            <div className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Something went wrong. Please try again.
            </div>
          )}

          <button
            onClick={handleRequest}
            disabled={status === "loading"}
            className="group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none transition-all duration-200"
          >
            {status === "loading" ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Sending Request...
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                Request Organizer Access
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-[#4b6480]">Only one request allowed per account.</p>
        </>
      )}

      {/* ── SENT ── */}
      {status === "sent" && (
        <>
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
            <div className="absolute inset-3 rounded-full bg-emerald-500/15 border border-emerald-500/25" />
            <CheckCircle2 className="absolute inset-0 m-auto w-10 h-10 text-emerald-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3" /> Request Submitted
            </div>
            <h3 className="text-lg font-bold text-[#f0f4f8] mb-2 font-display">You're on the list!</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Our team will review your request and notify you by email within{" "}
              <span className="text-[#f0f4f8] font-medium">24 hours</span>.
            </p>
          </div>

          <div className="w-full space-y-2">
            {[
              { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, text: "Request received" },
              { icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,          text: "Review within 24 hours" },
              { icon: <Sparkles className="w-3.5 h-3.5 text-violet-400" />,      text: "Email notification on approval" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#161f2e] border border-[#1e2d3d] text-xs text-[#94a3b8]">
                {step.icon} {step.text}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ALREADY SENT ── */}
      {status === "already_sent" && (
        <>
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-amber-500/10 border border-amber-500/20" />
            <div className="absolute inset-3 rounded-full bg-amber-500/10 border border-amber-500/20" />
            <Clock className="absolute inset-0 m-auto w-10 h-10 text-amber-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Clock className="w-3 h-3" /> Under Review
            </div>
            <h3 className="text-lg font-bold text-[#f0f4f8] mb-2 font-display">Already Requested</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              You've already submitted a request. We're reviewing it and will notify you by email once approved.
            </p>
          </div>

          <div className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/15 text-xs text-amber-400 font-medium">
            <Shield className="w-4 h-4 flex-shrink-0" />
            Only one request is allowed per account.
          </div>
        </>
      )}

    </div>
  );
}