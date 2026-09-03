import React, { useState } from 'react';
import { X, FolderPlus, FileText, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';
import { EFileRecord, RecordType } from '../types';

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFile: (newFile: Partial<EFileRecord>) => void;
}

export const CreateFileModal: React.FC<CreateFileModalProps> = ({
  isOpen,
  onClose,
  onSaveFile,
}) => {
  const [nature, setNature] = useState<RecordType>('E');
  const [basicHead, setBasicHead] = useState('22 - Finance & Accounts');
  const [primaryHead, setPrimaryHead] = useState('03 - Statutory Audit');
  const [secondaryHead, setSecondaryHead] = useState('01 - State Data Centre (SDC)');
  const [tertiaryHead, setTertiaryHead] = useState('General Verification');
  const [year, setYear] = useState('2026');
  const [section, setSection] = useState('KSITM-FIN');
  const [subject, setSubject] = useState('');
  const [classification, setClassification] = useState<'Unclassified' | 'Confidential' | 'Secret' | 'Top Secret'>('Confidential');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Immediate'>('Urgent');
  const [initialRemarks, setInitialRemarks] = useState('');

  if (!isOpen) return null;

  // Generate standard eOffice File Number preview
  const fileNumCode = basicHead.split(' - ')[0] + '-' + primaryHead.split(' - ')[0];
  const fileNumberPreview = `eFile/${section}/${year}/${fileNumCode}/${Math.floor(100 + Math.random() * 900)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      alert('Please enter a valid File Subject.');
      return;
    }

    onSaveFile({
      fileNumber: fileNumberPreview,
      nature,
      subject: subject.trim(),
      basicHead,
      primaryHead,
      secondaryHead,
      tertiaryHead,
      year,
      section,
      classification,
      priority,
      openingDate: new Date().toLocaleDateString('en-GB'),
      sentBy: 'AUDITOR1 (Self)',
      pendingWith: 'AUDITOR1 (Self)',
      status: 'Active',
      starred: false,
      notes: initialRemarks.trim()
        ? [
            {
              id: `fn-${Date.now()}`,
              noteNumber: 1,
              author: 'AUDITOR1',
              designation: 'Auditor1, Finance',
              department: 'KSITM',
              timestamp:
                new Date().toLocaleDateString('en-GB') +
                ' ' +
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                ' IST',
              text: initialRemarks.trim(),
              isGreenNote: true,
              signedBy: 'Digitally Signed by AUDITOR1 (NIC-CA IST)',
            },
          ]
        : [],
      yellowNotes: [],
      drafts: [],
      movements: [
        {
          id: `mov-${Date.now()}`,
          sentBy: 'AUDITOR1',
          sentTo: 'AUDITOR1 (Self)',
          sentDate: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeSpent: 'Active Desk',
          actionTaken: 'File Created and Opened',
          remarks: 'Initial Electronic File creation under CSMOP.',
        },
      ],
      correspondenceReceiptIds: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            <h2 className="text-sm font-bold">Create Electronic File (eFile) - Standard Numbering Plan</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs overflow-y-auto">
          {/* File Number Preview Banner */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded flex items-center justify-between">
            <div>
              <span className="text-blue-900 font-bold block text-xs">Generated File Number (CSMOP Compliant):</span>
              <span className="font-mono text-sm font-extrabold text-[#004e93]">{fileNumberPreview}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {nature === 'E' ? 'Electronic File' : 'Physical File'}
            </span>
          </div>

          {/* Nature & Classification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">File Nature:</label>
              <select
                value={nature}
                onChange={(e) => setNature(e.target.value as RecordType)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="E">Electronic (eFile)</option>
                <option value="P">Physical File</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Security Classification:</label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Unclassified">Unclassified / Ordinary</option>
                <option value="Confidential">Confidential</option>
                <option value="Secret">Secret</option>
                <option value="Top Secret">Top Secret</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Immediate">Immediate / Assembly Question</option>
              </select>
            </div>
          </div>

          {/* File Heads: Basic & Primary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Basic Head (Main Subject):</label>
              <select
                value={basicHead}
                onChange={(e) => setBasicHead(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="22 - Finance & Accounts">22 - Finance & Accounts</option>
                <option value="11 - Establishment & Administration">11 - Establishment & Administration</option>
                <option value="33 - Technical & e-Governance">33 - Technical & e-Governance</option>
                <option value="44 - Procurement & Tenders">44 - Procurement & Tenders</option>
                <option value="55 - RTI & Grievance Redressal">55 - RTI & Grievance Redressal</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Primary Head:</label>
              <select
                value={primaryHead}
                onChange={(e) => setPrimaryHead(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="03 - Statutory Audit">03 - Statutory Audit</option>
                <option value="01 - Budget Estimates & Allocation">01 - Budget Estimates & Allocation</option>
                <option value="02 - Cloud Infrastructure & Hosting">02 - Cloud Infrastructure & Hosting</option>
                <option value="04 - Cyber Security & Appliance">04 - Cyber Security & Appliance</option>
                <option value="05 - Establishment & Payroll">05 - Establishment & Payroll</option>
              </select>
            </div>
          </div>

          {/* Secondary & Tertiary Head */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Secondary Head:</label>
              <input
                type="text"
                value={secondaryHead}
                onChange={(e) => setSecondaryHead(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Section & Year:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-2/3 border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-1/3 border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              File Subject <span className="text-red-600">*</span>:
            </label>
            <textarea
              rows={2}
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Sanction and Approval for Annual Maintenance of State Data Centre..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Initial Green Note Remarks */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Opening Note (Note #1 on Green Sheet):
            </label>
            <textarea
              rows={3}
              value={initialRemarks}
              onChange={(e) => setInitialRemarks(e.target.value)}
              placeholder="Initial proposal or observation to record on Note #1..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-emerald-50/40 text-emerald-950"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
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
              <FolderPlus className="w-4 h-4" />
              <span>Create Electronic File</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
