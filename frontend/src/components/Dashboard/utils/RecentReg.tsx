import { ClipboardList, IndianRupee, Tag, User, CheckCircle2, Clock, XCircle } from "lucide-react";
import {type RegistrationI } from "@/types/Event";


interface Props {
  registrations: RegistrationI[] | undefined;
  loading: boolean;
}

const statusConfig = {
  registered: {
    icon: <CheckCircle2 className="w-2.5 h-2.5" />,
    cls: "bg-emerald-500/10 text-emerald-400",
    label: "Registered",
  },
  pending: {
    icon: <Clock className="w-2.5 h-2.5" />,
    cls: "bg-amber-500/10 text-amber-400",
    label: "Pending",
  },
  cancelled: {
    icon: <XCircle className="w-2.5 h-2.5" />,
    cls: "bg-red-500/10 text-red-400",
    label: "Cancelled",
  },
} as const;

const RecentRegistrations = ({ registrations, loading }: Props) => {
  return (
    <div>
      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-violet-600/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-600 animate-spin" />
          </div>
          <p className="text-[#4b6480] text-xs">Loading registrations...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && (!registrations || registrations.length === 0) && (
        <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#4b6480]" />
          </div>
          <div>
            <p className="text-[#94a3b8] text-xs font-medium mb-0.5">No registrations yet</p>
            <p className="text-[#4b6480] text-xs">Registrations will appear here once people sign up.</p>
          </div>
        </div>
      )}

      {/* List */}
      {!loading && registrations?.slice(0, 4).map((reg, i) => {
        const isFree   = !reg.payment?.amount || parseFloat(reg.payment.amount) === 0;
        const status   = statusConfig[reg.registration_status as keyof typeof statusConfig] ?? statusConfig.registered;
        const date     = new Date(reg.registration_date).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        });

        return (
          <div
            key={i}
            className="mb-2 group flex gap-3 p-3 rounded-xl bg-[#161f2e] hover:bg-[#111827] border border-[#1e2d3d] hover:border-[#243447] transition-all duration-200 cursor-pointer"
          >
            {/* Color dot */}
            <div className="w-1 rounded-full bg-gradient-to-b from-blue-600 to-violet-600 flex-shrink-0 self-stretch" />

            <div className="flex-1 min-w-0">
              {/* User + event */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#f0f4f8] group-hover:text-blue-400 transition-colors line-clamp-1">
                    {reg.event_title}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#4b6480] mt-0.5">
                    <User className="w-2.5 h-2.5 text-[#4b6480]" />
                    {reg.user_name}
                  </span>
                </div>

                {/* Registration status */}
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${status.cls}`}>
                  {status.icon} {status.label}
                </span>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-1.5">
                {/* Date */}
                <span className="inline-flex items-center gap-1 text-[10px] text-[#4b6480]">
                  <Clock className="w-2.5 h-2.5 text-violet-400" />
                  {date}
                </span>

                {/* Amount */}
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                  isFree ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {isFree ? (
                    <><Tag className="w-2.5 h-2.5" /> Free</>
                  ) : (
                    <><IndianRupee className="w-2.5 h-2.5" /> {parseFloat(reg.payment.amount).toLocaleString("en-IN")}</>
                  )}
                </span>

                {/* Payment status */}
                {!isFree && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                    reg.payment?.status === "completed"
                      ? "text-emerald-500"
                      : reg.payment?.status === "pending"
                      ? "text-amber-500"
                      : "text-red-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      reg.payment?.status === "completed" ? "bg-emerald-400"
                      : reg.payment?.status === "pending"  ? "bg-amber-400"
                      : "bg-red-400"
                    }`} />
                    {reg.payment?.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentRegistrations;