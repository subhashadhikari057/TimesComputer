import StatCard from "@/components/admin/dashboard/Statcards";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "2,459",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Sales",
      value: "$45,231",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Orders",
      value: "324",
      change: "+23.1%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Products",
      value: "1,234",
      change: "+2.3%",
      icon: Package,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Section - Stats Cards in 2x2 Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                Icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        {/* Right Section - Analytics Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full min-h-[348px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analytics Overview
            </h3>
            <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center p-4">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chart placeholder</p>
                <p className="text-xs text-gray-400 mt-2">
                  Revenue trends and insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Full Width Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bottom Left */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center p-4">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Recent Activity</p>
            </div>
          </div>
        </div>

        {/* Bottom Center */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h3>
          <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center p-4">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Top Products</p>
            </div>
          </div>
        </div>

        {/* Bottom Right */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order}001
                    </p>
                    <p className="text-xs text-gray-500">Customer {order}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${(100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">4h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
