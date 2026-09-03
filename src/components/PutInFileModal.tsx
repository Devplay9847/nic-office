import React, { useState } from 'react';
import { X, Paperclip, Folder, Search, CheckCircle2, Plus } from 'lucide-react';
import { EFileRecord, ReceiptRecord } from '../types';

interface PutInFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReceiptIds: string[];
  receipts: ReceiptRecord[];
  files: EFileRecord[];
  onConfirmPutInFile: (fileId: string, receiptIds: string[]) => void;
  onCreateNewFileForReceipts: (receiptIds: string[]) => void;
}

export const PutInFileModal: React.FC<PutInFileModalProps> = ({
  isOpen,
  onClose,
  selectedReceiptIds,
  receipts,
  files,
  onConfirmPutInFile,
  onCreateNewFileForReceipts,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0]?.id || '');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const selectedReceiptObjects = receipts.filter((r) =>
    selectedReceiptIds.includes(r.id)
  );

  const filteredFiles = files.filter(
    (f) =>
      f.fileNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedFileId) {
      alert('Please select an electronic file.');
      return;
    }
    onConfirmPutInFile(selectedFileId, selectedReceiptIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            <h2 className="text-sm font-bold">Put in File / Attach Receipt as Correspondence (PUC)</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs overflow-y-auto">
          {/* Selected Receipts Info */}
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-950">
            <span className="font-semibold block mb-1">
              Receipt(s) selected for attachment ({selectedReceiptObjects.length}):
            </span>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {selectedReceiptObjects.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-blue-100">
                  <span className="font-mono font-bold text-blue-900">Receipt #{r.receiptNo}</span>
                  <span className="text-gray-600 truncate max-w-xs">{r.subject}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search File Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-700 font-semibold">Select Destination File:</label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCreateNewFileForReceipts(selectedReceiptIds);
                }}
                className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New File for This</span>
              </button>
            </div>

            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search file number or subject..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* File List Radio Group */}
            <div className="border border-gray-200 rounded max-h-48 overflow-y-auto divide-y divide-gray-100">
              {filteredFiles.map((file) => (
                <label
                  key={file.id}
                  className={`p-2.5 flex items-start gap-2.5 cursor-pointer transition-colors ${
                    selectedFileId === file.id ? 'bg-blue-50 text-blue-950 font-medium' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="destFile"
                    checked={selectedFileId === file.id}
                    onChange={() => setSelectedFileId(file.id)}
                    className="mt-0.5 text-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-gray-900 text-xs truncate">
                        {file.fileNumber}
                      </span>
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded shrink-0">
                        {file.classification}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] truncate mt-0.5">{file.subject}</p>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Section: {file.section} • Dealing Hand: {file.pendingWith}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attach to File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
