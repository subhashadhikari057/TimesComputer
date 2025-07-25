import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export default function ImportFileModal({ isOpen, onClose, onImport }: { isOpen: boolean, onClose: () => void, onImport: () => void }) {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<unknown>(null);
  // fileInputRef removed as it's unused

  const handleCSVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCSVFile(e.target.files?.[0] || null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error('File is required');
      return;
    }
    setIsSubmitting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('csv', csvFile);
      let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      if (API_BASE_URL.endsWith('/api')) {
        API_BASE_URL = API_BASE_URL.slice(0, -4);
      }
      const res = await fetch(`${API_BASE_URL}/api/product/import-csv`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImportResult(data.summary || data);
      if (res.ok) {
        toast.success('Import completed');
        onImport();
      } else {
        toast.error('Import failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Import error: ${err.message}`);
      } else {
        toast.error('Import error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  function isImportResultArray(val: unknown): val is { status: string; index: number; error?: string }[] {
    return Array.isArray(val) && val.every(r => typeof r === 'object' && r !== null && 'status' in r && 'index' in r);
  }

  let importResultErrorMsg: string = 'Unknown error during import.';
  if (
    typeof importResult === 'object' &&
    importResult !== null &&
    'error' in importResult
  ) {
    importResultErrorMsg = `Error: ${String((importResult as { error: unknown }).error)}`;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-lg relative border border-blue-200 max-h-[80vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl" onClick={onClose}>&times;</button>
        <div className="flex items-center mb-6">
          <FileText className="w-7 h-7 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-blue-700">Import Products from File</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block font-semibold mb-1 text-gray-700 flex items-center"><FileText className="w-4 h-4 mr-1 text-blue-500" />File *</label>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleCSVChange} required className="border-2 border-blue-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1.5 rounded-md font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center text-xs">
              <Download className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Importing...' : 'Import Products'}
            </button>
          </div>
        </form>
        {Boolean(importResult) ? (
          <div className="mt-6 max-h-48 overflow-y-auto border rounded-lg p-3 bg-blue-50">
            <h3 className="font-semibold mb-2 text-blue-700">Import Summary</h3>
            <ul className="text-sm space-y-1">
              {isImportResultArray(importResult) ? (
                importResult.map((row, i) => (
                  <li key={i} className={row.status === 'success' ? 'text-green-700' : 'text-red-600'}>
                    Row {row.index + 1}: {row.status === 'success' ? 'Imported' : `Error: ${row.error}`}
                  </li>
                ))
              ) : (
                <li className="text-red-600">
                  {importResultErrorMsg}
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
} 