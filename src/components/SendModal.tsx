import React, { useState } from 'react';
import { X, Send, UserCheck, ShieldCheck, Key, Calendar, AlertCircle } from 'lucide-react';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onConfirmSend: (recipient: string, remarks: string, priority: string) => void;
}

export const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  onConfirmSend,
}) => {
  const [recipient, setRecipient] = useState('MANOJ K. VARMA (Joint Director - Finance)');
  const [sendType, setSendType] = useState<'dsc' | 'esign' | 'direct'>('dsc');
  const [actionPurpose, setActionPurpose] = useState('For approval and concurrence');
  const [remarks, setRemarks] = useState('Placed below for kind perusal and administrative approval.');
  const [priority, setPriority] = useState('Urgent');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [copyTo, setCopyTo] = useState('');

  if (!isOpen) return null;

  const officers = [
    { name: 'MANOJ K. VARMA', desig: 'Joint Director (Finance)', dept: 'KSITM-FIN' },
    { name: 'DR. ANUPAMA S., IAS', desig: 'Director (IT & eGovernance)', dept: 'E&ITD' },
    { name: 'SURESH BABU K.', desig: 'Director (Finance & Accounts)', dept: 'KSITM' },
    { name: 'RADHIKA MENON', desig: 'Section Officer (Statutory Audit)', dept: 'KSITM-AUDIT' },
    { name: 'K. RAMACHANDRAN', desig: 'Under Secretary (Finance & Budget)', dept: 'Govt Secretariat' },
    { name: 'STATE INFORMATICS OFFICER', desig: 'Senior Technical Director', dept: 'NIC Kerala' },
  ];

  const actionPurposes = [
    'For perusal and consideration',
    'For comments and examination',
    'For approval and concurrence',
    'For digital signature / eSign',
    'For compliance and action taken',
    'For information and record',
  ];

  const handleQuickDueDays = (days: number) => {
    const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setDueDate(target.toISOString().split('T')[0]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRemarks = `[${actionPurpose.toUpperCase()}] Due: ${dueDate} | ${remarks}${
      sendType === 'dsc' ? ' (Authenticated with Class 3 DSC Token)' : ''
    }`;
    onConfirmSend(recipient, finalRemarks, priority);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#004e93] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-300" />
            <h2 className="text-sm font-bold">eOffice 7.0 - Dispatch & Forward to Dealing Hand</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-4 space-y-3 text-xs">
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-950 font-medium flex items-center justify-between">
            <span>
              Target Dossiers: <strong className="text-blue-900 font-bold">{selectedIds.length} item(s)</strong>
            </span>
            <span className="text-[11px] text-blue-700 font-mono">Dealing Hand: AUDITOR1</span>
          </div>

          {/* Recipient Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Forward to Dealing Officer <span className="text-red-500">*</span>
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-xs"
            >
              {officers.map((off) => (
                <option key={off.name} value={`${off.name} (${off.desig})`}>
                  {off.name} — {off.desig} [{off.dept}]
                </option>
              ))}
            </select>
          </div>

          {/* Send Authentication Mode */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Authentication & Signing Mode:</label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded border cursor-pointer transition-all ${
                  sendType === 'dsc'
                    ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="sendType"
                  value="dsc"
                  checked={sendType === 'dsc'}
                  onChange={() => setSendType('dsc')}
                  className="hidden"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send with DSC</span>
              </label>

              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded border cursor-pointer transition-all ${
                  sendType === 'esign'
                    ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="sendType"
                  value="esign"
                  checked={sendType === 'esign'}
                  onChange={() => setSendType('esign')}
                  className="hidden"
                />
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Send with eSign</span>
              </label>

              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded border cursor-pointer transition-all ${
                  sendType === 'direct'
                    ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="sendType"
                  value="direct"
                  checked={sendType === 'direct'}
                  onChange={() => setSendType('direct')}
                  className="hidden"
                />
                <UserCheck className="w-3.5 h-3.5 text-gray-600" />
                <span>Send without Sign</span>
              </label>
            </div>
          </div>

          {/* Action / Purpose & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Action / Purpose:</label>
              <select
                value={actionPurpose}
                onChange={(e) => setActionPurpose(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-xs"
              >
                {actionPurposes.map((ap) => (
                  <option key={ap} value={ap}>
                    {ap}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Marking Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-xs font-semibold"
              >
                <option value="Normal">Normal (Routine)</option>
                <option value="Urgent">Urgent</option>
                <option value="Immediate">Immediate / Assembly Question</option>
                <option value="Out Today">Out Today (Same Day Dispatch)</option>
              </select>
            </div>
          </div>

          {/* Due Date (Completion Target) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-gray-700 font-semibold">
                Set Due Date (Target Completion):
              </label>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickDueDays(3)}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDueDays(7)}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer"
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDueDays(15)}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer"
                >
                  +15 Days
                </button>
              </div>
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Forwarding Remarks / Endorsement:
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Placed below for kind perusal and administrative approval..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[10px] text-gray-500">
              {sendType === 'dsc' && 'Will verify NIC Class 3 Token before dispatch.'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch / Send</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

