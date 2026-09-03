import React, { useState } from 'react';
import { X, Upload, Save, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { RecordType, ReceiptRecord } from '../types';

interface DiariseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType: RecordType;
  onSave: (record: Partial<ReceiptRecord>) => void;
}

export const DiariseModal: React.FC<DiariseModalProps> = ({
  isOpen,
  onClose,
  defaultType,
  onSave,
}) => {
  const [type, setType] = useState<RecordType>(defaultType);
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [senderDesignation, setSenderDesignation] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('Electronic');
  const [category, setCategory] = useState('Finance & Accounts');
  const [priority, setPriority] = useState<'Normal' | 'Immediate' | 'Urgent'>('Normal');
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !sender.trim()) {
      alert('Please fill out Subject and Sender information.');
      return;
    }

    const newRecordNo = Math.floor(620 + Math.random() * 50);
    const code = `${type}${newRecordNo}/FIN/2026`;

    onSave({
      receiptNo: newRecordNo,
      type,
      subjectCode: code,
      subject: `${code} - ${subject}`,
      sender,
      senderDesignation: senderDesignation || 'Officer',
      receivedDate: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      letterDate: new Date().toLocaleDateString('en-GB'),
      category,
      priority,
      status: 'In Progress',
      pendingWith: 'AUDITOR1 (Self)',
      notes: remarks.trim()
        ? [
            {
              id: `n-${Date.now()}`,
              author: 'AUDITOR1',
              designation: 'Auditor1, Finance',
              department: 'KSITM',
              timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: remarks.trim(),
              isGreenNote: true,
            },
          ]
        : [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <h2 className="text-sm font-bold">
              eOffice Diarisation Form - {type === 'E' ? 'Electronic Receipt (eFile)' : 'Physical Tapal'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
          {/* Nature selector */}
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded border border-gray-200">
            <span className="font-semibold text-gray-700">Receipt Nature:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="E"
                checked={type === 'E'}
                onChange={() => setType('E')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-blue-900">Electronic (E)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer ml-4">
              <input
                type="radio"
                name="type"
                value="P"
                checked={type === 'P'}
                onChange={() => setType('P')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-amber-900">Physical (Tapal)</span>
            </label>
          </div>

          {/* Sender Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Sender Name / Ministry / Org <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Finance Department, Secretariat"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Sender Designation</label>
              <input
                type="text"
                value={senderDesignation}
                onChange={(e) => setSenderDesignation(e.target.value)}
                placeholder="e.g. Under Secretary / Section Officer"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery Mode & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Delivery Mode</label>
              <select
                value={deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option>Electronic / Portal</option>
                <option>Email</option>
                <option>Hand Delivery</option>
                <option>Speed Post / Registered</option>
                <option>Courier</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option>Finance & Accounts</option>
                <option>Audit & Statutory Compliance</option>
                <option>Procurement & GeM</option>
                <option>Establishment & Administration</option>
                <option>IT & Infrastructure</option>
                <option>General Correspondence</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Immediate">Immediate</option>
              </select>
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Subject Line <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Financial concurrence for Network switch upgrade Phase II"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Upload Document / PDF */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Upload Letter / Correspondence (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded p-4 text-center bg-gray-50 cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-gray-600 font-medium text-xs">Drag and drop scanned PDF letter, or click to browse</p>
              <p className="text-gray-400 text-[10px]">PDF format up to 25MB (NIC eOffice guidelines)</p>
            </div>
          </div>

          {/* Initial Remarks / Diarisation Note */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Initial Diarisation Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any specific dealing instructions or remarks..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit buttons */}
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
              className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Generate Diary & Diarise</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
