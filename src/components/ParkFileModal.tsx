import React, { useState } from 'react';
import { Archive, Calendar, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { EFileRecord } from '../types';

interface ParkFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: EFileRecord | null;
  onConfirmPark: (fileId: string, dueDate: string, reason: string, remarks: string) => void;
}

const PARKING_REASONS = [
  'Awaiting Finance Department Concurrence',
  'Under Legal Department Examination',
  'Pending Vigilance / CAG Audit Report',
  'Sub-Judice in High Court / Legal Stay',
  'Awaiting Clarification from Field / Subordinate Office',
  'Under Inter-Ministerial Consultation',
  'Awaiting Cabinet Approval / G.O. Issuance',
];

export const ParkFileModal: React.FC<ParkFileModalProps> = ({
  isOpen,
  onClose,
  file,
  onConfirmPark,
}) => {
  // Default due date: 15 days from now
  const defaultDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [dueDate, setDueDate] = useState(defaultDate);
  const [reason, setReason] = useState(PARKING_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !file) return null;

  const handlePark = () => {
    const selectedReason = reason === 'Other' ? customReason.trim() : reason;
    if (!selectedReason) {
      setError('Please specify a valid administrative reason for parking this file.');
      return;
    }
    if (!dueDate) {
      setError('Please select a parking due date.');
      return;
    }

    onConfirmPark(file.id, dueDate, selectedReason, remarks);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2a3b4c] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-500 rounded text-gray-900 font-bold">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">
                NIC eOffice — Park Electronic File
              </h2>
              <p className="text-[10px] text-gray-300">
                Move File Out of Daily Pendency SLA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700 max-h-[80vh] overflow-y-auto">
          {/* Informational Box */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2 text-blue-900">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Purpose of Parking:</strong> As demonstrated in official NIC eOffice
              walkthroughs, parking removes the file from active Inbox pendency aging until the
              specified <strong>Due Date</strong>. You can unpark this file at any time if action
              is required earlier.
            </div>
          </div>

          {/* Target File summary */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">File Number:</span>
              <span className="font-mono font-bold text-blue-950">{file.fileNumber}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-500 font-medium">Subject:</span>
              <p className="text-gray-800 text-[11px] font-medium line-clamp-2">{file.subject}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Due Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Park Due Date (Automatic Wakeup / Review Date) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                The file will automatically return to active attention on this date.
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Reason for Parking <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
              >
                {PARKING_REASONS.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Other">Other Reason (Specify below)</option>
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Specify Custom Reason <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter specific administrative reason..."
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
            )}

            {/* Remarks */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Additional Remarks / Notesheet Instructions
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                placeholder="Optional notes or instructions for the section..."
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
            onClick={handlePark}
            className="px-4 py-1.5 bg-[#2a3b4c] hover:bg-[#1f2c39] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Confirm & Park File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
