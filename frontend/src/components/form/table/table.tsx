// components/ui/GenericDataTable.tsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";

// Generic Types
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

export interface GenericTableProps<T> {
  // Table header configuration
  header?: TableHeader;

  // Data and columns
  data: T[];
  columns: TableColumn<T>[];

  // Selection functionality
  selectedItems?: (string | number)[];
  onSelectItem?: (itemId: string | number) => void;
  onSelectAll?: () => void;
  showSelection?: boolean;

  // Actions configuration
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showActions?: boolean;

  // Utility functions
  getItemId: (item: T) => string | number;

  // Empty state
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;

  // Styling
  className?: string;
  tableClassName?: string;

  // Loading state
  loading?: boolean;
  loadingMessage?: string;
}

// Base Table Components
const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className="overflow-x-auto">
    <table className={`w-full ${className}`}>{children}</table>
  </div>
);

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
);

const TableRow: React.FC<{
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, isSelected = false, className = "", onClick }) => (
  <tr
    className={`hover:bg-gray-50 transition-colors ${
      isSelected ? "bg-blue-50" : ""
    } ${onClick ? "cursor-pointer" : ""} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

const TableHeaderRow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <tr className="border-b border-gray-200">{children}</tr>;

const TableCell: React.FC<{
  children: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: string;
}> = ({ children, isHeader = false, className = "", style, width }) => {
  const Tag = isHeader ? "th" : "td";
  const baseClasses = isHeader
    ? "text-left py-4 px-4 text-sm font-medium text-gray-700"
    : "py-4 px-4 text-sm text-gray-900";

  return (
    <Tag className={`${baseClasses} ${className}`} style={{ ...style, width }}>
      {children}
    </Tag>
  );
};

const DataTableHeader: React.FC<{ header: TableHeader }> = ({ header }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      {/* Title + Description */}
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

      {/* Actions */}
      {header.headerActions && (
        <div className="flex-shrink-0">{header.headerActions}</div>
      )}
    </div>
  </div>
);

// Loading Component
const LoadingRow: React.FC<{ colSpan: number; message: string }> = ({
  colSpan,
  message,
}) => (
  <TableRow>
    <TableCell
      className="text-center py-12"
      style={{ gridColumn: `span ${colSpan}` }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500">{message}</p>
      </div>
    </TableCell>
  </TableRow>
);

// Empty State Component
const EmptyRow: React.FC<{
  colSpan: number;
  message: string;
  icon?: React.ReactNode;
}> = ({ colSpan, message, icon }) => (
  <TableRow>
    <TableCell
      className="text-center py-12"
      style={{ gridColumn: `span ${colSpan}` }}
    >
      <div className="flex flex-col items-center space-y-4">
        {icon}
        <p className="text-gray-500">{message}</p>
      </div>
    </TableCell>
  </TableRow>
);

// Edit/Delete Buttons Component
const EditDeleteButtons: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  size?: "sm" | "md" | "lg";
}> = ({ onEdit, onDelete, size = "sm" }) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1.5 text-sm";
    }
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-5 h-5";
      default:
        return "w-4 h-4";
    }
  };

  const sizeClasses = getSizeClasses(size);
  const iconSize = getIconSize(size);

  return (
    <div className="flex space-x-2">
      {/* Edit Button */}
      <button
        onClick={onEdit}
        className={`inline-flex items-center ${sizeClasses} font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
        title="Edit"
      >
        <Edit className={iconSize} />
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className={`inline-flex items-center ${sizeClasses} font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors`}
        title="Delete"
      >
        <Trash2 className={iconSize} />
      </button>
    </div>
  );
};

// Main Generic Table Component
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
  showActions = true,
  getItemId,
  emptyMessage = "No items found",
  emptyIcon,
  className = "",
  tableClassName = "",
  loading = false,
  loadingMessage = "Loading...",
}: GenericTableProps<T>) => {
  const hasActions = showActions && (onEdit || onDelete);
  const hasSelection = showSelection && onSelectItem && onSelectAll;

  // Calculate total columns for colspan
  const totalColumns =
    columns.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Table Header */}
      {header && <DataTableHeader header={header} />}

      {/* Table Content */}
      <div>
        <Table className={tableClassName}>
          <TableHeader>
            <TableHeaderRow>
              {/* Selection Header */}
              {hasSelection && (
                <TableCell isHeader width="48px">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === data.length && data.length > 0
                    }
                    onChange={onSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </TableCell>
              )}

              {/* Dynamic Column Headers */}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  isHeader
                  className={column.className}
                  width={column.width}
                >
                  {column.label}
                </TableCell>
              ))}

              {/* Actions Header */}
              {hasActions && (
                <TableCell isHeader className="text-right" width="120px">
                  Actions
                </TableCell>
              )}
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <LoadingRow colSpan={totalColumns} message={loadingMessage} />
            ) : data.length === 0 ? (
              <EmptyRow
                colSpan={totalColumns}
                message={emptyMessage}
                icon={emptyIcon}
              />
            ) : (
              data.map((item) => {
                const itemId = getItemId(item);
                const isSelected = selectedItems.includes(itemId);

                return (
                  <TableRow key={itemId} isSelected={isSelected}>
                    {/* Selection Checkbox */}
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

                    {/* Dynamic Columns */}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={column.className}
                        width={column.width}
                      >
                        {column.render(item)}
                      </TableCell>
                    ))}

                    {/* Actions Column */}
                    {hasActions && (
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <EditDeleteButtons
                            onEdit={() => onEdit?.(item)}
                            onDelete={() => onDelete?.(item)}
                            size="md"
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
