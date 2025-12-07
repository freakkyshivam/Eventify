import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface InputType {
  label: string;
  Icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  focusColor?: "blue" | "purple" | "green";
  name: string;
  error?: string;  
}

const focusStyles = {
  blue: {
    border: "border-blue-400 shadow-lg shadow-blue-400/20",
    icon: "text-blue-400",
    toggleHover: "hover:text-blue-400",
  },
  purple: {
    border: "border-purple-400 shadow-lg shadow-purple-400/20",
    icon: "text-purple-400",
    toggleHover: "hover:text-purple-400",
  },
  green: {
    border: "border-green-400 shadow-lg shadow-green-400/20",
    icon: "text-green-400",
    toggleHover: "hover:text-green-400",
  },
} as const;

const FormInput = ({
  label,
  Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  focusColor = "purple",
  name,
  error,
}: InputType) => {
  const [focusedInput, setFocusedInput] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const styles = focusStyles[focusColor];

 
  const borderClass = error
    ? "border-red-400 shadow-lg shadow-red-500/20"
    : focusedInput
    ? styles.border
    : "border-white/10";

  const iconClass = error
    ? "text-red-400"
    : focusedInput
    ? styles.icon
    : "text-slate-400";

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="text-slate-300 text-sm font-medium mb-2 block"
      >
        {label}
      </label>

      <div
        className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm border-2 ${borderClass} rounded-2xl py-3 px-4 transition-all duration-300`}
      >
        <Icon className={`w-5 h-5 ${iconClass} transition-colors`} />

        <input
          id={name}
          name={name}
          type={type === "password" ? (isShow ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
          autoComplete="off"  
          className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setIsShow(!isShow)}
            className={`text-slate-400 ${
              error ? "hover:text-red-400" : styles.toggleHover
            } transition-colors`}
          >
            {isShow ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
