import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, Check, Clock, User, FileText } from 'lucide-react';
import { EFileRecord } from '../types';

interface PullBackModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: EFileRecord | null;
  onConfirmPullBack: (fileId: string, reason: string) => void;
}

const COMMON_REASONS = [
  'Correction needed in notesheet / DFA',
  'Additional financial annexure to attach',
  'Erroneous recipient officer selected',
  'Recall for urgent review before Joint Secretary scrutiny',
  'Supplementary audit verification data received',
];

export const PullBackModal: React.FC<PullBackModalProps> = ({
  isOpen,
  onClose,
  file,
  onConfirmPullBack,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !file) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a specific official reason for pulling back this file.');
      return;
    }
    onConfirmPullBack(file.id, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#004e93] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-500 rounded text-black font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">
                NIC eOffice — Pull Back File
              </h2>
              <p className="text-[10px] text-blue-200">
                Central Secretariat Manual of Office Procedure (CSMOP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white p-1 hover:bg-blue-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700 max-h-[80vh] overflow-y-auto">
          {/* Eligibility Alert */}
          <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-start gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Pull Back Allowed:</strong> The recipient officer (
              <span className="font-semibold">{file.sentToOfficer || file.pendingWith}</span>) has{' '}
              <strong>not yet opened/actioned</strong> this file. Confirming will recall this file
              back to your active <strong>Inbox</strong>.
            </div>
          </div>

          {/* File Dossier Info */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
              <span className="text-gray-500 font-medium">File Number:</span>
              <span className="font-mono font-bold text-blue-900">{file.fileNumber}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-500 font-medium">Subject:</span>
              <p className="text-gray-900 font-medium text-[11px] line-clamp-2">{file.subject}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200 text-[11px]">
              <div className="flex items-center gap-1 text-gray-600">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>Sent To: <strong className="text-gray-900">{file.sentToOfficer || file.pendingWith}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Sent Date: <strong className="text-gray-900">{file.sentDate || 'Recent'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Reasons */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Select or Enter Official Reason for Pull Back <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_REASONS.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setReason(r);
                    setError('');
                  }}
                  className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer text-left ${
                    reason === r
                      ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              rows={3}
              placeholder="Provide a mandatory administrative reason for pulling back this electronic file..."
              className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
            {error && <p className="text-red-600 text-[11px] mt-1 font-medium">{error}</p>}
          </div>

          <p className="text-[10px] text-gray-500 italic">
            * This action will be permanently recorded in the File Movement Audit Register.
          </p>
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
            onClick={handleConfirm}
            className="px-4 py-1.5 bg-[#004e93] hover:bg-[#003d73] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Confirm Pull Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
