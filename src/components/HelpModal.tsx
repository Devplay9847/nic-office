import React from 'react';
import { X, HelpCircle, BookOpen, ShieldCheck, FileText, Send, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <h2 className="text-sm font-bold">eOffice eFile 7.2.0 - User Quick Reference & Help Guide</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-bold text-blue-900 text-sm mb-1">eOffice Digital Workplace Quick Steps</h3>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              eOffice replaces paper files with secure, transparent digital workflows adhering to the Central Secretariat Manual of Office Procedure (CSMOP).
            </p>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
              <div>
                <h4 className="font-bold text-gray-900">Browse & Diarise (Electronic vs Physical)</h4>
                <p className="text-[11px] text-gray-600">
                  Select <em>Browse & Diarise &gt; Electronic</em> to create a digital receipt with scanned PDF attachment, or <em>Physical</em> for physical tapal tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
              <div>
                <h4 className="font-bold text-gray-900">Green Notesheet (e-Notes)</h4>
                <p className="text-[11px] text-gray-600">
                  Click any subject link in the inbox to open the split viewer. Official comments are recorded on the green notesheet with automatic timestamping and digital signatures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
              <div>
                <h4 className="font-bold text-gray-900">Digital Signature Certificate (DSC)</h4>
                <p className="text-[11px] text-gray-600">
                  Plug in your USB token to digitally sign notesheets or dispatch letters using PKI encryption compliant with the IT Act 2000.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
              <div>
                <h4 className="font-bold text-gray-900">Send / Forwarding Workflow</h4>
                <p className="text-[11px] text-gray-600">
                  Use the <em>Send</em> button to route files to superior officers with custom priority flags (Normal, Urgent, Immediate).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <span>National Informatics Centre (NIC) - eOffice Division</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-medium cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
