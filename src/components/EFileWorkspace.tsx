import React, { useState, useRef } from 'react';
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
  Columns,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  CheckSquare,
  Tag,
  FileSpreadsheet,
  Presentation,
  Table,
  Archive,
  RotateCcw,
  Split,
  GitMerge,
} from 'lucide-react';
import { EFileRecord, ReceiptRecord, EFileNote, EFileYellowNote, EFileDraft, FileAttachment } from '../types';
import { DfaComposerModal } from './DfaComposerModal';
import { ReferencingModal } from './ReferencingModal';

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
  onCreateDraft?: (fileId: string, draft: Partial<EFileDraft>) => void;
  onParkFile?: (file: EFileRecord) => void;
  onUnparkFile?: (file: EFileRecord) => void;
  onCreatePartFile?: (file: EFileRecord) => void;
  onMergePartFile?: (file: EFileRecord) => void;
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
  onCreateDraft,
  onParkFile,
  onUnparkFile,
  onCreatePartFile,
  onMergePartFile,
}) => {
  // View & Ratio Controls
  const [viewMode, setViewMode] = useState<'50-50' | 'full-notesheet' | 'full-correspondence' | '40-60'>('50-50');
  
  // Tabs for Right Pane
  const [rightActiveTab, setRightActiveTab] = useState<'correspondence' | 'draft' | 'movement' | 'references' | 'details' | 'attachments'>('correspondence');
  
  // Attachments State (Multi-format support: PDF, XLSX, ODT, DOCX, PPTX)
  const [attachmentsList, setAttachmentsList] = useState<FileAttachment[]>(file.attachments || []);
  const [activeAttachment, setActiveAttachment] = useState<FileAttachment | null>(file.attachments?.[0] || null);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [newAttName, setNewAttName] = useState('');
  const [newAttType, setNewAttType] = useState<FileAttachment['type']>('pdf');
  const [newAttDesc, setNewAttDesc] = useState('');

  // Notesheet States
  const [isAddingGreenNote, setIsAddingGreenNote] = useState(false);
  const [greenNoteText, setGreenNoteText] = useState('');
  const [isAddingYellowNote, setIsAddingYellowNote] = useState(false);
  const [yellowNoteText, setYellowNoteText] = useState('');
  const [dscSigningActive, setDscSigningActive] = useState(false);
  const [quickNoteDropdownOpen, setQuickNoteDropdownOpen] = useState(false);
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(0);
  
  // Modals
  const [isDfaComposerOpen, setIsDfaComposerOpen] = useState(false);
  const [isReferencingModalOpen, setIsReferencingModalOpen] = useState(false);
  
  // Highlighting state for references
  const [highlightedReference, setHighlightedReference] = useState<string | null>(null);
  
  // Movement search filter
  const [movementSearch, setMovementSearch] = useState('');

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

  const handleReferenceClick = (refText: string) => {
    setRightActiveTab('correspondence');
    if (viewMode === 'full-notesheet') {
      setViewMode('50-50');
    }
    setHighlightedReference(refText);
    setTimeout(() => {
      setHighlightedReference(null);
    }, 3000);
  };

  // Render note text with interactive reference pills
  const renderNoteTextWithReferences = (text: string) => {
    const refRegex = /\[Ref: (.*?)\]/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = refRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      const refContent = match[1];
      parts.push(
        <button
          key={match.index}
          onClick={() => handleReferenceClick(refContent)}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 rounded font-semibold text-[11px] cursor-pointer shadow-2xs align-baseline"
          title="Click to view referenced document in right pane"
        >
          <Bookmark className="w-3 h-3 text-blue-700 inline" />
          <span>Ref: {refContent}</span>
        </button>
      );
      lastIdx = refRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts.length > 0 ? parts : text;
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

        {/* Right Corner Buttons: Split Views & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Split Mode Toggle Buttons */}
          <div className="hidden sm:flex items-center bg-blue-950/60 rounded p-0.5 border border-blue-400/40 text-[11px]">
            <button
              onClick={() => setViewMode('50-50')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === '50-50' ? 'bg-blue-600 text-white font-bold' : 'text-blue-200 hover:text-white'
              }`}
              title="Split 50 : 50"
            >
              50 : 50
            </button>
            <button
              onClick={() => setViewMode('40-60')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === '40-60' ? 'bg-blue-600 text-white font-bold' : 'text-blue-200 hover:text-white'
              }`}
              title="Split 40 : 60 (Wide Correspondence)"
            >
              40 : 60
            </button>
            <button
              onClick={() => setViewMode('full-notesheet')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'full-notesheet' ? 'bg-blue-600 text-white font-bold' : 'text-blue-200 hover:text-white'
              }`}
              title="Full Notesheet"
            >
              Full Notesheet
            </button>
            <button
              onClick={() => setViewMode('full-correspondence')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'full-correspondence' ? 'bg-blue-600 text-white font-bold' : 'text-blue-200 hover:text-white'
              }`}
              title="Full Correspondence"
            >
              Full PUC
            </button>
          </div>

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
                    <span className="text-gray-500 text-[10px]">{qn.labelHi}</span>
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

          {/* Create DFA Button */}
          <button
            onClick={() => setIsDfaComposerOpen(true)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Create Draft (DFA)</span>
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

          {/* Park File Button */}
          {file.status !== 'Parked' && onParkFile && (
            <button
              onClick={() => onParkFile(file)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Park File: Temporarily remove from pendency SLA with due date"
            >
              <Archive className="w-3.5 h-3.5 text-amber-700" />
              <span>Park File</span>
            </button>
          )}

          {/* Unpark File Button */}
          {file.status === 'Parked' && onUnparkFile && (
            <button
              onClick={() => onUnparkFile(file)}
              className="bg-[#2a3b4c] hover:bg-[#1d2935] text-white px-2.5 py-1 rounded font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Unpark File: Restore immediately to active Inbox"
            >
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              <span>Unpark File</span>
            </button>
          )}

          {/* Create Part File Button */}
          {!file.isPartFile && onCreatePartFile && (
            <button
              onClick={() => onCreatePartFile(file)}
              className="bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-2.5 py-1 rounded font-medium shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Create Part File: Branch an urgent sub-file under CSMOP rules"
            >
              <Split className="w-3.5 h-3.5 text-cyan-700" />
              <span>Create Part File</span>
            </button>
          )}

          {/* Merge Part File Button */}
          {file.isPartFile && onMergePartFile && (
            <button
              onClick={() => onMergePartFile(file)}
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-2.5 py-1 rounded font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Merge Part File: Merge notes and PUC into parent main file"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Merge to Main</span>
            </button>
          )}
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

      {/* Contextual Alert Banner: Parked File */}
      {file.status === 'Parked' && (
        <div className="bg-amber-100/90 border-b border-amber-300 px-4 py-1.5 flex items-center justify-between text-xs text-amber-950 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-amber-700" />
            <span>
              <strong>FILE PARKED:</strong> This file is on administrative hold until{' '}
              <strong>{file.parkDetails?.parkDueDate || '15/09/2026'}</strong> ({file.parkDetails?.reason || 'Under Review'}). It is currently excluded from daily pendency SLA reports.
            </span>
          </div>
          {onUnparkFile && (
            <button
              onClick={() => onUnparkFile(file)}
              className="px-2.5 py-0.5 bg-amber-800 text-white rounded text-[11px] font-bold hover:bg-amber-900 cursor-pointer transition-colors"
            >
              Unpark File Now
            </button>
          )}
        </div>
      )}

      {/* Contextual Alert Banner: Part File */}
      {file.isPartFile && (
        <div className="bg-cyan-100/90 border-b border-cyan-300 px-4 py-1.5 flex items-center justify-between text-xs text-cyan-950 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <Split className="w-4 h-4 text-cyan-700" />
            <span>
              <strong>PART FILE (CSMOP):</strong> Branched from main parent file{' '}
              <strong className="font-mono">{file.parentFileNumber || 'eFile/KSITM/2026/DC-AUDIT/042'}</strong>.
            </span>
          </div>
          {onMergePartFile && (
            <button
              onClick={() => onMergePartFile(file)}
              className="px-2.5 py-0.5 bg-cyan-800 text-white rounded text-[11px] font-bold hover:bg-cyan-900 cursor-pointer transition-colors flex items-center gap-1"
            >
              <GitMerge className="w-3 h-3" />
              <span>Merge with Parent File</span>
            </button>
          )}
        </div>
      )}

      {/* ================= 3. Main Workspace Dual-Pane View ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ================= LEFT PANE: OFFICIAL GREEN NOTESHEET ================= */}
        {viewMode !== 'full-correspondence' && (
          <section
            aria-label="Notesheet"
            className={`${
              viewMode === 'full-notesheet'
                ? 'w-full'
                : viewMode === '40-60'
                ? 'w-full md:w-2/5'
                : 'w-full md:w-1/2'
            } bg-[#eaf4ea] border-r-2 border-[#b5d6b6] flex flex-col overflow-hidden shadow-inner relative transition-all duration-200`}
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
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-900 font-medium">
                  Total Notes: {file.notes.length}
                </span>
                {viewMode !== 'full-notesheet' && (
                  <button
                    onClick={() => setViewMode('full-notesheet')}
                    className="p-1 hover:bg-emerald-200 rounded text-emerald-800 cursor-pointer"
                    title="Maximize Notesheet"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Green Notes Canvas */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs bg-[#eaf4ea]">
              {/* Ruled lines simulation with authentic margin */}
              <div className="border-l-2 border-emerald-300/80 pl-3 space-y-4">
                {file.notes.length > 0 ? (
                  file.notes.map((note) => (
                    <article
                      key={note.id}
                      className="bg-white/95 p-4 rounded-md border border-emerald-200 shadow-xs relative leading-relaxed text-gray-800"
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

                      {/* Note Body with interactive reference pills */}
                      <div className="text-[12px] whitespace-pre-wrap leading-relaxed space-y-2 text-gray-900 font-serif">
                        {renderNoteTextWithReferences(note.text)}
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
                      <span>Yellow Note (Informal / Internal Scratchpad)</span>
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

                    {/* Formatting & Referencing Toolbar */}
                    <div className="flex items-center justify-between bg-gray-50 p-1 rounded border border-gray-200 text-xs flex-wrap gap-1">
                      <div className="flex items-center gap-1">
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
                        {/* Authentic eOffice Referencing Tool */}
                        <button
                          type="button"
                          onClick={() => setIsReferencingModalOpen(true)}
                          className="px-2.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold flex items-center gap-1 cursor-pointer text-[11px]"
                          title="Insert Reference to PUC or Prior Noting"
                        >
                          <Bookmark className="w-3 h-3 text-blue-700" />
                          <span>Insert Reference (Flag)</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-500">Government Secretariat Format</span>
                    </div>

                    <textarea
                      rows={7}
                      value={greenNoteText}
                      onChange={(e) => setGreenNoteText(e.target.value)}
                      placeholder="Type official notesheet proposal, audit deductions, statutory references, or recommendation here..."
                      className="w-full text-xs p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white leading-relaxed font-serif"
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
        )}

        {/* ================= RIGHT PANE: CORRESPONDENCE & REFERENCES ================= */}
        {viewMode !== 'full-notesheet' && (
          <section
            aria-label="Correspondence and References"
            className={`${
              viewMode === 'full-correspondence'
                ? 'w-full'
                : viewMode === '40-60'
                ? 'w-full md:w-3/5'
                : 'w-full md:w-1/2'
            } bg-gray-50 flex flex-col overflow-hidden transition-all duration-200`}
          >
            {/* Right Tab Bar */}
            <div className="bg-[#e4ebf5] border-b border-gray-300 flex items-center justify-between px-2 pt-1 shrink-0 overflow-x-auto text-xs">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setRightActiveTab('correspondence')}
                  className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                    rightActiveTab === 'correspondence'
                      ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs font-bold'
                      : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  Correspondence (PUC)
                </button>

                <button
                  onClick={() => setRightActiveTab('draft')}
                  className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer flex items-center gap-1 ${
                    rightActiveTab === 'draft'
                      ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs font-bold'
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
                      ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs font-bold'
                      : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  Movement / Minutes
                </button>

                <button
                  onClick={() => setRightActiveTab('references')}
                  className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                    rightActiveTab === 'references'
                      ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs font-bold'
                      : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  References
                </button>

                <button
                  onClick={() => setRightActiveTab('details')}
                  className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer ${
                    rightActiveTab === 'details'
                      ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs font-bold'
                      : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  File Details
                </button>

                <button
                  onClick={() => setRightActiveTab('attachments')}
                  className={`px-3 py-1.5 rounded-t font-semibold border-t border-x transition-colors cursor-pointer flex items-center gap-1.5 ${
                    rightActiveTab === 'attachments'
                      ? 'bg-white text-blue-900 border-gray-300 border-b-transparent shadow-xs font-bold'
                      : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                  <span>Attachments</span>
                  {attachmentsList.length > 0 && (
                    <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                      {attachmentsList.length}
                    </span>
                  )}
                </button>
              </div>

              {viewMode !== 'full-correspondence' && (
                <button
                  onClick={() => setViewMode('full-correspondence')}
                  className="p-1 hover:bg-blue-200 rounded text-blue-800 cursor-pointer mb-1"
                  title="Maximize Correspondence"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
              {/* ================= TAB 1: CORRESPONDENCE (PUC) ================= */}
              {rightActiveTab === 'correspondence' && (
                <div className="space-y-3">
                  {/* Highlight banner if referenced */}
                  {highlightedReference && (
                    <div className="p-2.5 bg-amber-100 border border-amber-300 rounded text-amber-950 font-medium text-xs flex items-center gap-2 animate-bounce">
                      <Bookmark className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Viewing Referenced Document: <strong>{highlightedReference}</strong></span>
                    </div>
                  )}

                  {/* Receipt Selector Tabs if multiple */}
                  {linkedReceipts.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-gray-500 font-semibold text-[11px]">PUC Receipts:</span>
                      {linkedReceipts.map((rc, idx) => (
                        <button
                          key={rc.id}
                          onClick={() => setSelectedReceiptIndex(idx)}
                          className={`px-2.5 py-1 rounded border text-[11px] font-medium cursor-pointer flex items-center gap-1 ${
                            selectedReceiptIndex === idx
                              ? 'bg-[#004e93] text-white border-[#004e93] font-bold shadow-xs'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <Bookmark className="w-3 h-3 text-amber-300" />
                          <span>Receipt #{rc.receiptNo}</span>
                          {rc.flag && (
                            <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-bold">
                              {rc.flag}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* The Official Tapal Document Canvas */}
                  <div className="bg-white p-6 rounded shadow-sm border border-gray-200 text-xs relative">
                    {/* Authentic Floating Bookmark Flag */}
                    <div className="absolute top-0 right-6 -translate-y-2">
                      <div className="bg-[#ff9900] text-black font-extrabold text-[10px] px-3 py-1 rounded-b-md shadow-md flex items-center gap-1 border-t-2 border-amber-600">
                        <Bookmark className="w-3 h-3 text-black fill-black" />
                        <span>{activeReceipt.flag || "Flag 'A' (PUC)"}</span>
                      </div>
                    </div>

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
                    <div className="space-y-3 text-gray-800 leading-relaxed text-[12px] font-serif">
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded border border-gray-300 cursor-pointer text-blue-800">
                          <FileText className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-medium">Compliance_Verification_Report_KSITM.pdf (2.4 MB)</span>
                          <Download className="w-3.5 h-3.5 text-gray-400 ml-1" />
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-blue-50 px-2.5 py-1.5 rounded border border-gray-300 cursor-pointer text-gray-700 text-[11px]">
                          <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                          <span>Flag 'B' - Prior Sanction Order</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: DRAFT FOR APPROVAL (DFA) ================= */}
              {rightActiveTab === 'draft' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded border border-blue-200">
                    <div>
                      <h3 className="font-bold text-blue-950 text-xs">Draft Communications (DFA Repository)</h3>
                      <p className="text-[11px] text-blue-800">Review, approve, or sign Fair Copies via DSC Token.</p>
                    </div>
                    <button
                      onClick={() => setIsDfaComposerOpen(true)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New DFA</span>
                    </button>
                  </div>

                  {file.drafts.length > 0 ? (
                    file.drafts.map((draft) => (
                      <div key={draft.id} className="bg-white p-5 rounded border border-gray-300 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                              {draft.type}
                            </span>
                            <span className="font-mono font-bold text-gray-800">{draft.draftNo}</span>
                            {draft.language && (
                              <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-medium">
                                {draft.language}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              draft.status === 'Dispatched'
                                ? 'bg-emerald-100 text-emerald-800'
                                : draft.status === 'Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
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
                          {draft.status !== 'Approved' && draft.status !== 'Dispatched' && (
                            <button
                              onClick={() => onApproveDraft(file.id, draft.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Draft</span>
                            </button>
                          )}
                          {draft.status !== 'Dispatched' && (
                            <button
                              onClick={() => onSignDraftWithDSC(file.id, draft.id)}
                              className="px-3 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Sign with DSC & Dispatch</span>
                            </button>
                          )}
                          {draft.status === 'Dispatched' && (
                            <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Signed via Class 3 Token & Dispatched</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-white rounded border border-gray-200 p-6 text-gray-500">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">No Draft for Approval (DFA) initiated on this file.</p>
                      <p className="text-[11px] mt-1">Officers can prepare Sanction Orders, Office Memorandums, or Letters.</p>
                      <button
                        onClick={() => setIsDfaComposerOpen(true)}
                        className="mt-3 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Draft Fair Copy (DFA)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 3: MOVEMENT / MINUTES ================= */}
              {rightActiveTab === 'movement' && (
                <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden text-xs">
                  <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 font-bold text-gray-800 flex items-center justify-between flex-wrap gap-2">
                    <span>File Movement & Desk Tracking History (Audit Trail)</span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2" />
                      <input
                        type="text"
                        placeholder="Search movement log..."
                        value={movementSearch}
                        onChange={(e) => setMovementSearch(e.target.value)}
                        className="border border-gray-300 rounded pl-7 pr-2 py-1 text-xs bg-white"
                      />
                    </div>
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
                        {file.movements
                          .filter(
                            (m) =>
                              m.sentBy.toLowerCase().includes(movementSearch.toLowerCase()) ||
                              m.sentTo.toLowerCase().includes(movementSearch.toLowerCase()) ||
                              m.remarks.toLowerCase().includes(movementSearch.toLowerCase())
                          )
                          .map((m, idx) => (
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

              {/* ================= TAB 6: ATTACHMENTS (Multi-format: PDF, XLSX, ODT, DOCX, PPTX) ================= */}
              {rightActiveTab === 'attachments' && (
                <div className="space-y-4 text-xs">
                  {/* Top Bar inside Attachments */}
                  <div className="bg-white p-3 rounded border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-[#0062b8]" />
                        <span>File Annexures & Multi-Format Attachments</span>
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Supports PDFs, Spreadsheets (.xlsx), OpenDocument Text (.odt), Word (.docx), and Presentations (.pptx).
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAttachModalOpen(true)}
                      className="px-3 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Attach New Document</span>
                    </button>
                  </div>

                  {/* Dual Layout: Left Attachment Cards | Right Live Viewer */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Left: Attachment Cards List */}
                    <div className="lg:col-span-5 space-y-2">
                      {attachmentsList.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded border border-gray-200 text-gray-400">
                          No supplementary documents attached to this notesheet yet.
                        </div>
                      ) : (
                        attachmentsList.map((att) => {
                          const isSelected = activeAttachment?.id === att.id;
                          return (
                            <div
                              key={att.id}
                              onClick={() => setActiveAttachment(att)}
                              className={`p-3 rounded border bg-white cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#0062b8] ring-1 ring-[#0062b8] shadow-sm bg-blue-50/40'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                                    att.type === 'xlsx'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : att.type === 'odt'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                      : att.type === 'docx'
                                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                      : att.type === 'pptx'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-red-100 text-red-800 border border-red-300'
                                  }`}
                                >
                                  .{att.type} • {att.size}
                                </span>

                                {att.flag && (
                                  <span className="bg-amber-400 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono">
                                    {att.flag}
                                  </span>
                                )}
                              </div>

                              <h4 className="font-semibold text-xs text-gray-900 mt-1.5 break-all">
                                {att.name}
                              </h4>

                              {att.description && (
                                <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
                                  {att.description}
                                </p>
                              )}

                              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                                <span>Uploaded by: {att.uploadedBy}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const citation = ` [Ref: ${att.flag || 'Flag'} - "${att.name}"]`;
                                      setGreenNoteText((prev) => (prev ? prev + citation : citation.trim()));
                                      setIsAddingGreenNote(true);
                                    }}
                                    className="text-[#0062b8] hover:underline font-bold"
                                    title="Insert Citation into Green Note"
                                  >
                                    Insert in Note
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Right: Live Interactive Document Preview Pane */}
                    <div className="lg:col-span-7 bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[420px]">
                      {activeAttachment ? (
                        <div className="flex-1 flex flex-col">
                          {/* Viewer Header */}
                          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs truncate max-w-[200px]">
                                {activeAttachment.name}
                              </span>
                              {activeAttachment.flag && (
                                <span className="bg-amber-400 text-amber-950 text-[10px] font-mono font-bold px-1 rounded">
                                  {activeAttachment.flag}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                const citation = ` [Ref: ${activeAttachment.flag || 'Flag'} - "${activeAttachment.name}"]`;
                                setGreenNoteText((prev) => (prev ? prev + citation : citation.trim()));
                                setIsAddingGreenNote(true);
                              }}
                              className="px-2 py-1 bg-white hover:bg-blue-50 text-[#0062b8] border border-blue-300 rounded text-[10px] font-bold cursor-pointer"
                            >
                              Cite in Note Sheet
                            </button>
                          </div>

                          {/* Specific Format Previews */}
                          <div className="flex-1 p-4 overflow-y-auto">
                            {/* 1. SPREADSHEET (XLSX) PREVIEW */}
                            {activeAttachment.type === 'xlsx' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between bg-emerald-50 p-2 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                                    <span>Worksheet Schedule: Statutory_TDS_Reconciliation.xlsx</span>
                                  </div>
                                  <span className="font-mono text-[10px]">Formulas Active (SUM, ROUND)</span>
                                </div>

                                <table className="w-full text-left text-[11px] border border-gray-300 border-collapse">
                                  <thead>
                                    <tr className="bg-gray-100 text-gray-800 font-semibold border-b border-gray-300">
                                      <th className="p-1.5 border-r border-gray-300 text-center">Item</th>
                                      <th className="p-1.5 border-r border-gray-300">Description</th>
                                      <th className="p-1.5 border-r border-gray-300 text-right">Gross (₹)</th>
                                      <th className="p-1.5 border-r border-gray-300 text-right">TDS 2% (₹)</th>
                                      <th className="p-1.5 border-r border-gray-300 text-right">GST TDS 2% (₹)</th>
                                      <th className="p-1.5 text-right font-bold text-emerald-900">Net Payable (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 font-mono">
                                    <tr>
                                      <td className="p-1.5 border-r border-gray-200 text-center">1</td>
                                      <td className="p-1.5 border-r border-gray-200 font-sans">Tier-III Security Audit Assessment Phase</td>
                                      <td className="p-1.5 border-r border-gray-200 text-right">10,00,000</td>
                                      <td className="p-1.5 border-r border-gray-200 text-right">20,000</td>
                                      <td className="p-1.5 border-r border-gray-200 text-right">20,000</td>
                                      <td className="p-1.5 text-right font-bold">9,60,000</td>
                                    </tr>
                                    <tr>
                                      <td className="p-1.5 border-r border-gray-200 text-center">2</td>
                                      <td className="p-1.5 border-r border-gray-200 font-sans">PAC & Power Redundancy Simulation Test</td>
                                      <td className="p-1.5 border-r border-gray-200 text-right">4,50,000</td>
                                      <td className="p-1.5 border-r border-gray-200 text-right">9,000</td>
                                      <td className="p-1.5 border-r border-gray-200 text-right">9,000</td>
                                      <td className="p-1.5 text-right font-bold">4,32,000</td>
                                    </tr>
                                    <tr className="bg-emerald-50/70 font-bold">
                                      <td colSpan={2} className="p-1.5 border-r border-gray-300 font-sans text-right">
                                        Total Audited Claim:
                                      </td>
                                      <td className="p-1.5 border-r border-gray-300 text-right">14,50,000</td>
                                      <td className="p-1.5 border-r border-gray-300 text-right">29,000</td>
                                      <td className="p-1.5 border-r border-gray-300 text-right">29,000</td>
                                      <td className="p-1.5 text-right text-emerald-900 font-bold">13,92,000</td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600">
                                  <strong>Auditor Note:</strong> Calculation verified against Kerala Financial Code (KFC) Art. 162 and Section 51 of SGST Act 2017. Ready for sanction.
                                </div>
                              </div>
                            )}

                            {/* 2. OPENDOCUMENT TEXT (ODT) / DOCX PREVIEW */}
                            {(activeAttachment.type === 'odt' || activeAttachment.type === 'docx') && (
                              <div className="space-y-3 font-serif text-gray-900 text-xs leading-relaxed p-2">
                                <div className="text-center border-b pb-2 border-gray-200 font-sans">
                                  <p className="font-bold uppercase text-[11px]">GOVERNMENT OF KERALA</p>
                                  <p className="text-[10px] text-gray-600">Electronics & Information Technology Department</p>
                                  <p className="font-mono text-[9px] text-gray-500 mt-0.5">Proceedings Ref: {file.fileNumber}/PROCEEDING</p>
                                </div>

                                <div className="space-y-2">
                                  <p>
                                    <strong>Sanction Order Draft:</strong> Sanction is hereby accorded for the release of payment amounting to Rs. 13,92,000/- (Rupees Thirteen Lakh Ninety-Two Thousand only) after statutory deductions towards Data Centre Audit Phase.
                                  </p>
                                  <p>
                                    The expenditure shall be debited to the Head of Account <em>'2052-00-090-94 State IT Infrastructure'</em> under the current fiscal budget.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* 3. PRESENTATION (PPTX) PREVIEW */}
                            {activeAttachment.type === 'pptx' && (
                              <div className="space-y-3">
                                <div className="p-2 bg-amber-50 border border-amber-200 rounded flex items-center justify-between text-amber-900 text-[11px] font-bold">
                                  <div className="flex items-center gap-1.5">
                                    <Presentation className="w-4 h-4 text-amber-700" />
                                    <span>Steering Committee Slides: {activeAttachment.name}</span>
                                  </div>
                                  <span className="text-[10px] font-mono">Slide 1 of 6</span>
                                </div>

                                <div className="bg-slate-900 text-white rounded p-6 shadow min-h-[220px] flex flex-col justify-between">
                                  <div>
                                    <span className="text-amber-400 text-[10px] uppercase font-mono tracking-widest">
                                      CONFIDENTIAL BRIEFING
                                    </span>
                                    <h2 className="text-base font-bold text-white mt-1">
                                      Tier-III Data Centre Redundancy & ISO 27001 Audit Findings
                                    </h2>
                                    <p className="text-gray-300 text-[11px] mt-2">
                                      Presented before IT Steering Committee & Principal Secretary (E&IT)
                                    </p>
                                  </div>

                                  <div className="border-t border-slate-700 pt-3 grid grid-cols-3 gap-2 text-[10px] text-gray-400">
                                    <div>Uptime: <strong>99.982%</strong></div>
                                    <div>PAC Redundancy: <strong>N+1 PASS</strong></div>
                                    <div>Audit Grade: <strong className="text-emerald-400">CLASS A</strong></div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 4. PDF PREVIEW */}
                            {activeAttachment.type === 'pdf' && (
                              <div className="space-y-3 font-serif text-gray-900 text-xs leading-relaxed p-2">
                                <div className="text-center border-b pb-2 border-gray-200 font-sans">
                                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                                    CERTIFIED AUDIT PDF REPORT
                                  </span>
                                  <h3 className="font-bold text-sm text-gray-900 mt-1">{activeAttachment.name}</h3>
                                  <p className="text-[10px] text-gray-500 font-mono">MD5 Checksum: a918f029bc3811d041e</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                  <p>
                                    <strong>Inspection Summary:</strong> The Third-party assessment team has completed physical and logical audit of KSDC Tier-III power infrastructure, dual-grid sub-stations, and precision air conditioning redundancy.
                                  </p>
                                  <p>
                                    All parameters conform to Uptime Institute Tier-III guidelines. No critical vulnerabilities detected in network zoning.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                          <Paperclip className="w-10 h-10 text-gray-300 mb-2" />
                          <p>Select an attachment to inspect.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
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

      {/* Modals */}
      {isDfaComposerOpen && (
        <DfaComposerModal
          isOpen={isDfaComposerOpen}
          onClose={() => setIsDfaComposerOpen(false)}
          fileNumber={file.fileNumber}
          fileSubject={file.subject}
          onSaveDraft={(draft) => {
            if (onCreateDraft) {
              onCreateDraft(file.id, draft);
            }
          }}
        />
      )}

      {isReferencingModalOpen && (
        <ReferencingModal
          isOpen={isReferencingModalOpen}
          onClose={() => setIsReferencingModalOpen(false)}
          receipts={linkedReceipts.length > 0 ? linkedReceipts : receipts}
          notes={file.notes}
          onInsertReference={(refTag) => {
            setIsAddingGreenNote(true);
            setGreenNoteText((prev) => (prev ? `${prev} ${refTag}` : refTag));
          }}
        />
      )}

      {/* Attach Document Modal (NIC eOffice 7.0 Multi-format) */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-300">
            <div className="bg-[#0062b8] text-white px-4 py-3 flex items-center justify-between font-bold text-sm">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                <span>eOffice 7.0 • Upload & Attach Annexure</span>
              </div>
              <button
                onClick={() => setIsAttachModalOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAttName) return;
                const newAtt: FileAttachment = {
                  id: `att-${Date.now()}`,
                  name: newAttName.endsWith(`.${newAttType}`) ? newAttName : `${newAttName}.${newAttType}`,
                  type: newAttType,
                  size: '1.4 MB',
                  uploadedBy: 'Rajesh Kumar, Dy. Secy (IT)',
                  uploadedAt: new Date().toLocaleDateString('en-GB'),
                  flag: `Flag '${String.fromCharCode(65 + attachmentsList.length)}'`,
                  description: newAttDesc || 'Uploaded annexure document supporting notesheet',
                };
                setAttachmentsList([newAtt, ...attachmentsList]);
                setActiveAttachment(newAtt);
                setNewAttName('');
                setNewAttDesc('');
                setIsAttachModalOpen(false);
              }}
              className="p-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Document Title / File Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budget_Allocation_Breakup or Sanction_Proceedings"
                  value={newAttName}
                  onChange={(e) => setNewAttName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    value={newAttType}
                    onChange={(e) => setNewAttType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                    <option value="odt">OpenDocument Text (.odt)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="pptx">PowerPoint Presentation (.pptx)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Auto Flag Assigned
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`Flag '${String.fromCharCode(65 + attachmentsList.length)}'`}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-gray-100 font-mono font-bold text-amber-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Description / Purpose of Attachment
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide brief context for the dealing officer..."
                  value={newAttDesc}
                  onChange={(e) => setNewAttDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Paperclip className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-gray-700 font-medium text-[11px]">
                  Drag and drop files here, or <span className="text-blue-600 underline">browse</span>
                </p>
                <p className="text-gray-400 text-[10px] mt-0.5">
                  Allowed: .pdf, .xlsx, .docx, .odt, .pptx up to 50 MB
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAttachModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold text-xs shadow-xs cursor-pointer"
                >
                  Upload & Attach Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
