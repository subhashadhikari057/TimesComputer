# Generic Data Table Component

A flexible, reusable table component for React applications with TypeScript support, built with split-button CRUD operations and customizable columns.

## Features

- **Generic TypeScript Support**: Works with any data type
- **Split Button Actions**: Primary action button with dropdown for secondary actions
- **Customizable Columns**: Define custom render functions for each column
- **Bulk Selection**: Select all/individual items with checkboxes
- **Responsive Design**: Mobile-friendly with proper overflow handling
- **Empty States**: Customizable empty state messages and icons
- **Flexible Actions**: Support for primary action, dropdown actions, or no actions

## Basic Usage

### 1. Define Your Data Type

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
}
```

### 2. Create Column Definitions

```typescript
const columns: TableColumn<Product>[] = [
  {
    id: "name",
    label: "Product Name",
    render: (product) => (
      <div className="font-medium text-gray-900">{product.name}</div>
    ),
  },
  {
    id: "price",
    label: "Price",
    render: (product) => (
      <div className="text-green-600 font-semibold">
        ${product.price.toFixed(2)}
      </div>
    ),
  },
  {
    id: "category",
    label: "Category",
    render: (product) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        {product.category}
      </span>
    ),
  },
];
```

### 3. Define Actions

```typescript
const primaryAction: TableAction<Product> = {
  label: "Edit",
  icon: <Edit3 className="w-4 h-4 mr-1.5" />,
  onClick: (product) => handleEdit(product.id),
};

const dropdownActions: TableAction<Product>[] = [
  {
    label: "Delete",
    icon: <Trash2 className="w-4 h-4 mr-2" />,
    onClick: (product) => handleDelete(product.id),
  },
  {
    label: "Duplicate",
    icon: <Copy className="w-4 h-4 mr-2" />,
    onClick: (product) => handleDuplicate(product.id),
  },
];
```

### 4. Use the Component

```typescript
<GenericDataTable
  data={products}
  columns={columns}
  selectedItems={selectedProducts}
  onSelectItem={(id) => handleSelectProduct(id as number)}
  onSelectAll={handleSelectAll}
  primaryAction={primaryAction}
  dropdownActions={dropdownActions}
  getItemId={(product) => product.id}
  emptyMessage="No products found"
  emptyIcon={<Package className="w-12 h-12 text-gray-400" />}
