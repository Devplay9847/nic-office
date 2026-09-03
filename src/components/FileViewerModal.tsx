import React, { useState } from 'react';
import { X, Send, ShieldCheck, Printer, Paperclip, CheckCircle2, AlertCircle, FileText, ArrowLeft, Download, Plus } from 'lucide-react';
import { ReceiptRecord } from '../types';

interface FileViewerModalProps {
  record: ReceiptRecord | null;
  onClose: () => void;
  onSend: (id: string) => void;
  onAddNote: (recordId: string, text: string) => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  record,
  onClose,
  onSend,
  onAddNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [dscSigned, setDscSigned] = useState(false);

  if (!record) return null;

  const handleSaveNote = () => {
    if (!newNoteText.trim()) return;
    onAddNote(record.id, newNoteText.trim());
    setNewNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-center items-center p-2 sm:p-4 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-md shadow-2xl flex flex-col overflow-hidden border border-gray-300">
        {/* Top eOffice Title Bar */}
        <div className="bg-[#0062b8] text-white px-4 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
              {record.type === 'E' ? 'Electronic (E)' : 'Physical (P)'} #{record.receiptNo}
            </span>
            <h2 className="text-sm font-semibold truncate max-w-xl">
              {record.subjectCode}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors cursor-pointer"
              title="Print Notesheet & Correspondence"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors cursor-pointer"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons Sub-header */}
        <div className="bg-[#f0f4f9] border-b border-gray-200 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNote(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded flex items-center gap-1 font-medium shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Green Note</span>
            </button>

            <button
              onClick={() => {
                setDscSigned(true);
                alert('Digital Signature verified! Signed with AUDITOR1 Class 3 DSC USB Token.');
              }}
              className={`px-3 py-1 rounded flex items-center gap-1 font-medium shadow-xs transition-colors cursor-pointer ${
                dscSigned
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white hover:bg-blue-50 text-blue-800 border border-blue-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dscSigned ? 'DSC Digitally Signed' : 'Sign with DSC'}</span>
            </button>

            <button
              onClick={() => onSend(record.id)}
              className="bg-[#0062b8] hover:bg-[#005199] text-white px-3 py-1 rounded flex items-center gap-1 font-medium shadow-xs cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Forward / Send</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-[11px]">
            <span>Category: <strong className="text-gray-800">{record.category}</strong></span>
            <span>•</span>
            <span>Priority: <strong className="text-red-700">{record.priority}</strong></span>
            <span>•</span>
            <span>Pending: <strong className="text-blue-800">{record.pendingWith}</strong></span>
          </div>
        </div>

        {/* Split View Content: Authentic eOffice dual-pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* ================= LEFT PANE: GREEN NOTESHEET ================= */}
          <div className="w-full md:w-1/2 bg-[#eef7ee] border-r border-[#c4e1c5] flex flex-col overflow-hidden">
            <div className="bg-[#d4edd5] px-4 py-2 border-b border-[#b7dfb9] flex items-center justify-between text-xs font-bold text-emerald-950">
              <span className="tracking-wide">NOTE SHEET (e-Notes)</span>
              <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full font-mono">
                Official Green Paper
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {/* Existing Notes */}
              {record.notes && record.notes.length > 0 ? (
                record.notes.map((n, idx) => (
                  <div
                    key={n.id}
                    className="bg-white/80 p-3 rounded border border-emerald-200/80 shadow-xs relative"
                  >
                    {/* Note Serial Tag */}
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1 mb-2 text-emerald-900 font-semibold">
                      <span>Note #{idx + 1}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{n.timestamp}</span>
                    </div>

                    <p className="text-gray-800 leading-relaxed text-[12px] whitespace-pre-wrap">
                      {n.text}
                    </p>

                    {/* Official Signature Stamp */}
                    <div className="mt-3 pt-2 border-t border-emerald-100/60 flex flex-col items-end text-right text-[10px]">
                      <span className="font-bold text-gray-900">{n.author}</span>
                      <span className="text-gray-600">{n.designation}</span>
                      <span className="text-gray-500">{n.department}</span>
                      {n.signedBy && (
                        <div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{n.signedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No notes have been added to this receipt yet.</p>
                  <button
                    onClick={() => setIsAddingNote(true)}
                    className="mt-2 text-emerald-700 hover:underline font-semibold"
                  >
                    + Click here to add Note #1
                  </button>
                </div>
              )}

              {/* Add Note Editor Form */}
              {isAddingNote && (
                <div className="bg-white p-3 rounded-md border-2 border-emerald-500 shadow-md animate-fadeIn">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-900">New Note / Minute Entry</span>
                    <span className="text-[10px] text-gray-500">AUDITOR1 (Self)</span>
                  </div>
                  <textarea
                    rows={4}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type official green note remarks, observations, or concurrence here..."
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={() => setIsAddingNote(false)}
                      className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 text-xs rounded font-semibold cursor-pointer"
                    >
                      Save & Sign Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANE: CORRESPONDENCE / LETTER ================= */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col overflow-hidden">
            <div className="bg-[#e4ebf5] px-4 py-2 border-b border-gray-300 flex items-center justify-between text-xs font-bold text-gray-800">
              <span className="tracking-wide">CORRESPONDENCE / TAPAL DOCUMENT</span>
              <span className="text-[10px] bg-blue-800 text-white px-2 py-0.5 rounded-full">
                Document Preview
              </span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-white m-3 rounded shadow-sm border border-gray-200 text-xs">
              {/* Official Letterhead Simulation */}
              <div className="border-b-2 border-gray-800 pb-3 mb-4 text-center">
                <p className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">
                  GOVERNMENT OF KERALA / NIC E-OFFICE
                </p>
                <h1 className="text-sm font-bold text-gray-900 mt-0.5">
                  {record.sender}
                </h1>
                <p className="text-[11px] text-gray-600">
                  {record.senderDesignation}
                </p>
              </div>

              {/* Letter Metadata Header */}
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 bg-gray-50 p-2.5 rounded border border-gray-200">
                <div>
                  <span className="text-gray-500">Diary / Receipt No:</span>{' '}
                  <strong className="text-gray-900">{record.receiptNo}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Letter Date:</span>{' '}
                  <strong className="text-gray-900">{record.letterDate}</strong>
                </div>
                <div>
                  <span className="text-gray-500">File Reference:</span>{' '}
                  <strong className="text-blue-700">{record.fileNumber || 'Unlinked'}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Classification:</span>{' '}
                  <strong className="text-gray-900">CONFIDENTIAL / OFFICIAL</strong>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <span className="font-bold text-gray-900 block mb-1">Subject:</span>
                <p className="font-semibold text-blue-900 bg-blue-50/70 p-2 rounded border-l-3 border-blue-600 leading-snug">
                  {record.subject}
                </p>
              </div>

              {/* Official Body Text */}
              <div className="space-y-3 text-gray-800 leading-relaxed text-[12px]">
                <p>Sir / Madam,</p>
                <p>
                  With reference to the aforementioned subject, the detailed operational audit and statutory compliance report has been compiled for review and necessary financial concurrence.
                </p>
                <p>
                  All relevant vouchers, audit observations, and vendor SLA certifications have been verified by the dealing section. Necessary budget provision is certified to be available under Head of Account 2052-00-090-99.
                </p>
                <p>
                  Submitted for appropriate approval and administrative sanction.
                </p>
              </div>

              {/* Enclosures / Annexures */}
              <div className="mt-6 pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-700 text-[11px] block mb-1">
                  Enclosures & Attachments (PDF):
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded border border-gray-300 cursor-pointer text-blue-800">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium">Audit_Compliance_Report_KSITM.pdf (2.4 MB)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <span>eOffice eFile Record ID: {record.id}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
