import { ChevronRight } from "lucide-react";
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
      className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
        active
          ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
          : "border border-transparent text-[#4b6480] hover:text-[#94a3b8] hover:bg-[#161f2e]"
      }`}
    >
      {/* Icon */}
      {Icon && (
        <Icon
          className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
            active ? "text-violet-400" : "text-[#4b6480] group-hover:text-[#94a3b8]"
          }`}
        />
      )}

      <span className="flex-1 text-left truncate">{label}</span>

      {/* Active indicator */}
      {active && (
        <ChevronRight className="w-3 h-3 text-violet-400/60 shrink-0" />
      )}
    </button>
  );
}