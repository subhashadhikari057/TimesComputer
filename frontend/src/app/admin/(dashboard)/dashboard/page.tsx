"use client";

import StatCard from "@/components/admin/dashboard/Statcards";
import { ShimmerText, ShimmerCard } from "@/components/common/shimmerEffect";
import {
  Users,
  Package,
  Eye,
  Activity,
  CheckCircle,
  XCircle,
  Settings,
  TrendingUp,
  Star,
  MoreHorizontal,
  ChevronRight,
  Award,
  RefreshCw,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAuditLogs, getLoginLogs, getAllAdmins } from "@/api/adminUser";
import { getAllProducts } from "@/api/product";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Interfaces
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState("bar");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Enhanced analytics data processing
  const analyticsData = useMemo(() => {
    if (!topProducts.length) return [];
    
    return topProducts.slice(0, 10).map((product, index) => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
      fullName: product.name,
      views: product.views || product.viewCount || 0,
      price: product.price || 0,
      rank: index + 1,
      id: product.id,
    }));
  }, [topProducts]);

  // No longer needed - we'll display logs separately

  // Fetch functions with better error handling
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const [loginLogsData, auditLogsData] = await Promise.all([
        getLoginLogs(10),
        getAuditLogs(50),
      ]);
      setLoginLogs(loginLogsData || []);
      setAuditLogs(auditLogsData || []);
    } catch (error) {
      toast.error("Failed to fetch activity logs");
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
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
  }, []);

  const fetchTopProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const data = await getAllProducts();
      const publishedProducts = Array.isArray(data) ? data.filter((product: any) => product.isPublished) : [];
      
      const sortedByViews = publishedProducts.sort((a: any, b: any) => {
        const viewsA = a.views || a.viewCount || 0;
        const viewsB = b.views || b.viewCount || 0;
        return viewsB - viewsA;
      });
      
      setTopProducts(sortedByViews.slice(0, 20));
    } catch (error) {
      toast.error("Failed to fetch top products");
      console.error("Error fetching top products:", error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchLogs();
    fetchStats();
    fetchTopProducts();
  }, [fetchLogs, fetchStats, fetchTopProducts]);

  // Smart refresh function - only refreshes data, not browser
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // Run all fetch functions in parallel
      await Promise.all([
        fetchLogs(),
        fetchStats(),
        fetchTopProducts(),
      ]);
      
      setLastRefresh(new Date());
    } catch (error) {
      toast.error("Failed to refresh dashboard");
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };



  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActionColor = (action: string) => {
    if (action?.includes('CREATE')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (action?.includes('UPDATE')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (action?.includes('DELETE')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-purple-600 bg-purple-50 border-purple-200';
  };

  const formatActionText = (action: string) => {
    return action?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  const totalViews = topProducts.reduce((sum, p) => sum + (p.views || p.viewCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="p-6 max-w-full">
        {/* Enhanced Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" />
                Last updated: {formatTimeAgo(lastRefresh.toISOString())}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Manual refresh button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 hover:shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Updated to 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={statsLoading ? "" : totalUsers.toLocaleString()}
            Icon={Users}
            gradient="blue"
            loading={statsLoading}
            subtitle="Active administrators"
          />
          
          <StatCard
            title="Total Products"
            value={statsLoading ? "" : totalProducts.toLocaleString()}
            Icon={Package}
            gradient="emerald"
            loading={statsLoading}
            subtitle="Published products"
          />
          
          <StatCard
            title="Total Views"
            value={productsLoading ? "" : totalViews.toLocaleString()}
            Icon={Eye}
            gradient="orange"
            loading={productsLoading}
            subtitle="Product engagement"
          />

          <StatCard
            title="Login Logs"
            value={loading ? "" : loginLogs.length.toLocaleString()}
            Icon={CheckCircle}
            gradient="purple"
            loading={loading}
            subtitle="Recent login attempts"
          />

          <StatCard
            title="Audit Logs"
            value={loading ? "" : auditLogs.length.toLocaleString()}
            Icon={Activity}
            gradient="indigo"
            loading={loading}
            subtitle="System activities"
          />
        </div>

        {/* First Row - Login Logs and Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Login Logs - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  Login Logs
                </h3>
                <div className="flex items-center space-x-2">
                  {loading && (
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                    </div>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3">
                      <ShimmerCard className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <ShimmerText className="h-4 w-3/4 mb-2" />
                        <ShimmerText className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : loginLogs.length > 0 ? (
                  loginLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.success 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {log.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {log.success ? 'Login Success' : 'Login Failed'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {log.email?.split('@')[0] + '***'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {log.deviceName || 'Unknown Device'} • {log.formattedIp}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatTimeAgo(log.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No login logs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit Logs - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  Audit Logs
                </h3>
                <div className="flex items-center space-x-2">
                  {loading && (
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                    </div>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3">
                      <ShimmerCard className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <ShimmerText className="h-4 w-3/4 mb-2" />
                        <ShimmerText className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : auditLogs.length > 0 ? (
                  auditLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                          <Settings className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {formatActionText(log.action)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {log.actor.name}
                          </p>
                          {log.message && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-32">
                              {log.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatTimeAgo(log.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No audit logs</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Top 5 Products and Most Popular Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Top 5 Products - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <Star className="w-5 h-5 text-emerald-600" />
                  </div>
                  Top 5 Products
                </h3>
                <div className="flex items-center space-x-2">
                  {productsLoading && (
                    <div className="p-1 bg-emerald-50 rounded-lg">
                      <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />
                    </div>
                  )}
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full">
                    Trending
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {productsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                      <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                        <div className="flex items-center justify-between">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : topProducts.length > 0 ? (
                  topProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="group">
                      <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index === 0 ? <Award className="w-4 h-4" /> : `#${index + 1}`}
                        </div>
                        
                        <Image
                          src={product.images?.[0] ? getImageUrl(product.images[0]) : '/image.png'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover rounded-lg"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{(product.views || product.viewCount || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Most Popular Product - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full text-white overflow-hidden relative">
              {productsLoading && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg mr-3">
                      <Star className="w-5 h-5" />
                    </div>
                    Most Popular Product
                  </h3>
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-medium">#1</span>
                  </div>
                </div>
                
                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-white/20 rounded-xl mx-auto mb-4 animate-pulse"></div>
                    <div className="h-5 bg-white/20 rounded mx-auto mb-3 w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-white/20 rounded mx-auto mb-2 w-1/2 animate-pulse"></div>
                    <div className="h-8 bg-white/20 rounded mx-auto w-2/3 animate-pulse"></div>
                  </div>
                ) : topProducts.length > 0 ? (
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <Image
                        src={topProducts[0].images?.[0] ? getImageUrl(topProducts[0].images[0]) : '/image.png'}
                        alt={topProducts[0].name}
                        width={80}
                        height={80}
                        className="object-cover rounded-xl border-3 border-white/30 shadow-lg mx-auto"
                      />
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-xl mb-2 line-clamp-2">
                      {topProducts[0].name}
                    </h4>
                    
                    <p className="text-white/90 text-lg font-semibold mb-4">
                      ₹{topProducts[0].price?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Eye className="w-5 h-5" />
                        <span className="text-2xl font-bold">
                          {(topProducts[0].views || topProducts[0].viewCount || 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm">Total Views</p>
                      
                      <div className="mt-3 flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Trending #1</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>Best Seller</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">No Products Yet</h4>
                    <p className="text-white/80 text-sm">
                      Add products to see your most popular item here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Performance Analytics - Full Width */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              Product Performance Analytics
            </h3>
            <div className="flex items-center space-x-2">
              {productsLoading && (
                <div className="p-2 bg-indigo-50 rounded-lg mr-2">
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                </div>
              )}
              <button
                onClick={() => setSelectedChart('bar')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedChart === 'bar' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setSelectedChart('area')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedChart === 'area' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Area
              </button>
            </div>
          </div>

          {productsLoading ? (
            <ShimmerCard className="h-80 w-full" />
          ) : analyticsData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === 'bar' ? (
                  <BarChart data={analyticsData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [value.toLocaleString(), name === 'views' ? 'Views' : name]}
                      labelFormatter={(label) => analyticsData.find(d => d.name === label)?.fullName || label}
                    />
                    <Bar 
                      dataKey="views" 
                      fill="url(#colorViews)"
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                ) : (
                  <AreaChart data={analyticsData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [value.toLocaleString(), name === 'views' ? 'Views' : name]}
                      labelFormatter={(label) => analyticsData.find(d => d.name === label)?.fullName || label}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#colorViewsArea)"
                    />
                    <defs>
                      <linearGradient id="colorViewsArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-xl">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">No Analytics Data</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Add products and generate views to see analytics charts here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}