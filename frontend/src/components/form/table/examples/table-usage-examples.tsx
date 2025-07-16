// Example usage of the GenericDataTable component
import React, { useState } from "react";
import { GenericDataTable, TableColumn, TableAction } from "../table";
import {
  Edit3,
  Trash2,
  Copy,
  Eye,
  Package,
  Tag,
  Calendar,
  Star,
} from "lucide-react";

// Example 1: Brand Management Table
interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

const BrandTable: React.FC<{
  brands: Brand[];
  selectedBrands: number[];
  onSelectBrand: (id: number) => void;
  onSelectAll: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  onToggleStatus: (id: number) => void;
}> = ({
  brands,
  selectedBrands,
  onSelectBrand,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}) => {
  const columns: TableColumn<Brand>[] = [
    {
      id: "brand",
      label: "Brand",
      render: (brand) => (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-12 w-12">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {brand.name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {brand.description}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              /{brand.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "products",
      label: "Products",
      render: (brand) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {brand.productCount}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (brand) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            brand.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {brand.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "created",
      label: "Created",
      render: (brand) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(brand.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const primaryAction: TableAction<Brand> = {
    label: "Edit",
    icon: <Edit3 className="w-4 h-4 mr-1.5" />,
    onClick: (brand) => onEdit(brand.id),
  };

  const dropdownActions: TableAction<Brand>[] = [
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: (brand) => onDelete(brand.id),
    },
    {
      label: "Duplicate",
      icon: <Copy className="w-4 h-4 mr-2" />,
      onClick: (brand) => onDuplicate(brand.id),
    },
    {
      label: "Toggle Status",
      icon: <Eye className="w-4 h-4 mr-2" />,
      onClick: (brand) => onToggleStatus(brand.id),
    },
  ];

  return (
    <GenericDataTable
      data={brands}
      columns={columns}
      selectedItems={selectedBrands}
      onSelectItem={(id) => onSelectBrand(id as number)}
      onSelectAll={onSelectAll}
      primaryAction={primaryAction}
      dropdownActions={dropdownActions}
      getItemId={(brand) => brand.id}
      emptyMessage="No brands found"
      emptyIcon={<Package className="w-12 h-12 text-gray-400" />}
    />
  );
};

// Example 2: Review Management Table
interface Review {
  id: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

const ReviewTable: React.FC<{
  reviews: Review[];
  selectedReviews: number[];
  onSelectReview: (id: number) => void;
  onSelectAll: () => void;
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}> = ({
  reviews,
  selectedReviews,
  onSelectReview,
  onSelectAll,
  onView,
  onApprove,
  onReject,
}) => {
  const columns: TableColumn<Review>[] = [
    {
      id: "review",
      label: "Review",
      render: (review) => (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {review.productName}
          </div>
          <div className="text-sm text-gray-500 truncate">
            by {review.customerName}
          </div>
          <div className="text-xs text-gray-400 mt-1 truncate">
            {review.comment}
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      label: "Rating",
      render: (review) => (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      id: "verified",
      label: "Verified",
      render: (review) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            review.isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {review.isVerified ? "Verified" : "Pending"}
        </span>
      ),
    },
    {
      id: "date",
      label: "Date",
      render: (review) => (
        <div className="text-sm text-gray-600">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const primaryAction: TableAction<Review> = {
    label: "View",
    icon: <Eye className="w-4 h-4 mr-1.5" />,
    onClick: (review) => onView(review.id),
  };

  const dropdownActions: TableAction<Review>[] = [
    {
      label: "Approve",
      icon: <Edit3 className="w-4 h-4 mr-2" />,
      onClick: (review) => onApprove(review.id),
      className: "text-green-600 hover:text-green-900 hover:bg-green-50",
    },
    {
      label: "Reject",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: (review) => onReject(review.id),
      className: "text-red-600 hover:text-red-900 hover:bg-red-50",
    },
  ];

  return (
    <GenericDataTable
      data={reviews}
      columns={columns}
      selectedItems={selectedReviews}
      onSelectItem={(id) => onSelectReview(id as number)}
      onSelectAll={onSelectAll}
      primaryAction={primaryAction}
      dropdownActions={dropdownActions}
      getItemId={(review) => review.id}
      emptyMessage="No reviews found"
      emptyIcon={<Star className="w-12 h-12 text-gray-400" />}
    />
  );
};

// Example 3: Simple table without actions
interface SimpleData {
  id: number;
  name: string;
  value: string;
}

const SimpleTable: React.FC<{
  data: SimpleData[];
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
}> = ({ data, selectedItems, onSelectItem, onSelectAll }) => {
  const columns: TableColumn<SimpleData>[] = [
    {
      id: "name",
      label: "Name",
      render: (item) => (
        <div className="text-sm font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      id: "value",
      label: "Value",
      render: (item) => (
        <div className="text-sm text-gray-600">{item.value}</div>
      ),
    },
  ];

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      selectedItems={selectedItems}
      onSelectItem={(id) => onSelectItem(id as number)}
      onSelectAll={onSelectAll}
      getItemId={(item) => item.id}
      emptyMessage="No data found"
      emptyIcon={<Package className="w-12 h-12 text-gray-400" />}
    />
  );
};

export { BrandTable, ReviewTable, SimpleTable };
