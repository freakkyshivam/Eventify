import { useEffect, useState } from "react";
import {
  Ticket, CheckCircle2, Calendar,Clock,  AlertCircle,
  Sparkles, Copy, Check, BadgeCheck, CreditCard, Receipt,ChevronUp,ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserAllTickets } from "@/api/user/userApi";

 
export interface TicketItem {
  payment_status: "completed" | "pending" | "failed";
  registration_id: string;
  payment_id: string;
  razorpay_order_id: string;
  ticket_code: string;
  registration_status: "registered" | "cancelled" | "pending";
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  event_status: "upcoming" | "completed" | "cancelled" | "ongoing";
}

// ── Event status config ──
const eventStatusCfg = {
  upcoming:  { label: "Upcoming",  chip: "bg-blue-500/10 border-blue-500/25 text-blue-400",     dot: "bg-blue-400" },
  ongoing:   { label: "Live Now",  chip: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400", dot: "bg-emerald-400" },
  completed: { label: "Completed", chip: "bg-slate-500/10 border-slate-500/25 text-slate-500",   dot: "bg-slate-500" },
  cancelled: { label: "Cancelled", chip: "bg-red-500/10 border-red-500/25 text-red-400",         dot: "bg-red-400" },
};

// ── Inline copy hook ──
function useCopy() {
  const [key, setKey] = useState<string | null>(null);
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setKey(id);
    setTimeout(() => setKey(null), 2000);
  };
  return { copiedKey: key, copy };
}

// ── Small copy button ──
const CopyBtn = ({ value, id, copiedKey, onCopy }: {
  value: string; id: string; copiedKey: string | null;
  onCopy: (v: string, k: string) => void;
}) => (
  <button
    onClick={() => onCopy(value, id)}
    className="w-6 h-6 rounded-md bg-white/4 hover:bg-violet-500/20 border border-white/[0.07] hover:border-violet-500/30 flex items-center justify-center text-slate-600 hover:text-violet-400 transition-all duration-200 shrink-0"
  >
    {copiedKey === id
      ? <Check className="w-3 h-3 text-emerald-400" />
      : <Copy className="w-3 h-3" />}
  </button>
);

