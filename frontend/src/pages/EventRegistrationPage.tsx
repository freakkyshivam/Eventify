import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/axiosInstance";
import { getEventBySlugApi } from "@/api/event/eventApi";
import {
    ArrowLeft, Users, Search, RefreshCw, AlertCircle,
    Sparkles, Download, Mail, Calendar, Tag,
    CheckCircle2, Clock, XCircle, ChevronDown,
    Filter, Ticket, LayoutGrid, IndianRupee, MapPin
} from "lucide-react";
import type { eventI } from "@/types/Event";

interface Registration {
    user_name: string;
    email: string;
    event_title: string;
    registration_date: string;
    registration_status: "registered" | "cancelled" | "pending";
    payment: {
        amount: string;
        status: "completed" | "pending" | "failed" | "free";
    };
    ticket_code: string;
}

const statusConfig = {
    registered: { label: "Registered", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
    pending: { label: "Pending", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", icon: <Clock className="w-3 h-3" /> },
    cancelled: { label: "Cancelled", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", icon: <XCircle className="w-3 h-3" /> },
};

const paymentConfig = {
    completed: { label: "Paid", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
    free: { label: "Free", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
    pending: { label: "Pending", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
    failed: { label: "Failed", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
};

const EventRegistrationsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [event, setEvent] = useState<eventI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilter, setShowFilter] = useState(false);

    const fetchData = async () => {
        if (!slug) return;
        try {
            setLoading(true);
            setError("");
            const [regRes, eventRes] = await Promise.all([
                api.get(`/organizer/events/${slug}/registrations`, { withCredentials: true }),
                getEventBySlugApi(slug),
            ]);
            setRegistrations(regRes.data?.results ?? []);
            setEvent(eventRes?.results ?? null);
        } catch (err: any) {
            setError(err?.response?.data?.msg || "Failed to load registrations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [slug]);

    const filtered = registrations.filter((r) => {
        const q = search.toLowerCase();
        const matchSearch =
            r.user_name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.ticket_code.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || r.registration_status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        total: registrations.length,
        registered: registrations.filter((r) => r.registration_status === "registered").length,
        pending: registrations.filter((r) => r.registration_status === "pending").length,
        cancelled: registrations.filter((r) => r.registration_status === "cancelled").length,
    };

    const totalRevenue = registrations
        .filter((r) => r.payment.status === "completed")
        .reduce((sum, r) => sum + parseFloat(r.payment.amount || "0"), 0);

    const exportCSV = () => {
        const headers = ["Name", "Email", "Status", "Payment Status", "Amount", "Ticket Code", "Registered At"];
        const rows = filtered.map((r) => [
            r.user_name, r.email,
            r.registration_status, r.payment.status,
            r.payment.amount,
            r.ticket_code,
            new Date(r.registration_date).toLocaleString("en-IN"),
        ]);
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${slug}-registrations.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    // ── Loading ──
    if (loading) return (
        <div className="min-h-screen bg-[#080810] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium">Loading registrations...</p>
            </div>
        </div>
    );

    // ── Error ──
    if (error) return (
        <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-1">Failed to load</h3>
                    <p className="text-slate-500 text-sm max-w-xs">{error}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all duration-200">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <button onClick={fetchData} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200">
                        <RefreshCw className="w-4 h-4" /> Retry
                    </button>
                </div>
            </div>
        </div>
    );

    const isFree = event?.payment_type === "free";

    return (
        <div className="min-h-screen bg-[#080810] text-white">

            {/* Ambient orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/[0.08] blur-[110px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white font-medium mb-8 transition-colors duration-200"
                >
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:bg-white/[0.08] group-hover:border-white/[0.15] flex items-center justify-center transition-all duration-200">
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

                    {/* ── Left column ── */}
                    <div className="space-y-5">

                        {/* Search + Filter + Export */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email or ticket code..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-white text-sm placeholder:text-slate-600 transition-all"
                                />
                            </div>

                            {/* Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilter(!showFilter)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${statusFilter !== "all"
                                            ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                                            : "bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15] text-slate-400"
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="capitalize">{statusFilter === "all" ? "Filter" : statusFilter}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilter ? "rotate-180" : ""}`} />
                                </button>

                                {showFilter && (
                                    <div className="absolute right-0 top-full mt-2 w-44 bg-[#0f0f1a] border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-20">
                                        {["all", "registered", "pending", "cancelled"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => { setStatusFilter(s); setShowFilter(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold capitalize transition-colors ${statusFilter === s ? "bg-violet-500/20 text-violet-300" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                                    }`}
                                            >
                                                {s === "all" ? "All Statuses" : s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Export */}
                            <button
                                onClick={exportCSV}
                                disabled={filtered.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>

                        {/* Registration list card */}
                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">

                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <Users className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white">Registrations</h3>
                                    {filtered.length > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[10px] font-bold">
                                            {filtered.length}
                                        </span>
                                    )}
                                </div>
                                {(search || statusFilter !== "all") && (
                                    <button
                                        onClick={() => { setSearch(""); setStatusFilter("all"); }}
                                        className="text-[11px] text-slate-500 hover:text-violet-400 font-medium transition-colors"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                                        <Users className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium mb-0.5">
                                            {search || statusFilter !== "all" ? "No results found" : "No registrations yet"}
                                        </p>
                                        <p className="text-slate-600 text-xs max-w-xs">
                                            {search || statusFilter !== "all"
                                                ? "Try adjusting your search or filter."
                                                : "Registrations will appear here once people sign up."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/[0.04]">
                                    {filtered.map((reg, idx) => {
                                        const sc = statusConfig[reg.registration_status] ?? statusConfig.pending;
                                        const pc = paymentConfig[reg.payment.status] ?? paymentConfig.pending;

                                        return (
                                            <div key={idx} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors duration-150">

                                                {/* Avatar initial */}
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-black text-violet-300">
                                                        {reg.user_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <p className="text-sm font-bold text-white truncate">{reg.user_name}</p>
                                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${sc.bg} ${sc.border} ${sc.text}`}>
                                                                {sc.icon} {sc.label}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${pc.bg} ${pc.border} ${pc.text}`}>
                                                                <Tag className="w-2.5 h-2.5" />
                                                                {isFree ? "Free" : `₹${parseFloat(reg.payment.amount).toLocaleString("en-IN")}`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1.5">
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                                            <Mail className="w-3 h-3 text-slate-700" />
                                                            {reg.email}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-mono">
                                                            <Ticket className="w-3 h-3 text-slate-700 flex-shrink-0" />
                                                            {reg.ticket_code}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-600">
                                                            <Calendar className="w-3 h-3 text-slate-700 flex-shrink-0" />
                                                            {new Date(reg.registration_date).toLocaleDateString("en-IN", {
                                                                day: "numeric", month: "short", year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {registrations.length > 0 && (
                                <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
                                    <p className="text-[11px] text-slate-600">
                                        Showing <span className="text-slate-400 font-medium">{filtered.length}</span> of{" "}
                                        <span className="text-slate-400 font-medium">{registrations.length}</span> registrations
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ── Right column: sticky ── */}
                    <div className="lg:sticky lg:top-6 space-y-4">

                        {/* Event info card */}
                        {event && (
                            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                                <div className="h-0.5 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

                                {/* Banner thumb */}
                                {event.bannerUrls?.length > 0 && (
                                    <div className="relative h-28 overflow-hidden">
                                        <img src={event.bannerUrls[0]} alt={event.title} className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />
                                    </div>
                                )}

                                <div className="p-5 space-y-3">
                                    <div>
                                        <h2 className="text-sm font-black text-white leading-snug">{event.title}</h2>
                                        {event.slug && (
                                            <p className="text-[10px] font-mono text-slate-600 mt-0.5">{event.slug}</p>
                                        )}
                                    </div>

                                    <div className="h-px bg-white/[0.06]" />

                                    <div className="space-y-2">
                                        {event.event_category && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <LayoutGrid className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                                                <span className="capitalize">{event.event_category}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                            <span className="capitalize">{event.event_mode}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Tag className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                            <span>{isFree ? "Free event" : `₹${event.price} per ticket`}</span>
                                        </div>
                                        {event.capacity && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                                <span>{counts.registered} / {event.capacity} filled</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats card */}
                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Summary</p>

                            {[
                                { label: "Total", value: counts.total, color: "text-white", bg: "bg-white/[0.04]", border: "border-white/[0.09]" },
                                { label: "Registered", value: counts.registered, color: "text-emerald-400", bg: "bg-emerald-500/[0.07]", border: "border-emerald-500/15" },
                                { label: "Pending", value: counts.pending, color: "text-amber-400", bg: "bg-amber-500/[0.07]", border: "border-amber-500/15" },
                                { label: "Cancelled", value: counts.cancelled, color: "text-red-400", bg: "bg-red-500/[0.07]", border: "border-red-500/15" },
                            ].map((s) => (
                                <div key={s.label} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${s.bg} ${s.border}`}>
                                    <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                                    <span className={`text-base font-black ${s.color}`}>{s.value}</span>
                                </div>
                            ))}

                            {/* Revenue — only for paid events */}
                            {!isFree && totalRevenue > 0 && (
                                <>
                                    <div className="h-px bg-white/[0.06]" />
                                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-violet-500/[0.07] border-violet-500/15">
                                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                            <IndianRupee className="w-3 h-3 text-violet-400" /> Revenue
                                        </span>
                                        <span className="text-base font-black text-violet-400">
                                            ₹{totalRevenue.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRegistrationsPage;