"use client";

import StatCard from "@/components/admin/dashboard/Statcards";
import {
  Users,
  Package,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Monitor,
  Smartphone,
  Tablet,
  Settings,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAuditLogs, getLoginLogs, getAllAdmins } from "@/api/adminUser";
import { getAllProducts } from "@/api/product";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUtils";
import Image from "next/image";

interface LoginLog {
  id: string;
  email: string;
  ip: string;
  success: boolean;
  userAgent: string | null;
  createdAt: string;
  deviceInfo: {
    device: string;
    browser: string;
    os: string;
  };
  formattedIp: string;
  deviceName: string;
}

interface AuditLog {
  id: string;
  actorId: string;
  targetId: string | null;
  action: string;
  message: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price?: number;
  views?: number;
  viewCount?: number;
  images?: string[];
  isPublished: boolean;
}

export default function DashboardPage() {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const [loginLogsData, auditLogsData] = await Promise.all([
          getLoginLogs(5),
          getAuditLogs(20), // Fetch 20 audit logs for scrolling
        ]);
        setLoginLogs(loginLogsData || []);
        setAuditLogs(auditLogsData || []);
      } catch (error) {
        toast.error("Failed to fetch logs");
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [usersData, productsData] = await Promise.all([
          getAllAdmins(),
          getAllProducts(),
        ]);
        setTotalUsers(Array.isArray(usersData) ? usersData.length : 0);
        setTotalProducts(Array.isArray(productsData) ? productsData.length : 0);
      } catch (error) {
        toast.error("Failed to fetch statistics");
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchTopProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await getAllProducts();
        const publishedProducts = Array.isArray(data) ? data.filter((product: any) => product.isPublished) : [];
        
        // Sort products by view count (most viewed first)
        const sortedByViews = publishedProducts.sort((a: any, b: any) => {
          const viewsA = a.views || a.viewCount || 0;
          const viewsB = b.views || b.viewCount || 0;
          return viewsB - viewsA; // Descending order (highest views first)
        });
        
        setTopProducts(sortedByViews.slice(0, 5)); // Top 5 most viewed products
      } catch (error) {
        toast.error("Failed to fetch top products");
        console.error("Error fetching top products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchLogs();
    fetchStats();
    fetchTopProducts();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'text-green-600 bg-green-100';
    if (action.includes('UPDATE')) return 'text-blue-600 bg-blue-100';
    if (action.includes('DELETE')) return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const formatActionText = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="p-6">
      {/* Top Section - Small Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        <StatCard
          title="Total Users"
          value={statsLoading ? "..." : totalUsers.toString()}
          change={statsLoading ? "" : `${totalUsers} active users`}
          Icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Total Products"
          value={statsLoading ? "..." : totalProducts.toString()}
          change={statsLoading ? "" : `${totalProducts} products in catalog`}
          Icon={Package}
          color="text-green-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Section - Recent Activity (Login Logs) */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : loginLogs.length > 0 ? (
              <div className="space-y-3">
                {loginLogs.map((log) => {
                  const DeviceIcon = getDeviceIcon(log.deviceInfo?.device || 'desktop');
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.success ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {log.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {log.success ? 'Login' : 'Failed Login'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{log.email}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <DeviceIcon className="w-3 h-3 mr-1" />
                            <span className="truncate">{log.deviceName || 'Unknown Device'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(log.createdAt)}
                        </p>
                        {log.formattedIp !== 'localhost' && (
                          <p className="text-xs text-gray-400">{log.formattedIp}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Top Products (Most Viewed) */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Top Products
          </h3>
          <div className="flex-1">
            {productsLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 text-sm font-bold text-gray-400 w-6">
                      #{index + 1}
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src={product.images?.[0] ? getImageUrl(product.images[0]) : '/image.png'}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Rs {product.price?.toLocaleString('en-IN') || 'N/A'}
                        </p>
                        <div className="flex items-center text-xs text-gray-400">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{(product.views || product.viewCount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No products found</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - System Activity (Audit Logs) */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Activity
          </h3>
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : auditLogs.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 hover:pr-1 transition-all duration-200" style={{scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F1F5F9'}}>
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(log.action)}`}>
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {formatActionText(log.action)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{log.actor.name}</p>
                        {log.message && (
                          <p className="text-xs text-gray-400 truncate max-w-[180px] mt-1">
                            {log.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No system activity</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Analytics Overview - Product Performance
        </h3>
        
        {productsLoading ? (
          <div className="bg-gray-50 rounded-lg flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : topProducts.length > 0 ? (
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="flex items-end justify-between h-64 mb-4">
                {topProducts.slice(0, 5).map((product, index) => {
                  const maxViews = Math.max(...topProducts.map(p => p.views || p.viewCount || 0));
                  const currentViews = product.views || product.viewCount || 0;
                  const height = maxViews > 0 ? (currentViews / maxViews) * 100 : 0;
                  
                  const barColors = [
                    'bg-gradient-to-t from-blue-500 to-blue-400',
                    'bg-gradient-to-t from-green-500 to-green-400', 
                    'bg-gradient-to-t from-purple-500 to-purple-400',
                    'bg-gradient-to-t from-orange-500 to-orange-400',
                    'bg-gradient-to-t from-pink-500 to-pink-400'
                  ];
                  
                  return (
                    <div key={product.id} className="flex flex-col items-center flex-1 mx-1">
                      {/* View count label */}
                      <div className="mb-2 text-center">
                        <p className="text-xs font-bold text-gray-700">
                          {currentViews.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full max-w-12 bg-gray-200 rounded-t-lg relative overflow-hidden">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${barColors[index]} shadow-lg`}
                          style={{ 
                            height: `${Math.max(height, 8)}%`,
                            minHeight: '8px'
                          }}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>
                      </div>
                      
                      {/* Product info */}
                      <div className="mt-3 text-center w-full">
                        <div className="w-8 h-8 mx-auto mb-1 rounded-full overflow-hidden border-2 border-gray-300">
                          <Image
                            src={product.images?.[0] ? getImageUrl(product.images[0]) : '/image.png'}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-800 truncate max-w-16">
                          {product.name.split(' ').slice(0, 2).join(' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{index + 1}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Chart baseline */}
              <div className="border-t-2 border-gray-300 w-full"></div>
              
              {/* Y-axis labels */}
              <div className="absolute left-2 top-6 h-64 flex flex-col justify-between text-xs text-gray-500">
                <span>{Math.max(...topProducts.map(p => p.views || p.viewCount || 0)).toLocaleString()}</span>
                <span>{Math.round(Math.max(...topProducts.map(p => p.views || p.viewCount || 0)) / 2).toLocaleString()}</span>
                <span>0</span>
              </div>
            </div>
            
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-700">
                      {topProducts.reduce((sum, p) => sum + (p.views || p.viewCount || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">Total Views</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-700">
                      {Math.round(topProducts.reduce((sum, p) => sum + (p.views || p.viewCount || 0), 0) / topProducts.length).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 font-medium">Avg. Views</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-purple-700">
                      {topProducts.length}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">Top Products</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
            
            {/* Most Popular Product Highlight */}
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 p-6 rounded-xl border border-indigo-200">
              <h4 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Most Popular Product
              </h4>
              <div className="flex items-center space-x-4">
                <Image
                  src={topProducts[0].images?.[0] ? getImageUrl(topProducts[0].images[0]) : '/image.png'}
                  alt={topProducts[0].name}
                  width={64}
                  height={64}
                  className="object-cover rounded-lg border-2 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h5 className="font-semibold text-indigo-900 text-lg">
                    {topProducts[0].name}
                  </h5>
                  <p className="text-indigo-700 font-medium">
                    Rs {topProducts[0].price?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-indigo-800">
                        {(topProducts[0].views || topProducts[0].viewCount || 0).toLocaleString()} views
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-indigo-100 rounded-full">
                      <span className="text-xs font-medium text-indigo-700">#1 Trending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg flex items-center justify-center p-12">
            <div className="text-center">
              <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">No Analytics Data</h4>
              <p className="text-sm text-gray-500 max-w-sm">
                Add products and generate some views to see beautiful analytics charts here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
