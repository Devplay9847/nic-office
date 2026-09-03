import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Usb,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  FileCheck,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface DscHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DscHubModal: React.FC<DscHubModalProps> = ({ isOpen, onClose }) => {
  const [tokenPin, setTokenPin] = useState('12345678');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenPin || tokenPin.length < 6) {
      alert('Token User PIN must be at least 6 digits.');
      return;
    }

    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
      setTestResult('PIN verified successfully. Crypto token cryptographic key exchange valid with NIC Sub-CA.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-2xl overflow-hidden animate-fadeIn select-none">
        {/* Modal Header */}
        <div className="bg-[#0062b8] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">eOffice PKI — Digital Signature Certificate (DSC) Hub</h3>
              <p className="text-[10px] text-blue-100 opacity-90">
                Hardware USB Crypto Token Management & NIC-CA Certificate Status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-gray-700 overflow-y-auto max-h-[80vh]">
          {/* Hardware Token Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Usb className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">ePass2003 Auto PKI Crypto Token</h4>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                      Connected & Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Slot: USB Hub 002:Port 01 | Manufacturer: Feitian Technologies / Watchdata
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-gray-500">
                <div>Firmware: v3.2.0</div>
                <div>Driver: NIC-eSign 7.2</div>
              </div>
            </div>
          </div>

          {/* Certificate Credentials Grid */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-gray-800 flex items-center justify-between">
              <span>X.509 Digital Certificate Details</span>
              <span className="text-emerald-700 font-medium text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>OCSP Online Validated</span>
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-gray-500 block">Certificate Owner (Common Name):</span>
                <span className="font-bold text-gray-900">AUDITOR1</span>
              </div>
              <div>
                <span className="text-gray-500 block">Designation / Role:</span>
                <span className="font-bold text-gray-900">Auditor1, Finance & Accounts Wing</span>
              </div>
              <div>
                <span className="text-gray-500 block">Organization:</span>
                <span className="font-bold text-gray-900">Kerala State IT Mission (KSITM)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Issuing Authority (CA):</span>
                <span className="font-bold text-blue-700">NIC Sub-CA for Digital Signature 2024</span>
              </div>
              <div>
                <span className="text-gray-500 block">Root Cert Authority:</span>
                <span className="font-medium text-gray-800">Controller of Certifying Authorities (CCA India)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Validity Period:</span>
                <span className="font-bold text-emerald-800">15/11/2024 to 14/11/2027 (Active)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Key Algorithm & Length:</span>
                <span className="font-mono text-gray-800">RSA 2048-bit / SHA256withRSA</span>
              </div>
              <div>
                <span className="text-gray-500 block">Certificate Serial Number:</span>
                <span className="font-mono font-bold text-gray-900">448123901F9924B</span>
              </div>
            </div>
          </div>

          {/* Token PIN Verification Test Box */}
          <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 mb-2">
              <Key className="w-4 h-4 text-[#0062b8]" />
              <span>Verify Token PIN & Test Cryptographic Signing</span>
            </h4>
            <p className="text-[11px] text-gray-600 mb-3">
              Test your 8-digit hardware USB token PIN. Successfully validating the PIN allows one-click signing of Notesheets (Green Notes) and Drafts (DFAs).
            </p>

            <form onSubmit={handleTestPin} className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="password"
                  value={tokenPin}
                  onChange={(e) => setTokenPin(e.target.value)}
                  placeholder="Enter 8-digit User PIN..."
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={testStatus === 'testing'}
                className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {testStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Communicating with Token...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Test Token PIN</span>
                  </>
                )}
              </button>
            </form>

            {testStatus === 'success' && (
              <div className="mt-3 p-2 bg-emerald-100 border border-emerald-300 rounded text-emerald-800 text-[11px] flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-500 text-[11px]">
            Compliant with IT Act 2000 & Controller of Certifying Authorities (CCA)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
