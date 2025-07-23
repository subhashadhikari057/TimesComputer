// Updated DefaultTable component - Using direct width classes
import React from "react";
import {
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  KeyRound,
} from "lucide-react";

// Define types for the component
export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: Record<string, unknown>) => React.ReactNode;
  filterable?: boolean;
  searchable?: boolean;
  width?: string;
  minWidth?: string;
  // Add responsive width classes
  widthClass?: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface TableData {
  [key: string]: unknown;
}

interface DefaultTableProps {
  columns: Column[];
  data: TableData[];
  onEdit: (row: TableData, index: number) => void;
  onDelete: (row: TableData, index: number) => void;
  onResetPassword?: (row: TableData, index: number) => void;
  className?: string;
  onSelectAll?: () => void;
  onSelectItem?: (index: number) => void;
  selectedItems: number[];
  sortConfig?: SortConfig | null;
  onSort?: (columnId: string) => void;
}

// Sort Icon Component
const SortIcon: React.FC<{
  column: Column;
  sortConfig: SortConfig | null;
  onSort: (columnId: string) => void;
}> = ({ column, sortConfig, onSort }) => {
  if (!column.sortable) return null;

  const isActive = sortConfig?.key === column.id;
  const direction = sortConfig?.direction;

  return (
    <button
      onClick={() => onSort(column.id)}
      className="ml-2 inline-flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 flex-shrink-0"
    >
      <div className="flex flex-col">
        <ChevronUp
          className={`w-3 h-3 ${
            isActive && direction === "asc" ? "text-blue-600" : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-3 h-3 -mt-1 ${
            isActive && direction === "desc" ? "text-blue-600" : "text-gray-400"
          }`}
        />
      </div>
    </button>
  );
};

const DefaultTable: React.FC<DefaultTableProps> = ({
  columns,
  onSelectAll,
  onSelectItem,
  data,
  selectedItems,
  onEdit,
  onDelete,
  onResetPassword,
  className = "",
  sortConfig = null,
  onSort = () => {},
}) => {
  const renderCellContent = (column: Column, row: TableData) => {
    return column.render(row);
  };

  // Check if all items are selected
  const isAllSelected = selectedItems.length === data.length && data.length > 0;
  const isSomeSelected =
    selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div
      className={`bg-white border-t border-gray-300 rounded-lg hover:shadow-md transition-shadow ${className}`}
    >
      {/* Table container - Mobile: scrollable, Desktop: auto */}
      <div className="rounded-lg w-full min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px] lg:min-w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {/* Checkbox column */}
                <th className="w-12 lg:w-16 text-left py-4 px-3 text-sm font-normal text-gray-400">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={onSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>

                {/* Dynamic columns Header */}
                {columns.map((column) => {
                  return (
                    <th
                      key={column.id}
                      className={`px-3 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap ${
                        column.widthClass || ""
                      } ${column.className || ""}`}
                    >
                      <div className="flex items-center space-x-1 min-w-0">
                        <span
                          className={`${
                            column.sortable ? "cursor-pointer" : ""
                          } truncate min-w-0`}
                        >
                          {column.label}
                        </span>
                        <SortIcon
                          column={column}
                          sortConfig={sortConfig}
                          onSort={onSort}
                        />
                      </div>
                    </th>
                  );
                })}

                {/* Actions column */}
                <th className="w-24 lg:w-32 px-3 py-3 text-right text-sm font-medium text-gray-600 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((row, index) => {
                const isRowSelected = selectedItems.includes(index);
                return (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      selectedItems.includes(index) ? "bg-blue-50" : ""
                    }`}
                  >
                    {/* Checkbox column */}
                    <td className="w-12 lg:w-16 px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={() => onSelectItem?.(index)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>

                    {/* Dynamic data columns */}
                    {columns.map((column) => {
                      return (
                        <td
                          key={column.id}
                          className={`px-3 py-4 text-sm ${
                            column.widthClass || ""
                          } ${column.className || ""}`}
                        >
                          <div className="min-w-0 overflow-hidden">
                            {/* Product name gets word wrapping, others get truncation */}
                            <div className={column.id === 'name' ? 'break-words leading-tight line-clamp-3' : 'truncate'}>
                              {renderCellContent(column, row)}
                            </div>
                          </div>
                        </td>
                      );
                    })}

                    {/* Actions column */}
                    <td className="w-24 lg:w-32 px-3 py-4 text-sm text-gray-900">
                      <div className="flex items-center justify-end">
                        <div className="flex space-x-2">
                          {onResetPassword && (
                            <button
                              onClick={() => onResetPassword(row, index)}
                              disabled={isRowSelected}
                              className={`inline-flex items-center px-2 py-1.5 text-sm font-medium border rounded-md ${
                                isRowSelected
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  : "text-green-600 bg-white border-green-300 hover:bg-green-50 hover:text-green-700 focus:ring-green-500"
                              }`}
                              title="Reset Password"
                            >
                              <KeyRound size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(row, index)}
                            disabled={isRowSelected}
                            className={`inline-flex items-center px-2 py-1.5 text-sm font-medium border rounded-md ${
                              isRowSelected
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : "text-blue-600 bg-white border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500"
                            }`}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(row, index)}
                            disabled={isRowSelected}
                            className={`inline-flex items-center px-2 py-1.5 text-sm font-medium border rounded-md ${
                              isRowSelected
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : "text-red-600 bg-white border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-red-500"
                            }`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DefaultTable;