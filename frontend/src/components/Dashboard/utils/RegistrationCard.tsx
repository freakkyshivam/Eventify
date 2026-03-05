import {
  ClipboardList, Calendar, Tag, MapPin, Sparkles,
  Clock, CheckCircle2, XCircle, IndianRupee, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {type RegistrationI } from "@/types/Event";

type Props = {
  registrations: RegistrationI[] | undefined;
  loading?: boolean;
  title: string;
  subTitle: string;
  subDescription: string;
  onCardClick?: (reg: RegistrationI) => void;
};

// ── Status config ──
const regStatus = {
  registered: { icon: <CheckCircle2 className="w-2.5 h-2.5" />, cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", label: "Registered" },
  pending:    { icon: <Clock className="w-2.5 h-2.5" />,         cls: "bg-amber-500/10 border-amber-500/20 text-amber-400",   label: "Pending"     },
  cancelled:  { icon: <XCircle className="w-2.5 h-2.5" />,       cls: "bg-red-500/10 border-red-500/20 text-red-400",         label: "Cancelled"   },
};

const payStatus = {
  completed: { dot: "bg-emerald-400", cls: "text-emerald-400" },
  pending:   { dot: "bg-amber-400",   cls: "text-amber-400"   },
  failed:    { dot: "bg-red-400",     cls: "text-red-400"     },
};

const RegistrationsCard = ({
  registrations,
  loading = false,
  title,
  subTitle,
  subDescription,
  onCardClick,
}: Props) => {
  const navigate = useNavigate();

  // ── Loading ──
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden animate-pulse">
            <div className="h-28 bg-white/[0.04]" />
            <div className="p-4 space-y-2.5">
              <div className="h-3 w-3/4 rounded-full bg-white/[0.06]" />
              <div className="h-2.5 w-full rounded-full bg-white/[0.04]" />
              <div className="h-2.5 w-2/3 rounded-full bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ──
  if (!registrations || registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
          <ClipboardList className="w-7 h-7 text-slate-600" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">{subTitle}</h3>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{subDescription}</p>
        </div>
        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[10px] font-bold">
          {registrations.length}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registrations.map((reg, i) => {
          const isFree    = !reg.payment?.amount || parseFloat(reg.payment.amount) === 0;
          const regSt     = regStatus[reg.registration_status] ?? regStatus.registered;
          const paySt     = payStatus[reg.payment?.status]     ?? payStatus.pending;
          const date      = new Date(reg.registration_date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          });

          const handleClick = () =>
            onCardClick
              ? onCardClick(reg)
              : reg.event_slug
              ? navigate(`/events/${reg.event_slug}`)
              : undefined;

          return (
            <div
              key={i}
              onClick={handleClick}
              className="group relative bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-white/[0.13] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              {/* Bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Banner / header strip */}
              <div className="relative h-28 bg-gradient-to-br from-blue-900/40 to-violet-900/30 overflow-hidden flex-shrink-0">
                {reg.bannerUrls && reg.bannerUrls.length > 0 ? (
                  <img
                    src={reg.bannerUrls[0]}
                    alt={reg.event_title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/90 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {/* Price */}
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                    isFree
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                      : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                  }`}>
                    {isFree ? <><Tag className="w-2.5 h-2.5" /> Free</> : <><IndianRupee className="w-2.5 h-2.5" />{parseFloat(reg.payment.amount).toLocaleString("en-IN")}</>}
                  </div>

                  {/* Registration status */}
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border flex items-center gap-1 ${regSt.cls}`}>
                    {regSt.icon} {regSt.label}
                  </div>
                </div>

                {/* Payment status dot — top right */}
                {!isFree && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-medium text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${paySt.dot}`} />
                    {reg.payment?.status}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Event title */}
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors duration-200 line-clamp-1 mb-1">
                  {reg.event_title}
                </h4>

                {/* User */}
                <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                  <User className="w-3 h-3 text-slate-600" />
                  <span className="truncate">{reg.user_name}</span>
                  <span className="text-slate-700">·</span>
                  <span className="truncate text-slate-600">{reg.email}</span>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-auto flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                    <div className="w-4 h-4 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-2.5 h-2.5 text-violet-400" />
                    </div>
                    {date}
                  </span>

                  {reg.event_mode && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 capitalize">
                      <div className="w-4 h-4 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-2.5 h-2.5 text-blue-400" />
                      </div>
                      {reg.event_mode}
                    </span>
                  )}

                  {reg.event_category && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 capitalize ml-auto">
                      <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      </div>
                      {reg.event_category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationsCard;