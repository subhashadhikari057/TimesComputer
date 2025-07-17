"use client";

import {
  Plus,
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Calendar,
  Trash2,
  Mail,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";
import FilterComponent from "@/components/admin/product/filter";
import DefaultTable, { Column } from "@/components/form/table/newTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  registeredAt: string;
  lastLogin: string;
  avatar: string;
}

// Main Component
export default function UsersPage() {
  const router = useRouter();

  // Sample data matching the product page structure
  const userData: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "Active",
      emailVerified: true,
      registeredAt: "2025-07-01",
      lastLogin: "2025-07-15",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "manager",
      status: "Active",
      emailVerified: true,
      registeredAt: "2025-06-24",
      lastLogin: "2025-07-14",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "customer",
      status: "Inactive",
      emailVerified: false,
      registeredAt: "2025-07-15",
      lastLogin: "2025-07-15",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 4,
      name: "Alice Wilson",
      email: "alice.wilson@example.com",
      role: "customer",
      status: "Active",
      emailVerified: true,
      registeredAt: "2025-07-10",
      lastLogin: "2025-07-13",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "Mike Davis",
      email: "mike.davis@example.com",
      role: "manager",
      status: "Active",
      emailVerified: true,
      registeredAt: "2025-06-30",
      lastLogin: "2025-07-12",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 6,
      name: "Sarah Brown",
      email: "sarah.brown@example.com",
      role: "customer",
      status: "Inactive",
      emailVerified: false,
      registeredAt: "2025-06-25",
      lastLogin: "2025-07-01",
      avatar: "/api/placeholder/40/40",
    },
  ];

  // Define columns for the table (similar to product page)
  const userColumns: Column[] = [
    {
      id: "name",
      label: "User",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "300px",
      render: (user: User) => (
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="h-6 w-6 text-indigo-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 truncate flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      label: "Role",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "120px",
      render: (user: User) => {
        const roleColors = {
          admin: "bg-red-100 text-red-800",
          manager: "bg-blue-100 text-blue-800",
          customer: "bg-gray-100 text-gray-800",
        };

        return (
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-gray-400" />
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              roleColors[user.role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
            }`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      searchable: true,
      width: "120px",
      render: (user: User) => {
        const isActive = user.status === "Active";

        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {isActive ? (
              <>
                <UserCheck className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <UserX className="w-3 h-3 mr-1" />
                Inactive
              </>
            )}
          </span>
        );
      },
    },
    {
      id: "emailVerified",
      label: "Email Status",
      sortable: true,
      filterable: true,
      searchable: false,
      width: "120px",
      render: (user: User) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            user.emailVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {user.emailVerified ? (
            <>
              <UserCheck className="w-3 h-3 mr-1" />
              Verified
            </>
          ) : (
            <>
              <Mail className="w-3 h-3 mr-1" />
              Pending
            </>
          )}
        </span>
      ),
    },
    {
      id: "registeredAt",
      label: "Registered",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (user: User) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(user.registeredAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "lastLogin",
      label: "Last Login",
      sortable: true,
      filterable: false,
      searchable: false,
      width: "120px",
      render: (user: User) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(user.lastLogin).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Use custom hook for table data management (same as product page)
  const {
    searchTerm,
    filters,
    sortConfig,
    selectedItems,
    processedData,
    filterConfigs,
    handleSearchChange,
    handleFilterChange,
    handleResetFilters,
    handleSort,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
  } = useTableData({
    data: userData,
    columns: userColumns,
    defaultSort: { key: 'registeredAt', direction: 'desc' }
  });

  // Event handlers (similar to product page)
  const handleEdit = (row: any, index: number) => {
    console.log("Edit user:", row, index);
    toast.success("Edit functionality coming soon!");
  };

  const handleDelete = (row: any, index: number) => {
    console.log("Delete user:", row, index);
    toast.success("User deleted successfully!");
  };

  const handleExport = () => {
    console.log("Export users");
    toast.success("Users exported successfully!");
  };

  const handleAddUser = () => {
    console.log("Add user clicked");
    toast.success("Add user functionality coming soon!");
  };

  // Calculate stats
  const totalUsers = userData.length;
  const activeUsers = userData.filter(u => u.status === "Active").length;
  const verifiedUsers = userData.filter(u => u.emailVerified).length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header - Same structure as product page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">
            Manage your user accounts and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add User
          </button>
        </div>
      </div>

      {/* Statistics - Same structure as product page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers.toString()}
          change="+12% from last month"
          Icon={Users}
          color="text-indigo-600"
        />
        <StatCard
          title="Active Users"
          value={activeUsers.toString()}
          change={`${Math.round((activeUsers / totalUsers) * 100)}% active`}
          Icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          title="Verified Users"
          value={verifiedUsers.toString()}
          change={`${Math.round((verifiedUsers / totalUsers) * 100)}% verified`}
          Icon={Mail}
          color="text-blue-600"
        />
      </div>

      {/* Table Container - Same structure as product page */}
      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            {/* Search Input - Same as product page */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-120 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-300 focus:outline-none"
              />
            </div>

            {/* Action Buttons - Same structure as product page */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 md:justify-self-end">
              {/* Bulk Delete Button - Show only when items are selected */}
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedItems.length})
                </button>
              )}

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleExport}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>

                <div className="flex-1">
                  <FilterComponent
                    filters={filters}
                    filterConfigs={filterConfigs}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table - Same as product page */}
        <DefaultTable
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          columns={userColumns}
          data={processedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}