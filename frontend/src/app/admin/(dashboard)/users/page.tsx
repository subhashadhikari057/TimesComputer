"use client";

import { useState } from "react";
import { GenericDataTable, TableColumn } from "@/components/form/table/table";
import { Plus, Users, UserCheck, UserX, Calendar } from "lucide-react";
import React from "react";
import { useUserTable, getuserTableHeader, User, getUserTableColumns } from "./UserTableConfig";

// Mock data for testing
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    emailVerified: true,
    registeredAt: "2024-01-15T10:30:00Z",
    lastLogin: "2024-02-10T14:20:00Z",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "manager",
    status: "active",
    emailVerified: true,
    registeredAt: "2024-01-20T09:15:00Z",
    lastLogin: "2024-02-09T16:45:00Z",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "customer",
    status: "suspended",
    emailVerified: false,
    registeredAt: "2024-02-01T11:00:00Z",
    lastLogin: "2024-02-05T10:30:00Z",
    avatar: "/api/placeholder/40/40",
  },
];



export default function UsersPage() {
  const [loading, setLoading] = useState(false);

  // Use the user table hook
  const {
    sortedUsers,
    selectedUsers,
    filters,
    updateFilter,
    resetFilters,
    sortConfig,
    handleSort,
    handleSelectAll,
    handleSelectUser,
    clearSelections,
  } = useUserTable(mockUsers);

  const handleAddUser = () => {
    console.log("Add user clicked");
  };

  const handleEdit = (userId: number) => {
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId: number) => {
    console.log("Delete user:", userId);
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete users:", selectedUsers);
  };

  const handleExport = () => {
    console.log("Export users");
  };

  // Get table configuration
  const tableHeader = getuserTableHeader(
    filters,
    updateFilter,
    resetFilters,
    selectedUsers,
    handleBulkDelete,
    handleExport
  );

  const columns = getUserTableColumns()

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
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

      {/* User Table */}
      <GenericDataTable
        header={tableHeader}
        data={sortedUsers}
        columns={columns}
        selectedItems={selectedUsers}
        onSelectItem={(id) => handleSelectUser(id as number)}
        onSelectAll={handleSelectAll}
        onEdit={(user: any) => handleEdit(user.id)}
        onDelete={(user: any) => handleDelete(user.id)}
        showSelection={true}
        getItemId={(user: any) => user.id}
        loading={loading}
        loadingMessage="Loading users..."
        sortConfig={sortConfig}
        onSort={handleSort}
        className="max-w-full"
      />
    </div>
  );
}
