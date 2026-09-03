import React, { useState } from 'react';
import { X, User, ShieldCheck, Key, RefreshCw, CheckCircle2, Award, Building, HardDrive } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'dsc' | 'roles'>('profile');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <h2 className="text-sm font-bold">User Information & Credentials - AUDITOR1</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-800 bg-white font-bold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('dsc')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'dsc'
                ? 'border-blue-600 text-blue-800 bg-white font-bold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            DSC Token Certificate
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'roles'
                ? 'border-blue-600 text-blue-800 bg-white font-bold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Assigned Roles & Delegation
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 text-xs space-y-3">
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded border border-blue-200">
                <div className="w-12 h-12 rounded-full bg-white text-blue-800 flex items-center justify-center border border-blue-300 font-bold text-lg shadow-sm">
                  A1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">AUDITOR1 (Primary User)</h3>
                  <p className="text-gray-600 text-xs">Auditor1, Finance & Statutory Audit</p>
                  <p className="text-gray-500 text-[11px]">Kerala State Information Technology Mission (KSITM)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <span className="text-gray-500 block">NIC Parichay ID:</span>
                  <span className="font-mono font-semibold text-gray-800">auditor1.ksitm@nic.in</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Department Node:</span>
                  <span className="font-semibold text-gray-800">KSITM Finance Branch</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Designation:</span>
                  <span className="font-semibold text-gray-800">Junior Auditor Grade I</span>
                </div>
                <div>
                  <span className="text-gray-500 block">eOffice Version:</span>
                  <span className="font-semibold text-emerald-800">eFile 7.2.0 (Stable)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dsc' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Digital Signature Status: Active & Ready</h4>
                  <p className="text-[11px] text-emerald-800">Hardware Crypto Token plugged into local USB port</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Certificate Common Name (CN):</span>
                  <span className="font-bold text-gray-900">AUDITOR1 - KSITM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Certifying Authority:</span>
                  <span className="text-gray-800">NIC Sub-CA (CCA India)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Validity:</span>
                  <span className="text-gray-800">Valid until 14-Nov-2027</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Key Specification:</span>
                  <span className="text-gray-800">RSA 2048-bit / SHA-256</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-2">
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Dealing Hand (Finance)</p>
                  <p className="text-gray-500 text-[11px]">Can initiate notesheets and diarise receipts</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>

              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Statutory Compliance Auditor</p>
                  <p className="text-gray-500 text-[11px]">Audit verification and concurrence signatory</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-end text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
