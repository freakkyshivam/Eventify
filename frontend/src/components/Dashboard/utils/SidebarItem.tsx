import type { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  label: string;
  active?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
};

export function SidebarItem({ label, active, icon: Icon, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
        active
          ? "bg-violet-600/15 border border-violet-500/25 text-violet-300"
          : "border border-transparent text-slate-500 hover:text-white hover:bg-white/5 hover:border-white/8"
      }`}
    >
      {/* Active left accent bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
      )}

      {/* Icon */}
      {Icon && (
        <Icon
          className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
            active ? "text-violet-400" : "text-slate-600 group-hover:text-slate-300"
          }`}
        />
      )}

      <span className="truncate">{label}</span>

      {/* Active glow dot */}
      {active && (
        <span className="ml-auto shrink-0 relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
        </span>
      )}
    </button>
  );
}