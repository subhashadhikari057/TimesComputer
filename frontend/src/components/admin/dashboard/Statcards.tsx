import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  Icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  change,
  Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg md:p-6 p-4  hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-green-600 mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-full bg-gray-50 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
