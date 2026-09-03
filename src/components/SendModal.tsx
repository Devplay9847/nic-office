import React, { useState } from 'react';
import { X, Send, UserCheck, ShieldCheck } from 'lucide-react';

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
  const [recipient, setRecipient] = useState('Joint Director (Finance), KSITM');
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState('Urgent');

  if (!isOpen) return null;

  const officers = [
    'Joint Director (Finance), KSITM',
    'Director (Finance & Accounts), KSITM',
    'Section Officer (Audit Division), KSITM',
    'Under Secretary (Finance), Govt Secretariat',
    'State Informatics Officer, NIC Kerala',
    'Head (Technical Operations), KSITM',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmSend(recipient, remarks, priority);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <h2 className="text-sm font-bold">Forward / Send to Dealing Officer</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-4 space-y-3 text-xs">
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-950 font-medium">
            Selected Records for Dispatch: <span className="font-bold text-blue-800">{selectedIds.length} item(s)</span>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">To Officer / Department:</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-xs"
            >
              {officers.map((off) => (
                <option key={off} value={off}>
                  {off}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Marking Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-xs"
            >
              <option value="Normal">Normal (Routine)</option>
              <option value="Urgent">Urgent</option>
              <option value="Immediate">Immediate / Assembly Question</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Forwarding Remarks / Endorsement:</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Forwarded for kind perusal and administrative approval..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            />
          </div>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
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
        </form>
      </div>
    </div>
  );
};
