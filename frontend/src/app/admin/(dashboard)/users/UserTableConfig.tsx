import { useState } from "react";
import { TableColumn, TableHeader } from "@/components/form/table/table";
import { Users, Calendar } from "lucide-react";
import { FilterConfig } from "@/components/admin/product/filter";
import { useFilters } from "@/hooks/useFilter";
import { useSort, createSortableColumn } from "@/hooks/useSort";
import { TableHeaderActions } from "@/components/form/table/TableHeaderActions";

// Simplified User type with only essential fields
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  registeredAt: string;
}

// Initial filter state
export const initialUserFilters = {
  search: "",
  role: "all",
};

// Simplified table columns configuration
export const getUserTableColumns = (): TableColumn<User>[] => [
  {
    id: "user",
    label: "User",
    width: "200px",
    sortable: true,
    render: (user: User) => (
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Users className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </div>
          <div className="text-sm text-gray-500 truncate">{user.email}</div>
        </div>
      </div>
    ),
  },
  {
    id: "role",
    label: "Role",
    width: "150px",
    sortable: true,
    render: (user: User) => (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
        {user.role}
      </span>
    ),
  },
  {
    id: "registered",
    label: "Registered",
    width: "150px",
    sortable: true,
    render: (user: User) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        {new Date(user.registeredAt).toLocaleDateString()}
      </div>
    ),
  },
];

// Sortable columns configuration
export const userSortableColumns = {
  user: createSortableColumn("user", (user: User) => user.name, "string"),
  role: createSortableColumn("role", (user: User) => user.role, "string"),
  registered: createSortableColumn(
    "registered",
    (user: User) => user.registeredAt,
    "date"
  ),
};

// Simplified filter function
export const filterUsers = (users: User[], filters: any) => {
  return users.filter((user) => {
    const searchTerm = filters.search as string;
    const filterRole = filters.role as string;

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });
};

// Custom hook for user table logic
export const useUserTable = (users: User[]) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Initialize filters
  const { filters, updateFilter, resetFilters } = useFilters({
    initialFilters: initialUserFilters,
  });

  // Filter users
  const filteredUsers = filterUsers(users, filters);

  // Use sorting hook with initial sort by name
  const {
    sortedData: sortedUsers,
    sortConfig,
    handleSort,
  } = useSort(filteredUsers, userSortableColumns, {
    column: "user",
    direction: "asc",
  });

  // Selection handlers
  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === sortedUsers.length
        ? []
        : sortedUsers.map((u) => u.id)
    );
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const clearSelections = () => {
    setSelectedUsers([]);
  };

  return {
    // Data
    sortedUsers,
    selectedUsers,

    // Filters
    filters,
    updateFilter,
    resetFilters,

    // Sorting
    sortConfig,
    handleSort,

    // Selection
    handleSelectAll,
    handleSelectUser,
    clearSelections,
  };
};

// Simplified filter configurations
export const userFilterConfigs: FilterConfig[] = [
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "all", label: "All Roles" },
      { value: "admin", label: "Admin" },
      { value: "manager", label: "Manager" },
      { value: "customer", label: "Customer" },
      { value: "guest", label: "Guest" },
    ],
  },
];

// Simplified table header configuration
export const getuserTableHeader = (
  filters: any,
  updateFilter: (key: string, value: any) => void,
  resetFilters: () => void,
  selectedUsers: number[],
  onBulkDelete: () => void,
  onExport: () => void
): TableHeader => ({
  headerActions: (
    <TableHeaderActions
      searchPlaceholder="Search by name or email..."
      searchValue={(filters.search as string) || ""}
      onSearchChange={(value) => updateFilter("search", value)}
      selectedItems={selectedUsers}
      onBulkDelete={onBulkDelete}
      bulkDeleteText="Delete Users"
      onExport={onExport}
      exportText="Export Users"
      filters={filters}
      filterConfigs={userFilterConfigs}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
    />
  ),
});

// Sample data structure for reference
export const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    registeredAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9fcd938?w=40&h=40&fit=crop&crop=face",
    registeredAt: "2024-02-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "customer",
    registeredAt: "2024-03-10T09:15:00Z",
  },
];