/>
```

## Props Reference

### Required Props

- `data: T[]` - Array of data items to display
- `columns: TableColumn<T>[]` - Column definitions
- `selectedItems: (string | number)[]` - Array of selected item IDs
- `onSelectItem: (itemId: string | number) => void` - Callback for individual item selection
- `onSelectAll: () => void` - Callback for select all toggle
- `getItemId: (item: T) => string | number` - Function to extract unique ID from item

### Optional Props

- `primaryAction?: TableAction<T>` - Main action button (e.g., Edit)
- `dropdownActions?: TableAction<T>[]` - Secondary actions in dropdown
- `emptyMessage?: string` - Message when no data (default: "No items found")
- `emptyIcon?: React.ReactNode` - Icon for empty state

## Column Definition

```typescript
interface TableColumn<T> {
  id: string; // Unique column identifier
  label: string; // Column header text
  render: (item: T) => React.ReactNode; // Custom render function
  sortable?: boolean; // Future: sortable support
  className?: string; // Custom CSS classes
}
```

## Action Definition

```typescript
interface TableAction<T> {
  label: string; // Action button text
  icon: React.ReactNode; // Action icon
  onClick: (item: T) => void; // Click handler
  className?: string; // Custom CSS classes
}
```

## Examples

### Product Table with Split Actions

```typescript
const ProductTable = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const handleEdit = (productId: number) => {
    router.push(`/products/${productId}/edit`);
  };

  const handleDelete = (productId: number) => {
    // Delete logic
  };

  return (
    <GenericDataTable
      data={products}
      columns={productColumns}
      selectedItems={selectedProducts}
      onSelectItem={(id) => {
        setSelectedProducts((prev) =>
          prev.includes(id as number)
            ? prev.filter((pid) => pid !== id)
            : [...prev, id as number]
        );
      }}
      onSelectAll={() => {
        setSelectedProducts(
          selectedProducts.length === products.length
            ? []
            : products.map((p) => p.id)
        );
      }}
      primaryAction={{
        label: "Edit",
        icon: <Edit3 className="w-4 h-4 mr-1.5" />,
        onClick: (product) => handleEdit(product.id),
      }}
      dropdownActions={[
        {
          label: "Delete",
          icon: <Trash2 className="w-4 h-4 mr-2" />,
          onClick: (product) => handleDelete(product.id),
        },
      ]}
      getItemId={(product) => product.id}
      emptyMessage="No products found"
      emptyIcon={<Package className="w-12 h-12 text-gray-400" />}
    />
  );
};
```

### Simple Table without Actions

```typescript
const SimpleDataTable = () => {
  return (
    <GenericDataTable
      data={simpleData}
      columns={simpleColumns}
      selectedItems={[]}
      onSelectItem={() => {}}
      onSelectAll={() => {}}
      getItemId={(item) => item.id}
      emptyMessage="No data available"
    />
  );
};
```

### Custom Action Styling

```typescript
const dropdownActions: TableAction<Product>[] = [
  {
    label: "Approve",
    icon: <CheckCircle className="w-4 h-4 mr-2" />,
    onClick: (product) => handleApprove(product.id),
    className: "text-green-600 hover:text-green-900 hover:bg-green-50",
  },
  {
    label: "Reject",
    icon: <XCircle className="w-4 h-4 mr-2" />,
    onClick: (product) => handleReject(product.id),
    className: "text-red-600 hover:text-red-900 hover:bg-red-50",
  },
];
```

## Migration from Legacy Components

### From CategoryTable

```typescript
// OLD - Custom CategoryTable component
<CategoryTable
  categories={categories}
  selectedCategories={selectedCategories}
  onSelectCategory={handleSelectCategory}
  onSelectAll={handleSelectAll}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onDuplicate={handleDuplicate}
  onToggleStatus={handleToggleStatus}
/>

// NEW - Using GenericDataTable
<GenericDataTable
  data={categories}
  columns={categoryColumns}
  selectedItems={selectedCategories}
  onSelectItem={(id) => handleSelectCategory(id as number)}
  onSelectAll={handleSelectAll}
  primaryAction={{
    label: 'Edit',
    icon: <Edit3 className="w-4 h-4 mr-1.5" />,
    onClick: (category) => handleEdit(category.id)
  }}
  dropdownActions={[
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: (category) => handleDelete(category.id)
    },
    {
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4 mr-2" />,
      onClick: (category) => handleDuplicate(category.id)
    }
  ]}
  getItemId={(category) => category.id}
  emptyMessage="No categories found"
  emptyIcon={<Tag className="w-12 h-12 text-gray-400" />}
/>
```

## Best Practices

1. **Keep render functions simple**: Complex logic should be in separate components
2. **Use consistent icons**: Stick to a single icon library (Lucide React recommended)
3. **Provide meaningful empty states**: Custom messages and icons improve UX
4. **Type safety**: Always provide proper TypeScript types for your data
5. **Accessibility**: The component includes proper ARIA attributes and keyboard navigation

## Styling

The component uses Tailwind CSS classes. You can customize:

- Table colors via the existing classes
- Action button colors via the `className` prop
- Column-specific styling via column `className` prop
- Empty state styling by providing custom `emptyIcon`

## Future Enhancements

- [ ] Built-in sorting support
- [ ] Pagination component integration
- [ ] Column resizing
- [ ] Row drag and drop
- [ ] Inline editing
- [ ] Export functionality
- [ ] Advanced filtering

## Support

For questions or issues, please refer to the component source code or create an issue in the project repository.
