// components/ui/GenericDataTable.tsx
import React from "react";
import { Edit, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

// Types
export interface TableColumn<T> {
  id: string;
  label: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

export interface TableAction<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}

export interface TableHeader {
  title?: string;
  description?: string;
  showSelectAll?: boolean;
  headerActions?: React.ReactNode;
}

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface GenericTableProps<T> {
  header?: TableHeader;
  data: T[];
  columns: TableColumn<T>[];
  selectedItems?: (string | number)[];
  onSelectItem?: (itemId: string | number) => void;
  onSelectAll?: () => void;
  showSelection?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  sortConfig?: SortConfig;
  onSort?: (columnId: string) => void;
  getItemId: (item: T) => string | number;
  className?: string;
  tableClassName?: string;
  loading?: boolean;
  loadingMessage?: string;
}

// Simplified Components
const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className="overflow-x-auto rounded-lg">
    <table className={`w-full ${className}`}>{children}</table>
  </div>
);

const TableCell = ({ children, isHeader = false, className = "", style, width }: {
  children: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: string;
}) => {
  const Tag = isHeader ? "th" : "td";
  const baseClasses = isHeader
    ? "text-left py-4 px-4 text-sm font-normal text-gray-400"
    : "py-4 px-4 text-sm text-gray-900";

  return (
    <Tag className={`${baseClasses} ${className}`} style={{ ...style, width }}>
      {children}
    </Tag>
  );
};

// Sort Icon
const SortIcon = ({ column, sortConfig, onSort }: {
  column: TableColumn<any>;
  sortConfig?: SortConfig;
  onSort?: (columnId: string) => void;
}) => {
  if (!column.sortable || !onSort) return null;

  const isActive = sortConfig?.column === column.id;
  const direction = isActive ? sortConfig.direction : null;

  const getIcon = () => {
    if (!isActive || direction === null) return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    return direction === "asc" ? 
      <ChevronUp className="w-4 h-4 text-gray-600" /> : 
      <ChevronDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <button
      onClick={() => onSort(column.id)}
      className="ml-2 inline-flex items-center hover:text-gray-600 focus:outline-none"
      title={`Sort by ${column.label}`}
    >
      {getIcon()}
    </button>
  );
};

// Actions Buttons
const ActionButtons = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void; }) => (
  <div className="flex space-x-2">
    <button
      onClick={onEdit}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
      title="Edit"
    >
      <Edit className="w-4 h-4" />
    </button>
    <button
      onClick={onDelete}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

// Main Component
export const GenericDataTable = <T,>({
  header,
  data,
  columns,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  showSelection = true,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  getItemId,
  className = "",
  tableClassName = "",
  loading = false,
  loadingMessage = "Loading...",
}: GenericTableProps<T>) => {
  const hasActions = onEdit || onDelete;
  const hasSelection = showSelection && onSelectItem && onSelectAll;
  const totalColumns = columns.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <div className={`bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      {header && (header.title || header.description) && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-lg bg-white">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              {header.title && (
                <h3 className="text-base sm:text-lg md:text-xl font-medium leading-5 sm:leading-6 text-gray-900">
                  {header.title}
                </h3>
              )}
              {header.description && (
                <p className="hidden sm:block mt-1 text-sm text-gray-500">
                  {header.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      {header?.headerActions && (
        <div className="px-6 py-6 bg-white border-b border-gray-200">
          {header.headerActions}
        </div>
      )}

      {/* Table */}
      <Table className={`${tableClassName}`}>
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {/* Selection Header */}
            {hasSelection && (
              <TableCell isHeader width="48px">
                <input
                  type="checkbox"
                  checked={selectedItems.length === data.length && data.length > 0}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </TableCell>
            )}

            {/* Column Headers */}
            {columns.map((column) => (
              <TableCell
                key={column.id}
                isHeader
                className={`${column.className} ${column.sortable ? "select-none" : ""}`}
                width={column.width}
              >
                <div className="flex items-center justify-between">
                  <span className={column.sortable ? "cursor-pointer" : ""}>{column.label}</span>
                  <SortIcon column={column} sortConfig={sortConfig} onSort={onSort} />
                </div>
              </TableCell>
            ))}

            {/* Actions Header */}
            {hasActions && (
              <TableCell isHeader className="text-right" width="120px">
                Actions
              </TableCell>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {loading ? (
            <tr>
              <TableCell className="text-center py-12" style={{ gridColumn: `span ${totalColumns}` }}>
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500">{loadingMessage}</p>
                </div>
              </TableCell>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <TableCell className="text-center py-12" style={{ gridColumn: `span ${totalColumns}` }}>
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-gray-500">No items found</p>
                </div>
              </TableCell>
            </tr>
          ) : (
            data.map((item) => {
              const itemId = getItemId(item);
              const isSelected = selectedItems.includes(itemId);

              return (
                <tr
                  key={itemId}
                  className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                >
                  {/* Selection */}
                  {hasSelection && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectItem(itemId)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </TableCell>
                  )}

                  {/* Columns */}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={column.className}
                      width={column.width}
                    >
                      {column.render(item)}
                    </TableCell>
                  ))}

                  {/* Actions */}
                  {hasActions && (
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <ActionButtons
                          onEdit={() => onEdit?.(item)}
                          onDelete={() => onDelete?.(item)}
                        />
                      </div>
                    </TableCell>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};