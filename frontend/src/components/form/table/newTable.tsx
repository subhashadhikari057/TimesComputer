import React from "react";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";

// Define types for the component
export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: any) => React.ReactNode;
  width?: string;
  filterable?: boolean;
  searchable?: boolean;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableData {
  [key: string]: any;
}

interface DefaultTableProps {
  columns: Column[];
  data: TableData[];
  onEdit?: (row: TableData, index: number) => void;
  onDelete?: (row: TableData, index: number) => void;
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
      className="ml-2 inline-flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
    >
      <div className="flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${
            isActive && direction === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`}
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${
            isActive && direction === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-400'
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
  className = "",
  sortConfig = null,
  onSort = () => {},
}) => {
  const handleEdit = (row: TableData, index: number) => {
    if (onEdit) {
      onEdit(row, index);
    }
  };

  const handleDelete = (row: TableData, index: number) => {
    if (onDelete) {
      onDelete(row, index);
    }
  };

  const handleSelectItem = (index: number) => {
    if (onSelectItem) {
      onSelectItem(index);
    }
  };

  const renderCellContent = (column: Column, row: TableData) => {
    return column.render(row);
  };

  // Check if all items are selected
  const isAllSelected = selectedItems.length === data.length && data.length > 0;
  
  // Check if some items are selected (for indeterminate state)
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div
      className={`bg-white border-t border-gray-300 rounded-lg hover:shadow-md transition-shadow ${className}`}
    >
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {/* Checkbox column */}
              <th
                className="text-left py-4 px-4 text-sm font-normal text-gray-400"
                style={{ width: "48px" }}
              >
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
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={column.width ? { width: column.width } : {}}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-600 ${
                    column.className || ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={column.sortable ? "cursor-pointer" : ""}>
                      {column.label}
                    </span>
                    <SortIcon column={column} sortConfig={sortConfig} onSort={onSort} />
                  </div>
                </th>
              ))}

              {/* Actions column */}
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-24">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors duration-150 ${
                  selectedItems.includes(index) ? "bg-blue-50" : ""
                }`}
              >
                {/* Checkbox column */}
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(index)}
                    onChange={() => handleSelectItem(index)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>

                {/* Dynamic data columns */}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    style={column.width ? { width: column.width } : {}}
                    className={`px-4 py-4 text-sm ${column.className || ""}`}
                  >
                    {renderCellContent(column, row)}
                  </td>
                ))}

                {/* Actions column */}
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="flex items-center justify-end">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(row, index)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row, index)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefaultTable;