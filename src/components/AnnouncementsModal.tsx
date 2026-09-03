import React from 'react';
import { X, Info, Megaphone, Server, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#ea7e00] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            <h2 className="text-sm font-bold">eOffice Portal Announcements & System Notices</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#b35e00] rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs overflow-y-auto max-h-[70vh]">
          {/* Announcement 1 */}
          <div className="p-3 bg-amber-50 border-l-3 border-amber-500 rounded-r text-amber-950">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Scheduled Maintenance Window (NIC Kerala State Data Centre)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Routine database indexing and microservices health check will take place on Sunday, 06-Sep-2026 between 02:00 AM and 04:00 AM IST. eFile and eLeave services will remain unaffected.
            </p>
          </div>

          {/* Announcement 2 */}
          <div className="p-3 bg-blue-50 border-l-3 border-blue-600 rounded-r text-blue-950">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Server className="w-4 h-4 text-blue-600" />
              <span>eOffice Release 7.2.0 Upgrade Details</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              New features in Release 7.2.0 include enhanced split-view green notesheet layout, faster full-text search indexing, and automated multi-party DSC batch signing support.
            </p>
          </div>

          {/* Announcement 3 */}
          <div className="p-3 bg-emerald-50 border-l-3 border-emerald-600 rounded-r text-emerald-950">
            <div className="flex items-center gap-2 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PKI & Digital Signature Guidelines</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All dealing officers are reminded to keep their USB Crypto tokens (Class 3 Signing) plugged in and updated with the latest NIC-CA root certificate drivers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <span>Published by SIO & eOffice Project Management Unit</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded font-medium cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
