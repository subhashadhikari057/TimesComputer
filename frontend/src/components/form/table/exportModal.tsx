"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Column } from "@/components/form/table/defaultTable"; // Import your Column type
import Dropdown from "../form-elements/DefaultDropdown";
import AddDetailsPopup from "@/components/common/popup";

interface ExportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  columns: Column[]; // Use your existing Column interface
  title: string; // e.g., "Products", "Brands", "Categories"
  filename?: string; // Optional custom filename
}

interface ExportFormData {
  filename: string;
  format: string;
}

const formatOptions = [
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF (.pdf)" },
];

export default function ExportPopup({
  isOpen,
  onClose,
  data,
  columns,
  title,
  filename = `${title.toLowerCase()}_export`,
}: ExportPopupProps) {
  const [formData, setFormData] = useState<ExportFormData>({
    filename: filename,
    format: "xlsx",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.filename.trim()) {
      newErrors.filename = "Filename is required";
    } else if (!/^[a-zA-Z0-9_\-\s]+$/.test(formData.filename)) {
      newErrors.filename =
        "Filename can only contain letters, numbers, spaces, hyphens, and underscores";
    }

    if (!formData.format) {
      newErrors.format = "Export format is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to extract plain text from JSX/rendered content
  const extractTextFromJSX = (element: any): string => {
    if (element === null || element === undefined) {
      return "";
    }

    if (typeof element === "string" || typeof element === "number") {
      return String(element);
    }

    if (typeof element === "boolean") {
      return element ? "Yes" : "No";
    }

    if (React.isValidElement(element)) {
      const reactElement = element as React.ReactElement<any, any>;

      if (reactElement.props?.children) {
        return extractTextFromJSX(reactElement.props.children);
      }
      return "";
    }

    // Handle arrays (like multiple children)
    if (Array.isArray(element)) {
      return element.map(extractTextFromJSX).join(" ");
    }

    // Handle objects
    if (typeof element === "object" && element !== null) {
      // Common object patterns
      if (element.name) return String(element.name);
      if (element.label) return String(element.label);
      if (element.title) return String(element.title);

      // If it's a Date
      if (element instanceof Date) {
        return element.toLocaleDateString();
      }

      return "";
    }

    return String(element);
  };

  // Function to process data for export by extracting text from rendered columns
  const processDataForExport = (rawData: any[]) => {
    return rawData.map((row) => {
      const processedRow: any = {};

      columns.forEach((column) => {
        try {
          // Get the rendered content from the column
          const renderedContent = column.render(row);

          // Extract plain text from the rendered content
          let extractedText = extractTextFromJSX(renderedContent);

          // Additional processing for common patterns
          if (column.id.toLowerCase().includes("price") && extractedText) {
            // Extract numeric value from price strings like "Rs.123.45"
            const numericMatch = extractedText.match(/[\d.,]+/);
            if (numericMatch) {
              const numericValue = parseFloat(
                numericMatch[0].replace(/,/g, "")
              );
              if (!isNaN(numericValue)) {
                extractedText = numericValue.toString();
              }
            }
          } else if (
            column.id.toLowerCase().includes("date") &&
            extractedText
          ) {
            // Try to parse and format dates consistently
            const dateMatch = extractedText.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (dateMatch) {
              extractedText = dateMatch[0];
            }
          } else if (
            column.id.toLowerCase().includes("stock") &&
            extractedText
          ) {
            // Extract numeric value from stock strings like "10 units"
            const stockMatch = extractedText.match(/\d+/);
            if (stockMatch) {
              extractedText = stockMatch[0];
            }
          }

          processedRow[column.label] = extractedText || "";
        } catch (error) {
          console.warn(`Error processing column ${column.id}:`, error);
          processedRow[column.label] = "";
        }
      });

      return processedRow;
    });
  };

  const exportToExcel = async () => {
    try {
      const processedData = processDataForExport(data);

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(processedData);

      // Set column widths based on content length and column labels
      const columnWidths = columns.map((column) => {
        const maxLabelLength = column.label.length;
        const maxContentLength = Math.max(
          ...processedData.map((row) => String(row[column.label] || "").length)
        );
        const width = Math.max(maxLabelLength, maxContentLength, 10);
        return { wch: Math.min(width, 50) }; // Cap at 50 characters
      });

      worksheet["!cols"] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, title);

      // Generate and download file
      const filename = `${formData.filename}.xlsx`;
      XLSX.writeFile(workbook, filename);

      return true;
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw new Error("Failed to export to Excel");
    }
  };

  const exportToPDF = async () => {
    try {
      const processedData = processDataForExport(data);

      // Create PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`${title} Export`, 14, 15);

      // Add export info
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 25);
      doc.text(`Total Records: ${processedData.length}`, 14, 30);

      // Prepare table data
      const tableHeaders = columns.map((col) => col.label);
      const tableData = processedData.map((row) =>
        columns.map((col) => {
          const value = row[col.label];
          // Format prices for PDF display
          if (
            col.id.toLowerCase().includes("price") &&
            !isNaN(parseFloat(value))
          ) {
            return `Rs. ${parseFloat(value).toFixed(2)}`;
          }
          return String(value || "");
        })
      );

      // Calculate column widths for PDF
      const pageWidth = doc.internal.pageSize.getWidth() - 28; // 14px margin on each side
      const baseColumnWidth = pageWidth / columns.length;

      const columnStyles: any = {};
      columns.forEach((col, index) => {
        // Adjust column width based on content type
        let width = baseColumnWidth;
        if (
          col.id.toLowerCase().includes("name") ||
          col.id.toLowerCase().includes("description")
        ) {
          width = Math.max(baseColumnWidth * 1.5, 30);
        } else if (col.id.toLowerCase().includes("id")) {
          width = Math.max(baseColumnWidth * 0.5, 15);
        }

        columnStyles[index] = { cellWidth: width };
      });

      // Add table
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: Math.min(9, Math.max(6, 60 / columns.length)), // Dynamic font size
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue color
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Light gray
        },
        columnStyles,
        margin: { top: 40, right: 14, bottom: 20, left: 14 },
        tableWidth: "auto",
        theme: "striped",
      });

      // Save PDF
      const filename = `${formData.filename}.pdf`;
      doc.save(filename);

      return true;
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw new Error("Failed to export to PDF");
    }
  };

  const handleExport = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (formData.format === "xlsx") {
        await exportToExcel();
      } else if (formData.format === "pdf") {
        await exportToPDF();
      }

      // Close modal on success
      onClose();

      // Reset form
      setFormData({
        filename: filename,
        format: "xlsx",
      });
      setErrors({});
    } catch (error) {
      console.error("Export failed:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Export failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      filename: filename,
      format: "xlsx",
    });
    setErrors({});
    onClose();
  };

  return (
    <AddDetailsPopup
      isOpen={isOpen}
      onClose={onClose}
      title={`Export ${title}`}
      description={`Export ${data.length} record${
        data.length !== 1 ? "s" : ""
      } to your preferred format`}
      onSave={handleExport}
      onCancel={handleCancel}
      saveButtonText="Export"
      cancelButtonText="Cancel"
      isLoading={isLoading}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Filename Input */}
        <div>
          <label
            htmlFor="filename"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            File Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="filename"
            value={formData.filename}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, filename: e.target.value }))
            }
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-900 
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-20
              hover:border-gray-300 transition-all duration-200
              ${
                errors.filename
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20"
                  : "border-gray-200"
              }`}
            placeholder="Enter filename (without extension)"
          />
          {errors.filename && (
            <p className="mt-1 text-sm text-red-600">{errors.filename}</p>
          )}
        </div>

        {/* Format Dropdown */}
        <Dropdown
          label="Export Format"
          value={formData.format}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, format: value as string }))
          }
          options={formatOptions}
          placeholder="Select export format"
          required
          error={errors.format}
        />

        {/* Export Preview Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Export Preview
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Records to export: {data.length}</li>
                  <li>Columns: {columns.map((col) => col.label).join(", ")}</li>
                  <li>
                    File will be saved as: {formData.filename}
                    {formData.format ? `.${formData.format}` : ".[format]"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddDetailsPopup>
  );
}