// ── Single Ticket Card ──
const TicketCard = ({ ticket, index }: { ticket: TicketItem; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const { copiedKey, copy } = useCopy();

  const evtCfg = eventStatusCfg[ticket.event_status] ?? eventStatusCfg.upcoming;
  const isCompleted = ticket.event_status === "completed";

  const startDate = new Date(ticket.start_time).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const startTime = new Date(ticket.start_time).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
  const endDate = new Date(ticket.end_time).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const endTime = new Date(ticket.end_time).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
  const deadline = new Date(ticket.registration_deadline).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
      isCompleted
        ? "bg-white/1.5 border-white/5 opacity-60"
        : "bg-white/3 border-white/[0.07] hover:border-white/13 hover:-translate-y-0.5"
    }`}>

      {/* Bottom glow */}
      {!isCompleted && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${
        ticket.event_status === "ongoing"   ? "bg-linear-to-b from-emerald-400 to-teal-500"
        : ticket.event_status === "upcoming"  ? "bg-linear-to-b from-violet-500 to-fuchsia-500"
        : ticket.event_status === "completed" ? "bg-slate-700"
        : "bg-red-700"
      }`} />

      <div className="pl-5 pr-4 pt-4 pb-3 space-y-3">

        {/* ── Top: Event info + status ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Event title */}
            <h4 className="text-sm font-bold text-white line-clamp-1 mb-1 group-hover:text-violet-300 transition-colors">
              {ticket.title}
            </h4>
            {/* Description */}
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Event status badge */}
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold shrink-0 ${evtCfg.chip}`}>
            {ticket.event_status === "ongoing" ? (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${evtCfg.dot}`} />
              </span>
            ) : (
              <span className={`w-1.5 h-1.5 rounded-full ${evtCfg.dot}`} />
            )}
            {evtCfg.label}
          </div>
        </div>

        {/* ── Date/time strip ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3 text-violet-400" />
            {startDate}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-blue-400" />
            {startTime} – {endTime}
          </span>
          <span className="ml-auto font-mono text-[10px] font-bold text-violet-400/80 tracking-wider">
            #{index + 1}
          </span>
        </div>

        {/* ── Ticket code strip ── */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/6 border border-violet-500/15">
          <BadgeCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <p className="flex-1 font-mono text-xs font-bold text-violet-300 tracking-widest truncate">
            {ticket.ticket_code}
          </p>
          <CopyBtn value={ticket.ticket_code} id={`tc-${ticket.registration_id}`} copiedKey={copiedKey} onCopy={copy} />
        </div>

        {/* ── Expand toggle ── */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/1 text-slate-600 hover:text-slate-300 transition-all duration-200 text-xs font-medium"
        >
          <span>{expanded ? "Hide payment details" : "Show payment details"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* ── Expanded payment details ── */}
        {expanded && (
          <div className="space-y-2 pt-1">
            <div className="border-t border-dashed border-white/[0.07]" />

            {[
              {
                icon: <Ticket className="w-3 h-3 text-violet-400" />,
                bg: "bg-violet-500/10 border-violet-500/20",
                label: "Registration ID",
                value: ticket.registration_id,
                id: `reg-${ticket.registration_id}`,
              },
              {
                icon: <CreditCard className="w-3 h-3 text-blue-400" />,
                bg: "bg-blue-500/10 border-blue-500/20",
                label: "Payment ID",
                value: ticket.payment_id,
                id: `pay-${ticket.payment_id}`,
              },
              {
                icon: <Receipt className="w-3 h-3 text-amber-400" />,
                bg: "bg-amber-500/10 border-amber-500/20",
                label: "Order ID",
                value: ticket.razorpay_order_id,
                id: `ord-${ticket.razorpay_order_id}`,
              },
              {
                icon: <Calendar className="w-3 h-3 text-slate-400" />,
                bg: "bg-slate-500/10 border-slate-500/20",
                label: "Deadline",
                value: deadline,
                id: null,
              },
              {
                icon: <Clock className="w-3 h-3 text-fuchsia-400" />,
                bg: "bg-fuchsia-500/10 border-fuchsia-500/20",
                label: "End",
                value: `${endDate} · ${endTime}`,
                id: null,
              },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${row.bg}`}>
                  {row.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider leading-none mb-0.5">{row.label}</p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">{row.value}</p>
                </div>
                {row.id && (
                  <CopyBtn value={row.value} id={row.id} copiedKey={copiedKey} onCopy={copy} />
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
 

export function MyTicketsTab( ) {

  const navigate = useNavigate();
   const [tickets, setTicket] = useState<TicketItem[]>()
  const [loading, setLoading] = useState(false);

   const fetchTickets = async ()=>{
    setLoading(true);
    try {
      const res = await getUserAllTickets();
      console.log(res);
      
      if(!res) return;
      if(Array.isArray(res.results)){
       setTicket(res.results)
      }
   } catch (error: unknown) {
      console.error("Failed to fetch tickets :", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchTickets();
  },[])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
          <Ticket className="absolute inset-0 m-auto w-4 h-4 text-violet-400" />
        </div>
        <p className="text-slate-500 text-sm">Loading tickets...</p>
      </div>
    );
  }

  if (!tickets) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center">
          <Ticket className="w-7 h-7 text-slate-600" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">No Tickets Yet</h3>
          <p className="text-slate-500 text-sm max-w-xs">Tickets for events you register for will appear here.</p>
        </div>
        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" /> Browse Events
        </button>
      </div>
    );
  }

  const upcoming  = tickets.filter((t) => t.event_status === "upcoming");
  const ongoing   = tickets.filter((t) => t.event_status === "ongoing");
  const completed = tickets.filter((t) => t.event_status === "completed");

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Ticket className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <h3 className="text-sm font-bold text-white">My Tickets</h3>
        <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold">
          {tickets.length}
        </span>

        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          {ongoing.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              {ongoing.length} Live
            </span>
          )}
          {upcoming.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <CheckCircle2 className="w-2.5 h-2.5" /> {upcoming.length} Upcoming
            </span>
          )}
          {completed.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 border border-slate-500/20 text-slate-500">
              <AlertCircle className="w-2.5 h-2.5" /> {completed.length} Completed
            </span>
          )}
        </div>
      </div>

      {/* Tickets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tickets.map((ticket, i) => (
          <TicketCard key={ticket.registration_id} ticket={ticket} index={i} />
        ))}
      </div>

    </div>
  );
}