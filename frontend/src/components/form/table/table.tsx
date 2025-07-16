// components/ui/GenericDataTable.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// Generic Types
export interface TableColumn<T> {
  id: string;
  label: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
}

export interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  selectedItems: (string | number)[];
  onSelectItem: (itemId: string | number) => void;
  onSelectAll: () => void;
  primaryAction?: TableAction<T>;
  dropdownActions?: TableAction<T>[];
  getItemId: (item: T) => string | number;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
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
  <thead>{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-gray-200">{children}</tbody>
);

const TableRow: React.FC<{
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
}> = ({ children, isSelected = false, className = "" }) => (
  <tr
    className={`hover:bg-gray-50 transition-colors ${
      isSelected ? "bg-blue-50" : ""
    } ${className}`}
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
}> = ({ children, isHeader = false, className = "", style }) => {
  const Tag = isHeader ? "th" : "td";
  const baseClasses = isHeader
    ? "text-left py-4 px-4 text-sm font-medium text-gray-700"
    : "py-4 px-4";

  return (
    <Tag className={`${baseClasses} ${className}`} style={style}>
      {children}
    </Tag>
  );
};

// Split Button Component
const SplitButton: React.FC<{
  primaryAction: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
  dropdownItems: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}> = ({ primaryAction, dropdownItems, isOpen, onToggle, onClose }) => (
  <div className="relative inline-flex">
    {/* Primary Button */}
    <button
      onClick={primaryAction.onClick}
      className="relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
    >
      {primaryAction.icon}
      {primaryAction.label}
    </button>

    {/* Dropdown Trigger Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="relative inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 bg-white border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <ChevronDown className="w-4 h-4" />
    </button>

    {/* Dropdown Menu */}
    {isOpen && (
      <div
        className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg top-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          {dropdownItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Main Generic Table Component
export const GenericDataTable = <T,>({
  data,
  columns,
  selectedItems,
  onSelectItem,
  onSelectAll,
  primaryAction,
  dropdownActions = [],
  getItemId,
  emptyMessage = "No items found",
  emptyIcon,
}: GenericTableProps<T>) => {
  const [openDropdown, setOpenDropdown] = useState<string | number | null>(
    null
  );

  const toggleDropdown = (itemId: string | number) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const hasActions = primaryAction || dropdownActions.length > 0;

  return (
    <div onClick={closeDropdown}>
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableCell isHeader>
              <input
                type="checkbox"
                checked={
                  selectedItems.length === data.length && data.length > 0
                }
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={column.id} isHeader className={column.className}>
                {column.label}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell isHeader className="text-right">
                Actions
              </TableCell>
            )}
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center py-12"
                style={{
                  gridColumn: `span ${columns.length + (hasActions ? 2 : 1)}`,
                }}
              >
                <div className="flex flex-col items-center space-y-4">
                  {emptyIcon}
                  <p className="text-gray-500">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const itemId = getItemId(item);
              return (
                <TableRow
                  key={itemId}
                  isSelected={selectedItems.includes(itemId)}
                >
                  {/* Selection Checkbox */}
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(itemId)}
                      onChange={() => onSelectItem(itemId)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </TableCell>

                  {/* Dynamic Columns */}
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.render(item)}
                    </TableCell>
                  ))}

                  {/* Actions */}
                  {hasActions && (
                    <TableCell>
                      <div className="flex items-center justify-end">
                        {primaryAction && dropdownActions.length > 0 ? (
                          <SplitButton
                            primaryAction={{
                              label: primaryAction.label,
                              icon: primaryAction.icon,
                              onClick: () => primaryAction.onClick(item),
                            }}
                            dropdownItems={dropdownActions.map((action) => ({
                              label: action.label,
                              icon: action.icon,
                              onClick: () => action.onClick(item),
                            }))}
                            isOpen={openDropdown === itemId}
                            onToggle={() => toggleDropdown(itemId)}
                            onClose={closeDropdown}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            {primaryAction && (
                              <button
                                onClick={() => primaryAction.onClick(item)}
                                className={`p-2 rounded-lg transition-colors ${
                                  primaryAction.className ||
                                  "text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                }`}
                                title={primaryAction.label}
                              >
                                {primaryAction.icon}
                              </button>
                            )}
                            {dropdownActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={`p-2 rounded-lg transition-colors ${
                                  action.className ||
                                  "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                                title={action.label}
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        )}
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
  );
};

// This file now contains only the generic, reusable table components
// Specific table implementations should be in their respective pages
