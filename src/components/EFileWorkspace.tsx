import React, { useState } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  Printer,
  Paperclip,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Download,
  Plus,
  StickyNote,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
  History,
  BookOpen,
  Award,
  AlertCircle,
  FileCheck,
  Check,
  Languages,
  PenTool,
  Bookmark,
  Share2,
} from 'lucide-react';
import { EFileRecord, ReceiptRecord, EFileNote, EFileYellowNote, EFileDraft } from '../types';

interface EFileWorkspaceProps {
  file: EFileRecord;
  receipts: ReceiptRecord[];
  onClose: () => void;
  onSendFile: (fileId: string) => void;
  onAddGreenNote: (fileId: string, text: string) => void;
  onAddYellowNote: (fileId: string, text: string) => void;
  onConvertYellowToGreen: (fileId: string, yellowNoteId: string) => void;
  onDeleteYellowNote: (fileId: string, yellowNoteId: string) => void;
  onAttachMoreReceipts: (fileId: string) => void;
  onApproveDraft: (fileId: string, draftId: string) => void;
  onSignDraftWithDSC: (fileId: string, draftId: string) => void;
}

export const EFileWorkspace: React.FC<EFileWorkspaceProps> = ({
  file,
  receipts,
  onClose,
  onSendFile,
  onAddGreenNote,
  onAddYellowNote,
  onConvertYellowToGreen,
  onDeleteYellowNote,
  onAttachMoreReceipts,
  onApproveDraft,
  onSignDraftWithDSC,
}) => {
  // Navigation & Tabs
  const [rightActiveTab, setRightActiveTab] = useState<'correspondence' | 'draft' | 'movement' | 'references' | 'details'>('correspondence');
  
  // Notesheet States
  const [isAddingGreenNote, setIsAddingGreenNote] = useState(false);
  const [greenNoteText, setGreenNoteText] = useState('');
  const [isAddingYellowNote, setIsAddingYellowNote] = useState(false);
  const [yellowNoteText, setYellowNoteText] = useState('');
  const [dscSigningActive, setDscSigningActive] = useState(false);
  const [quickNoteDropdownOpen, setQuickNoteDropdownOpen] = useState(false);
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(0);

  // Linked receipts
  const linkedReceipts = receipts.filter((r) =>
    file.correspondenceReceiptIds.includes(r.id)
  );
  const activeReceipt = linkedReceipts[selectedReceiptIndex] || linkedReceipts[0] || receipts[0];

  // Standard Quick Notings (English & Hindi)
  const quickNotings = [
    { labelEn: 'For kind perusal and approval please.', labelHi: 'कृपया अवलोकनार्थ एवं अनुमोदनार्थ प्रस्तुत।' },
    { labelEn: 'May kindly be approved.', labelHi: 'कृपया अनुमोदन प्रदान करें।' },
    { labelEn: 'Discussed. Please put up fair copy.', labelHi: 'चर्चा हुई। कृपया स्वच्छ प्रति प्रस्तुत करें।' },
    { labelEn: 'Financial concurrence is accorded.', labelHi: 'वित्तीय सहमति प्रदान की जाती है।' },
    { labelEn: 'Sanction order put up for digital signature.', labelHi: 'स्वीकृति आदेश डिजिटल हस्ताक्षर हेतु प्रस्तुत।' },
    { labelEn: 'Forwarded for necessary compliance.', labelHi: 'आवश्यक अनुपालन हेतु अग्रेषित।' },
  ];

  const handleApplyQuickNote = (text: string) => {
    setIsAddingGreenNote(true);
    setGreenNoteText((prev) => (prev ? `${prev}\n\n${text}` : text));
    setQuickNoteDropdownOpen(false);
  };

  const handleSaveGreenNote = (signWithDSC: boolean = true) => {
    if (!greenNoteText.trim()) return;
    onAddGreenNote(file.id, greenNoteText.trim());
    setGreenNoteText('');
    setIsAddingGreenNote(false);
  };

  const handleSaveYellowNote = () => {
    if (!yellowNoteText.trim()) return;
    onAddYellowNote(file.id, yellowNoteText.trim());
    setYellowNoteText('');
    setIsAddingYellowNote(false);
  };

  const handleTriggerDSCVerification = () => {
    setDscSigningActive(true);
    setTimeout(() => {
      setDscSigningActive(false);
      alert('Digital Signature verified! Stamped with AUDITOR1 Class 3 DSC USB Token.');
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-[#12161b]/80 z-50 flex flex-col backdrop-blur-xs select-none animate-fadeIn">
      {/* ================= 1. Top eOffice 7.0 Master File Header ================= */}
      <header className="bg-[#004e93] text-white border-b border-[#00386a] px-4 py-2 flex flex-col md:flex-row md:items-center justify-between shadow-md shrink-0 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded flex items-center gap-1 text-xs font-semibold text-blue-100 hover:text-white transition-colors cursor-pointer"
            title="Back to Files / Inbox"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">eFile Inbox</span>
          </button>

          <div className="h-5 w-[1px] bg-blue-300/40"></div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#ff9900] text-black font-extrabold text-[11px] px-2 py-0.5 rounded shadow-xs font-mono">
                {file.nature === 'E' ? 'ELECTRONIC FILE' : 'PHYSICAL FILE'}
              </span>
              <span className="text-white font-mono font-bold text-sm tracking-wide">
                {file.fileNumber}
              </span>
              <span className="text-[10px] bg-red-700 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                {file.classification}
              </span>
              <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.2 rounded font-mono">
                Priority: {file.priority}
              </span>
            </div>
            <h1 className="text-xs text-blue-100 font-medium truncate max-w-2xl mt-0.5" title={file.subject}>
              {file.subject}
            </h1>
          </div>
        </div>

        {/* Right Corner Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="p-1.5 hover:bg-blue-700 rounded text-blue-100 hover:text-white transition-colors cursor-pointer"
            title="Print Complete File Dossier"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-600 rounded text-blue-100 hover:text-white transition-colors cursor-pointer"
            title="Close File Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= 2. Authentic eOffice Action Toolbar ================= */}
      <div className="bg-[#f0f4f9] border-b border-gray-300 px-3 py-1.5 flex items-center justify-between flex-wrap gap-2 text-xs shadow-xs shrink-0">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Add Green Note Button */}
          <button
            onClick={() => {
              setIsAddingGreenNote(true);
              setIsAddingYellowNote(false);
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Green Note</span>
          </button>

          {/* Quick Note Dropdown (English & Hindi) */}
          <div className="relative">
            <button
              onClick={() => setQuickNoteDropdownOpen(!quickNoteDropdownOpen)}
              className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quick Note</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1 rounded font-bold">En/हिं</span>
            </button>

            {quickNoteDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-80 bg-white text-gray-800 rounded-md shadow-2xl border border-gray-200 py-1.5 text-xs z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Standard Government Notings
                </div>
                {quickNotings.map((qn, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyQuickNote(`${qn.labelEn}\n(${qn.labelHi})`)}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-gray-800 border-b border-gray-50 flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="font-semibold text-emerald-950 text-[11px]">{qn.labelEn}</span>
                    <span className="text-gray-500 text-[10px] font-hindi">{qn.labelHi}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Yellow Note Button */}
          <button
            onClick={() => {
              setIsAddingYellowNote(true);
              setIsAddingGreenNote(false);
            }}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-700" />
            <span>Add Yellow Note</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>

          {/* Forward / Send File */}
          <button
            onClick={() => onSendFile(file.id)}
            className="bg-[#0062b8] hover:bg-[#005199] text-white px-3 py-1 rounded font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send / Forward File</span>
          </button>

          {/* Sign with DSC */}
          <button
            onClick={handleTriggerDSCVerification}
            className="bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{dscSigningActive ? 'Verifying Token...' : 'Sign with DSC Token'}</span>
          </button>

          {/* Attach Receipt */}
          <button
            onClick={() => onAttachMoreReceipts(file.id)}
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Paperclip className="w-3.5 h-3.5 text-gray-600" />
            <span>Put in File / Attach</span>
          </button>
        </div>

        {/* Right Info Tags */}
        <div className="flex items-center gap-2 text-[11px] text-gray-600">
          <span>Desk: <strong className="text-blue-900 font-bold">{file.pendingWith}</strong></span>
          <span>•</span>
          <span>Opened: <strong className="text-gray-800">{file.openingDate}</strong></span>
          <span>•</span>
          <span>Section: <strong className="text-gray-800">{file.section}</strong></span>
        </div>
      </div>

      {/* ================= 3. Main Workspace Dual-Pane View ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ================= LEFT PANE: OFFICIAL GREEN NOTESHEET ================= */}
        <section
          aria-label="Notesheet"
          className="w-full md:w-1/2 bg-[#eaf4ea] border-r-2 border-[#b5d6b6] flex flex-col overflow-hidden shadow-inner relative"
        >
          {/* Notesheet Ribbon */}
          <div className="bg-[#d2ebd3] px-4 py-2 border-b border-[#b7dfb9] flex items-center justify-between text-xs font-bold text-emerald-950 shrink-0">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-800" />
              <span className="tracking-wide">NOTE SHEET (e-Notes)</span>
              <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full font-mono">
                Official Green Paper
              </span>
            </div>
            <span className="text-[11px] text-emerald-900 font-medium">
              Total Notes: {file.notes.length}
            </span>
          </div>

          {/* Green Notes Canvas */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs bg-[#eaf4ea] bg-radial from-transparent to-black/2">
            {/* Ruled lines simulation with authentic margin */}
            <div className="border-l-2 border-emerald-300/80 pl-3 space-y-4">
              {file.notes.length > 0 ? (
                file.notes.map((note) => (
                  <article
                    key={note.id}
                    className="bg-white/90 p-4 rounded-md border border-emerald-200 shadow-xs relative leading-relaxed text-gray-800"
                  >
                    {/* Note Serial Header */}
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5 mb-2.5 text-emerald-950 font-bold">
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px]">
                        Note #{note.noteNumber}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {note.timestamp}
                      </span>
                    </div>

                    {/* Note Body with government paragraph indent */}
                    <div className="text-[12px] whitespace-pre-wrap leading-relaxed space-y-2 text-gray-900">
                      {note.text}
                    </div>

                    {/* Digital Signature Certificate (DSC) Seal */}
                    <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-col items-end text-right">
                      <div className="bg-emerald-50/90 border border-emerald-300 rounded p-2 text-[10px] max-w-sm flex items-start gap-2 shadow-xs">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-left space-y-0.5">
                          <p className="font-bold text-emerald-950">
                            {note.signedBy || `Digitally Signed by ${note.author}`}
                          </p>
                          <p className="text-emerald-800 font-medium">
                            {note.designation}, {note.department}
                          </p>
                          {note.certDetails && (
                            <p className="text-[9px] text-gray-500 font-mono">
                              Cert: {note.certDetails.cn} | Issuer: {note.certDetails.issuer}
                            </p>
                          )}
                          <p className="text-[9px] text-emerald-700 font-mono">
                            Reason: File Noting Approval / Concurrence
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-10 bg-white/60 rounded border border-emerald-200 p-6 text-emerald-900">
                  <p className="font-medium">No official green notes have been entered on this file yet.</p>
                  <button
                    onClick={() => setIsAddingGreenNote(true)}
                    className="mt-3 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Initiate Note #1 on Green Sheet</span>
                  </button>
                </div>
              )}

              {/* Yellow Notes Section (Draft / Informal Remarks) */}
              {file.yellowNotes && file.yellowNotes.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <StickyNote className="w-3.5 h-3.5 text-amber-700" />
                    <span>Yellow Note (Informal / Internal Query)</span>
                  </div>
                  {file.yellowNotes.map((yn) => (
                    <div
                      key={yn.id}
                      className="bg-[#fffde7] border border-amber-300 rounded p-3 text-amber-950 shadow-sm relative space-y-2 mb-2"
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-1 text-[10px]">
                        <span className="font-bold">{yn.author}</span>
                        <span className="text-gray-500 font-mono">{yn.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{yn.text}</p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => onDeleteYellowNote(file.id, yn.id)}
                          className="text-[10px] text-red-600 hover:underline cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          onClick={() => onConvertYellowToGreen(file.id, yn.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
                        >
                          Convert to Green Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* New Green Note Editor Form */}
              {isAddingGreenNote && (
                <div className="bg-white p-3.5 rounded-md border-2 border-emerald-600 shadow-lg animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1.5 text-xs">
                    <span className="font-bold text-emerald-950">
                      Drafting Note #{file.notes.length + 1}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Dealing Hand: AUDITOR1</span>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded border border-gray-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setGreenNoteText((prev) => prev + '\n1. ')}
                      className="px-2 py-0.5 hover:bg-gray-200 rounded font-bold text-gray-700 cursor-pointer"
                      title="Numbered Paragraph"
                    >
                      1. Para
                    </button>
                    <button
                      type="button"
                      onClick={() => setGreenNoteText((prev) => prev + '\n   • ')}
                      className="px-2 py-0.5 hover:bg-gray-200 rounded font-bold text-gray-700 cursor-pointer"
                      title="Bullet Point"
                    >
                      • Bullet
                    </button>
                    <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                    <span className="text-[10px] text-gray-500">Government Secretariat Format</span>
                  </div>

                  <textarea
                    rows={6}
                    value={greenNoteText}
                    onChange={(e) => setGreenNoteText(e.target.value)}
                    placeholder="Type official notesheet proposal, audit deductions, statutory references, or recommendation here..."
                    className="w-full text-xs p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-500">
                      Will be digitally stamped with your active DSC token upon saving.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingGreenNote(false)}
                        className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveGreenNote(true)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1 text-xs rounded font-bold shadow flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Sign & Save Green Note</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* New Yellow Note Editor Form */}
              {isAddingYellowNote && (
                <div className="bg-[#fffde7] p-3 rounded-md border-2 border-amber-400 shadow-md animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1 text-xs text-amber-950 font-bold">
                    <span>New Yellow Note (Informal / Scratchpad)</span>
                    <span className="text-[10px] text-gray-500">AUDITOR1</span>
                  </div>
                  <textarea
                    rows={3}
                    value={yellowNoteText}
                    onChange={(e) => setYellowNoteText(e.target.value)}
                    placeholder="Informal query or comment for colleague review..."
                    className="w-full text-xs p-2 border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingYellowNote(false)}
                      className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveYellowNote}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs rounded font-bold shadow cursor-pointer"
                    >
                      Save Yellow Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= RIGHT PANE: CORRESPONDENCE & REFERENCES ================= */}
        <section
          aria-label="Correspondence and References"
          className="w-full md:w-1/2 bg-gray-50 flex flex-col overflow-hidden"
        >
          {/* Right Tab Bar */}
          <div className="bg-[#e4ebf5] border-b border-gray-300 flex items-center justify-between px-2 pt-1 shrink-0 overflow-x-auto text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setRightActiveTab('correspondence')}
                className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                  rightActiveTab === 'correspondence'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Correspondence (PUC)
              </button>

              <button
                onClick={() => setRightActiveTab('draft')}
                className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer flex items-center gap-1 ${
                  rightActiveTab === 'draft'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <span>Draft (DFA)</span>
                {file.drafts.length > 0 && (
                  <span className="bg-blue-600 text-white text-[9px] px-1.5 rounded-full font-mono">
                    {file.drafts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setRightActiveTab('movement')}
                className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                  rightActiveTab === 'movement'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Movement / Minutes
              </button>

              <button
                onClick={() => setRightActiveTab('references')}
                className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                  rightActiveTab === 'references'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                References
              </button>

              <button
                onClick={() => setRightActiveTab('details')}
                className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                  rightActiveTab === 'details'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                File Details
              </button>
            </div>
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
            {/* ================= TAB 1: CORRESPONDENCE (PUC) ================= */}
            {rightActiveTab === 'correspondence' && (
              <div className="space-y-3">
                {/* Receipt Selector Tabs if multiple */}
                {linkedReceipts.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-gray-500 font-semibold text-[11px]">PUC Receipts:</span>
                    {linkedReceipts.map((rc, idx) => (
                      <button
                        key={rc.id}
                        onClick={() => setSelectedReceiptIndex(idx)}
                        className={`px-2 py-0.5 rounded border text-[11px] font-medium cursor-pointer ${
                          selectedReceiptIndex === idx
                            ? 'bg-[#004e93] text-white border-[#004e93] font-bold'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Receipt #{rc.receiptNo}
                      </button>
                    ))}
                  </div>
                )}

                {/* The Official Tapal Document Canvas */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 text-xs">
                  {/* Letterhead */}
                  <div className="border-b-2 border-gray-800 pb-3 mb-4 text-center">
                    <p className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">
                      GOVERNMENT OF KERALA / ELECTRONIC TAPAL
                    </p>
                    <h2 className="text-sm font-bold text-gray-900 mt-0.5">
                      {activeReceipt.sender}
                    </h2>
                    <p className="text-[11px] text-gray-600">
                      {activeReceipt.senderDesignation}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div>
                      <span className="text-gray-500">Diary / Receipt No:</span>{' '}
                      <strong className="text-gray-900 font-mono">#{activeReceipt.receiptNo}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Letter Date:</span>{' '}
                      <strong className="text-gray-900">{activeReceipt.letterDate}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Attached File:</span>{' '}
                      <strong className="text-blue-700 font-mono">{file.fileNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>{' '}
                      <strong className="text-gray-900">{activeReceipt.category}</strong>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <span className="font-bold text-gray-900 block mb-1">Subject:</span>
                    <p className="font-semibold text-blue-950 bg-blue-50/70 p-2.5 rounded border-l-3 border-blue-600 leading-snug">
                      {activeReceipt.subject}
                    </p>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-3 text-gray-800 leading-relaxed text-[12px]">
                    <p>Sir / Madam,</p>
                    <p>
                      With reference to the aforementioned subject, the detailed operational report and statutory compliance documents are submitted herewith for necessary examination and administrative concurrence.
                    </p>
                    <p>
                      The audit observations, SLA reconciliation, and asset verification statements have been verified by the dealing division. Necessary budget provision is available under the relevant Head of Account.
                    </p>
                    <p>
                      Submitted for kind consideration and further orders.
                    </p>
                  </div>

                  {/* Enclosures / Attachments */}
                  <div className="mt-6 pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-700 text-[11px] block mb-1">
                      Enclosures & Scanned Letters (PDF):
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded border border-gray-300 cursor-pointer text-blue-800">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium">Compliance_Verification_Report_KSITM.pdf (2.4 MB)</span>
                        <Download className="w-3.5 h-3.5 text-gray-400 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: DRAFT FOR APPROVAL (DFA) ================= */}
            {rightActiveTab === 'draft' && (
              <div className="space-y-3">
                {file.drafts.length > 0 ? (
                  file.drafts.map((draft) => (
                    <div key={draft.id} className="bg-white p-5 rounded border border-gray-300 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div>
                          <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                            {draft.type}
                          </span>
                          <span className="font-mono font-bold text-gray-800 ml-2">{draft.draftNo}</span>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                          {draft.status}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-[11px] space-y-1">
                        <div><strong>Subject:</strong> {draft.subject}</div>
                        <div><strong>Addressed To:</strong> {draft.addressee} ({draft.addressedToOrg})</div>
                      </div>

                      <div className="p-3 bg-white border border-gray-200 rounded text-xs whitespace-pre-wrap font-serif leading-relaxed text-gray-900">
                        {draft.body}
                      </div>

                      {draft.copyTo.length > 0 && (
                        <div className="text-[11px] text-gray-600">
                          <span className="font-bold">Copy To:</span>
                          <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
                            {draft.copyTo.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* DFA Actions */}
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
                        <button
                          onClick={() => onApproveDraft(file.id, draft.id)}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Draft</span>
                        </button>
                        <button
                          onClick={() => onSignDraftWithDSC(file.id, draft.id)}
                          className="px-3 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Sign with DSC & Dispatch</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded border border-gray-200 p-6 text-gray-500">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-gray-700">No Draft for Approval (DFA) initiated on this file.</p>
                    <p className="text-[11px] mt-1">Officers can prepare Sanction Orders, Office Memorandums, or Letters.</p>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 3: MOVEMENT / MINUTES ================= */}
            {rightActiveTab === 'movement' && (
              <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden text-xs">
                <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 font-bold text-gray-800 flex items-center justify-between">
                  <span>File Movement & Desk Tracking History (Audit Trail)</span>
                  <span className="text-[10px] text-gray-500 font-normal">CSMOP Audit Logging Active</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">S.No</th>
                        <th className="py-2 px-3">Sent By</th>
                        <th className="py-2 px-3">Sent To</th>
                        <th className="py-2 px-3">Sent On</th>
                        <th className="py-2 px-3">Time Spent</th>
                        <th className="py-2 px-3">Action Taken</th>
                        <th className="py-2 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {file.movements.map((m, idx) => (
                        <tr key={m.id} className="hover:bg-blue-50/50">
                          <td className="py-2 px-3 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-gray-900">{m.sentBy}</td>
                          <td className="py-2 px-3 font-semibold text-blue-800">{m.sentTo}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-gray-600">{m.sentDate}</td>
                          <td className="py-2 px-3 text-gray-600">{m.timeSpent}</td>
                          <td className="py-2 px-3 font-medium text-emerald-800">{m.actionTaken}</td>
                          <td className="py-2 px-3 text-gray-700 italic max-w-xs truncate">{m.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB 4: REFERENCES ================= */}
            {rightActiveTab === 'references' && (
              <div className="space-y-3 text-xs">
                <div className="bg-white p-4 rounded border border-gray-200 shadow-sm space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm">Linked References & Government Orders (G.O.)</h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 bg-blue-50/60 rounded border border-blue-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-blue-950">G.O.(Rt) No. 1104/2026/FIN</span>
                        <p className="text-gray-600">Delegation of Financial Powers for State IT Mission Projects</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">Work Order No. KSITM/DC/WO-77/2025</span>
                        <p className="text-gray-600">Engagement of Empaneled Security Audit Agency</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 5: FILE DETAILS ================= */}
            {rightActiveTab === 'details' && (
              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm text-xs space-y-3">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-1">
                  Electronic File Metadata Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-500 block">File Number:</span>
                    <strong className="font-mono text-blue-900 text-xs">{file.fileNumber}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Opening Date:</span>
                    <strong className="text-gray-900">{file.openingDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Basic Head:</span>
                    <strong className="text-gray-800">{file.basicHead}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Primary Head:</span>
                    <strong className="text-gray-800">{file.primaryHead}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Secondary Head:</span>
                    <strong className="text-gray-800">{file.secondaryHead || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Dealing Section:</span>
                    <strong className="text-gray-800">{file.section}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Security Classification:</span>
                    <strong className="text-red-700">{file.classification}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Current Status:</span>
                    <strong className="text-emerald-800">{file.status} (Pending with {file.pendingWith})</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================= 4. Workspace Footer ================= */}
      <footer className="bg-gray-100 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600 shrink-0">
        <div className="flex items-center gap-3">
          <span>National Informatics Centre (NIC) • eOffice 7.2.0</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium">PKI USB Crypto Token Active</span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 text-gray-800 rounded font-medium cursor-pointer"
        >
          Close File Workspace
        </button>
      </footer>
    </div>
  );
};
