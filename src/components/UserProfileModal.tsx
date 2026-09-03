import React, { useState } from 'react';
import { X, User, ShieldCheck, Key, RefreshCw, CheckCircle2, Award, Building, HardDrive, ExternalLink } from 'lucide-react';
import { InspaceLogo } from './InspaceLogo';

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
            <h2 className="text-sm font-bold">User Information & Credentials - IN-SPACe Official</h2>
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
              <div className="flex items-center gap-3 bg-blue-50/70 p-3 rounded border border-blue-200">
                <InspaceLogo className="h-9" showSubtext={false} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">DR. RAJESH SHARMA</h3>
                    <span className="text-[10px] bg-blue-900 text-blue-100 font-bold px-2 py-0.5 rounded font-mono">
                      DIRECTOR_AUTH
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium text-xs">Joint Director (Space Authorisation & Regulatory)</p>
                  <p className="text-gray-600 text-[11px]">Indian National Space Promotion and Authorisation Centre (IN-SPACe)</p>
                  <p className="text-gray-500 text-[10px]">Department of Space (DOS), Government of India</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <span className="text-gray-500 block">NIC Parichay ID:</span>
                  <span className="font-mono font-semibold text-gray-800">r.sharma.inspace@nic.in</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Department Node:</span>
                  <span className="font-semibold text-gray-800">IN-SPACe Ahmedabad HQ</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Designation:</span>
                  <span className="font-semibold text-gray-800">Joint Director (Grade I)</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Official Portal:</span>
                  <a
                    href="https://www.inspace.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                  >
                    <span>www.inspace.gov.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block">Nodal Ministry:</span>
                  <span className="font-semibold text-gray-800">Department of Space (DOS)</span>
                </div>
                <div>
                  <span className="text-gray-500 block">eOffice Version:</span>
                  <span className="font-semibold text-emerald-800">eFile 7.2.0 (IN-SPACe Node)</span>
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
                  <p className="text-[11px] text-emerald-800">FIPS 140-2 Level 3 Hardware Crypto Token plugged into local USB port</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Certificate Common Name (CN):</span>
                  <span className="font-bold text-gray-900">DR. RAJESH SHARMA - IN-SPACe (GOVT OF INDIA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Organization (O):</span>
                  <span className="text-gray-800">IN-SPACe, Department of Space</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Certifying Authority:</span>
                  <span className="text-gray-800">NIC Sub-CA for Digital Signature (CCA India)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Validity:</span>
                  <span className="text-gray-800">Valid until 14-Nov-2027</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Key Specification:</span>
                  <span className="text-gray-800">RSA 2048-bit / SHA-256 (ePass2003Auto)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-2">
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Authorisation & Regulatory Officer (Space Missions)</p>
                  <p className="text-gray-500 text-[11px]">Scrutinise non-government space entity (NGE) applications and mission authorisations</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>

              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">ISRO Facilities Concurrence Signatory</p>
                  <p className="text-gray-500 text-[11px]">Technical approvals for ISRO test facilities sharing and ground station authorisations</p>
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
