import { type LucideIcon } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  theme?: "violet" | "red" | "amber" | "emerald" | "blue";
};

const themeMap = {
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    iconTheme: "text-violet-400",
    glow: "via-violet-500/50",
    hoverBg: "group-hover:bg-violet-500/15"
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    iconTheme: "text-red-400",
    glow: "via-red-500/50",
    hoverBg: "group-hover:bg-red-500/15"
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconTheme: "text-amber-400",
    glow: "via-amber-500/50",
    hoverBg: "group-hover:bg-amber-500/15"
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconTheme: "text-emerald-400",
    glow: "via-emerald-500/50",
    hoverBg: "group-hover:bg-emerald-500/15"
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    iconTheme: "text-blue-400",
    glow: "via-blue-500/50",
    hoverBg: "group-hover:bg-blue-500/15"
  }
};

export function StatsCard({ label, value, icon: Icon, theme = "violet" }: StatsCardProps) {
  const styles = themeMap[theme];

  return (
    <div className="group relative bg-[#0d1117] hover:bg-[#161f2e] border border-[#1e2d3d] hover:border-[#243447] rounded-2xl p-5 transition-all duration-300 overflow-hidden">

      {/* Subtle top glow line on hover */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${styles.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#4b6480] uppercase tracking-wider mb-2 truncate">
            {label}
          </p>
          <p className="text-2xl font-display font-bold text-[#f0f4f8] tracking-tight">
            {value}
          </p>
        </div>

        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center shrink-0 group-hover:scale-110 ${styles.hoverBg} transition-all duration-200`}>
            <Icon className={`w-4.5 h-4.5 ${styles.iconTheme}`} />
          </div>
        )}
      </div>
    </div>
  );
}