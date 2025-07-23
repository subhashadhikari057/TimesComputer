import { ShimmerText } from "@/components/common/shimmerEffect";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  gradient?: string;
  changeDirection?: "up" | "down" | "neutral";
  subtitle?: string;
  loading?: boolean;
}

// Predefined gradient options based on the dashboard design
const gradientOptions = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  pink: "bg-gradient-to-br from-pink-500 to-pink-600",
};

export default function StatCard({
  title,
  value,
  Icon,
  gradient,
  changeDirection = "up",
  subtitle,
  loading = false, // Default to false
}: StatCardProps) {
  // Use gradient prop or fall back to blue
  const cardGradient =
    gradient && gradientOptions[gradient as keyof typeof gradientOptions]
      ? gradientOptions[gradient as keyof typeof gradientOptions]
      : gradientOptions.blue;

  // Determine change color and icon based on direction
  const getChangeStyles = () => {
    switch (changeDirection) {
      case "up":
        return {
          color: "text-white/90",
          icon: ArrowUp,
          bg: "text-white/90",
        };
      case "down":
        return {
          color: "text-white/90",
          icon: ArrowDown,
          bg: "text-white/90",
        };
      default:
        return {
          color: "text-white/90",
          icon: ArrowUp,
          bg: "text-white/90",
        };
    }
  };

  const changeStyles = getChangeStyles();

  return (
    <div
      className={`${cardGradient} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>

          {loading ? (
            <div className="mb-2">
              <ShimmerText width="20%" className="h-9" />
            </div>
          ) : (
            <p className="text-3xl font-bold mt-1 mb-2">{value}</p>
          )}

          {!loading && subtitle && (
            <p className="text-white/70 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
