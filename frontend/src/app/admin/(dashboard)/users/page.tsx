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
import { useState, useEffect } from "react";
import StatCard from "@/components/admin/dashboard/Statcards";
import FilterComponent from "@/components/admin/product/filter";
import DefaultTable, { Column } from "@/components/form/table/defaultTable";
import { useTableData } from "@/hooks/useTableState";
import { toast } from "sonner";
import UserPopup from "./userPopup";
import { getAllAdmins, deleteAdminUser } from "@/api/adminUser";

// User interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Main Component
export default function UsersPage() {
  const router = useRouter();

  // Popup state management
  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
  const [isEditUserPopupOpen, setIsEditUserPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllAdmins();
        setUsers(Array.isArray(data) ? data : (data.users || []));
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Define columns for the table (similar to product page)
  const userColumns: Column[] = [
    {
      id: "name",
      label: "Name",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "300px",
      render: (user: User) => (
        <div className="flex items-center space-x-4">

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      label: "Email",
      sortable: false,
      filterable: true,
      searchable: true,
      width: "300px",
      render: (user: User) => (
        <div className="flex items-center space-x-4">

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Use custom hook for table data management 
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
    data: users,
    columns: userColumns,
    defaultSort: { key: "registeredAt", direction: "desc" },
  });

  // Event handlers
  const handleEdit = (row: any, index: number) => {
    setSelectedUser(row);
    setIsEditUserPopupOpen(true);
  };

  const handleDelete = async (row: any, index: number) => {
    try {
      await deleteAdminUser(row.id);
      setUsers((prev) => prev.filter((u) => u.id !== row.id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleExport = () => {
    console.log("Export users");
    toast.success("Users exported successfully!");
  };

  const handleAddUser = () => {
    console.log("Add user clicked");
    setIsAddUserPopupOpen(true);
  };

  // Popup close handlers
  const handleCloseAddUserPopup = () => {
    setIsAddUserPopupOpen(false);
  };

  const handleCloseEditUserPopup = () => {
    setIsEditUserPopupOpen(false);
    setSelectedUser(null);
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = "5"
  const verifiedUsers = "5"

  return (
    <div className="p-6 space-y-6">
      {/* Page Header  */}
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

      {/* Statistics  */}
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
          change={`${Math.round((  totalUsers) * 100)}% active`}
          Icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          title="Verified Users"
          value={verifiedUsers.toString()}
          change={`${Math.round(( totalUsers) * 100)}% verified`}
          Icon={Mail}
          color="text-blue-600"
        />
      </div>

      {/* Table Container - */}
      <div className="bg-white border border-gray-300 rounded-lg transition-shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
            {/* Search Input -  */}
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

            {/* Action Buttons -  */}
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

        {/* Table -  */}
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
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
        )}
      </div>

      {/* User Popups */}
      <UserPopup
        isOpen={isAddUserPopupOpen}
        onClose={handleCloseAddUserPopup}
      />

      <UserPopup
        isOpen={isEditUserPopupOpen}
        onClose={handleCloseEditUserPopup}
        initialData={selectedUser ? {
          id: selectedUser.id,
          name: selectedUser.name,
          email: selectedUser.email,
        } : {}}
      />
    </div>
  );
}