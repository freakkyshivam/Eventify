import { type LucideIcon } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: number | string;
  icon?: LucideIcon;
};

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="group relative bg-white/3 hover:bg-white/5.5 border border-white/[0.07] hover:border-white/13 rounded-2xl p-5 transition-all duration-300 overflow-hidden">

      {/* Subtle top glow line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 truncate">
            {label}
          </p>
          <p className="text-2xl font-black text-white tracking-tight">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-violet-500/15 transition-all duration-200">
            <Icon className="w-4.5 h-4.5 text-violet-400" />
          </div>
        )}
      </div>
    </div>
  );
}