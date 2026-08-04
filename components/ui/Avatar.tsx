import { getInitials, getAvatarColor } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
  xl: "w-24 h-24 text-2xl",
};

export default function Avatar({ name, size = "sm", className = "" }: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-bold border-2 border-white shrink-0 ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}