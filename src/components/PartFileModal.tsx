import React, { useState } from 'react';
import { Split, GitMerge, X, AlertCircle, FileText } from 'lucide-react';
import { EFileRecord } from '../types';

interface PartFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentFile: EFileRecord | null;
  onCreatePartFile: (parentFile: EFileRecord, partSubject: string, remarks: string) => void;
}

export const PartFileModal: React.FC<PartFileModalProps> = ({
  isOpen,
  onClose,
  parentFile,
  onCreatePartFile,
}) => {
  const [partSubject, setPartSubject] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !parentFile) return null;

  const suggestedPartNumber = `${parentFile.fileNumber}/Part-I`;

  const handleCreate = () => {
    if (!partSubject.trim()) {
      setError('Please enter the specific subject for this Part File.');
      return;
    }
    onCreatePartFile(parentFile, partSubject.trim(), remarks.trim());
    setPartSubject('');
    setRemarks('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0f4c81] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-400 text-gray-900 rounded">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">
                NIC eOffice — Create Part File
              </h2>
              <p className="text-[10px] text-blue-200">
                CSMOP Rule on Urgent Sub-Matter Handling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700 max-h-[80vh] overflow-y-auto">
          {/* CSMOP procedure explanation */}
          <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-start gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>CSMOP Procedure:</strong> A Part File is opened when the parent file is in
              circulation or under review, but an urgent independent matter must be processed without
              delay. When the parent file returns, the notes can be merged.
            </div>
          </div>

          {/* Parent File details */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Main / Parent File:</span>
              <span className="font-mono font-bold text-blue-900">{parentFile.fileNumber}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-500 font-medium">Main Subject:</span>
              <p className="text-gray-900 font-medium text-[11px] line-clamp-2">{parentFile.subject}</p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-1.5 text-[11px]">
              <span className="text-gray-500 font-medium">Generated Part File No:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {suggestedPartNumber}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Part File Subject / Sub-Matter <span className="text-red-500">*</span>
              </label>
              <textarea
                value={partSubject}
                onChange={(e) => {
                  setPartSubject(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                rows={2}
                placeholder={`e.g. Urgent interim approval for spare parts under ${parentFile.fileNumber}...`}
                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Opening Remarks / Reason for Splitting
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                placeholder="State why main file is unavailable (e.g. File on tour with Principal Secretary)..."
                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            {error && <p className="text-red-600 text-[11px] font-semibold">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-4 py-2.5 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-200 font-medium transition-colors cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-1.5 bg-[#0f4c81] hover:bg-[#0c3c66] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <Split className="w-3.5 h-3.5" />
            <span>Create Part File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
