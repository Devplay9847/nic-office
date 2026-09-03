import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Play,
  HelpCircle,
  RotateCcw,
  Archive,
  Split,
  Search,
  FileText,
  Mail,
  Send,
  Plus,
  Info,
  Activity,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ActiveModule, SubMenuOption } from '../types';

interface ActionRibbonProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  activeOption: SubMenuOption;
  onSelectOption: (option: SubMenuOption) => void;
  onCreateReceipt: () => void;
  onCreateFile: () => void;
  onAdvanceSearch: () => void;
  fileInboxCount?: number;
  fileSentCount?: number;
  fileParkedCount?: number;
  filePartCount?: number;
  receiptInboxCount?: number;
  receiptSentCount?: number;
  draftCount?: number;
}

export const ActionRibbon: React.FC<ActionRibbonProps> = ({
  onToggleDrawer,
  isDrawerOpen,
  activeModule,
  onSelectModule,
  activeOption,
  onSelectOption,
  onCreateReceipt,
  onCreateFile,
  onAdvanceSearch,
  fileInboxCount = 3,
  fileSentCount = 2,
  fileParkedCount = 2,
  filePartCount = 1,
  receiptInboxCount = 12,
  receiptSentCount = 4,
  draftCount = 1,
}) => {
  const [createReceiptDropdown, setCreateReceiptDropdown] = useState(false);
  const [createFileDropdown, setCreateFileDropdown] = useState(false);
  const [showPurposeGuide, setShowPurposeGuide] = useState(false);

  // Workflow Status Tooltip State (eOffice 7.0 visual cues)
  const [showWorkflowTooltip, setShowWorkflowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 48, left: 120 });
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipTimeoutRef = useRef<any>(null);

  const updateTooltipPosition = () => {
    if (statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + 6,
        left: Math.max(10, Math.min(window.innerWidth - 420, rect.left - 20)),
      });
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        statusButtonRef.current &&
        !statusButtonRef.current.contains(e.target as Node) &&
        !document.getElementById('receipt-workflow-status-tooltip')?.contains(e.target as Node)
      ) {
        setShowWorkflowTooltip(false);
      }
    };
    if (showWorkflowTooltip) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, [showWorkflowTooltip]);

  return (
    <div className="relative w-full bg-[#1c2229] border-b border-[#12161b] flex items-center select-none z-20 h-10 overflow-x-auto shadow-sm">
      {/* Leftmost: Hamburger menu icon button */}
      <button
        onClick={onToggleDrawer}
        title={isDrawerOpen ? 'Collapse Sub-Menu Drawer' : 'Expand Sub-Menu Drawer'}
        className="h-10 px-3 bg-[#004e93] hover:bg-[#003f77] text-white flex items-center justify-center border-r border-[#00386a] transition-colors cursor-pointer shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Left Carousel Arrow */}
      <button
        title="Scroll Left"
        className="h-10 px-2 bg-[#2a313b] hover:bg-[#353d49] text-gray-400 hover:text-white flex items-center justify-center border-r border-[#191e24] cursor-pointer shrink-0 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Ribbon Modules Track */}
      <div className="flex items-center space-x-4 px-2.5 overflow-x-auto py-1">
        {/* ================= GROUP 1: RECEIPT (Inward Tapal / Dak) ================= */}
        <div className="flex items-center h-8 rounded overflow-hidden shadow-sm shrink-0">
          {/* Tag label with angled right slant (Authentic NIC eOffice Folder Tab) */}
          <div
            onClick={() => {
              onSelectModule('receipt');
              onSelectOption('inbox');
            }}
            title="Receipt Module: Incoming letters, tapal, citizen petitions, and inward diarisation"
            className={`h-full pl-3 pr-4 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
              activeModule === 'receipt'
                ? 'bg-[#374151] text-white border-b-2 border-blue-400'
                : 'bg-[#2d343e] text-gray-300 hover:text-white hover:bg-[#374151]'
            }`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)',
              paddingRight: '18px',
            }}
          >
            <span>RECEIPT</span>

            {/* Workflow Status Indicator Icon (reflecting authentic eOffice 7.0 visual cues) */}
            <button
              id="receipt-workflow-status-indicator"
              ref={statusButtonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateTooltipPosition();
                setShowWorkflowTooltip((prev) => !prev);
              }}
              onMouseEnter={() => {
                if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                updateTooltipPosition();
                setShowWorkflowTooltip(true);
              }}
              onMouseLeave={() => {
                tooltipTimeoutRef.current = setTimeout(() => {
                  setShowWorkflowTooltip(false);
                }, 300);
              }}
              className="relative p-0.5 rounded hover:bg-black/40 text-emerald-400 hover:text-emerald-300 transition-all flex items-center justify-center cursor-pointer focus:outline-none"
              title="Workflow Status: Click or hover to view Receipt Processing Flow (eOffice 7.0)"
              aria-label="Workflow Status: View Receipt Processing Flow"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Activity className="w-3 h-3 ml-0.5 text-emerald-400" />
            </button>
          </div>

          {/* Action buttons connected to RECEIPT */}
          <div className="flex items-center h-full bg-[#1976d2] -ml-2">
            {/* Create ▸ with dropdown */}
            <div className="relative h-full">
              <button
                onClick={() => setCreateReceiptDropdown(!createReceiptDropdown)}
                className="h-full px-3 text-xs font-medium text-white hover:bg-[#1565c0] flex items-center gap-1 border-r border-[#1565c0] cursor-pointer transition-colors"
                title="Diarise incoming mail / tapal"
              >
                <span>Create</span>
                <Play className="w-2.5 h-2.5 fill-current rotate-90 sm:rotate-0" />
              </button>

              {createReceiptDropdown && (
                <div className="absolute left-0 top-full mt-0.5 w-44 bg-white text-gray-800 rounded shadow-xl border border-gray-200 py-1 text-xs z-50 animate-fadeIn">
                  <button
                    onClick={() => {
                      setCreateReceiptDropdown(false);
                      onCreateReceipt();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-blue-900 font-semibold flex items-center justify-between"
                  >
                    <span>Electronic (E)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">eDak</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateReceiptDropdown(false);
                      onCreateReceipt();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-700 flex items-center justify-between"
                  >
                    <span>Physical (Tapal)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">Paper</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inbox */}
            <button
              onClick={() => {
                onSelectModule('receipt');
                onSelectOption('inbox');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeModule === 'receipt' && (activeOption === 'inbox' || activeOption === 'browse_electronic')
                  ? 'bg-[#e2e8f0] text-gray-900 font-bold shadow-inner'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
              title="Receipt Inbox: View pending letters & tapal"
            >
              <span>Inbox</span>
              <span className="text-[10px] bg-amber-400 text-gray-900 px-1.5 py-0.2 rounded-full font-mono font-bold">
                {receiptInboxCount}
              </span>
            </button>

            {/* Sent */}
            <button
              onClick={() => {
                onSelectModule('receipt');
                onSelectOption('sent');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeModule === 'receipt' && activeOption === 'sent'
                  ? 'bg-[#e2e8f0] text-gray-900 font-bold shadow-inner'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
              title="Receipt Sent: View forwarded letters"
            >
              <span>Sent</span>
              <span className="text-[10px] bg-blue-900/60 text-white px-1.5 py-0.2 rounded-full font-mono">
                {receiptSentCount}
              </span>
            </button>

            {/* Advance Search */}
            <button
              onClick={onAdvanceSearch}
              className="h-full px-2.5 text-xs font-medium text-white hover:bg-[#1565c0] cursor-pointer transition-colors"
              title="Advance Search across all Receipts & Diary Numbers"
            >
              <Search className="w-3.5 h-3.5 inline mr-1" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* ================= GROUP 2: FILE (eFile / Electronic File Processing) ================= */}
        <div className="flex items-center h-8 rounded overflow-hidden shadow-sm shrink-0">
          {/* Tag label */}
          <div
            onClick={() => {
              onSelectModule('file');
              onSelectOption('inbox');
            }}
            title="eFile Module: Electronic Notesheets, Green Notes, Correspondence, and Decision Workflow"
            className={`h-full px-3.5 flex items-center font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
              activeModule === 'file'
                ? 'bg-[#374151] text-white border-b-2 border-emerald-400'
                : 'bg-[#2d343e] text-gray-300 hover:text-white hover:bg-[#374151]'
            }`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)',
              paddingRight: '18px',
            }}
          >
            FILE
          </div>

          {/* Action buttons */}
          <div className="flex items-center h-full bg-[#0062b8] -ml-2">
            {/* Create File Dropdown */}
            <div className="relative h-full">
              <button
                onClick={() => setCreateFileDropdown(!createFileDropdown)}
                className="h-full px-3 text-xs font-medium text-white hover:bg-[#005199] flex items-center gap-1 border-r border-[#005199] cursor-pointer transition-colors"
                title="Create New Electronic or Physical File"
              >
                <span>Create</span>
                <Play className="w-2.5 h-2.5 fill-current rotate-90 sm:rotate-0" />
              </button>

              {createFileDropdown && (
                <div className="absolute left-0 top-full mt-0.5 w-52 bg-white text-gray-800 rounded shadow-xl border border-gray-200 py-1 text-xs z-50 animate-fadeIn">
                  <button
                    onClick={() => {
                      setCreateFileDropdown(false);
                      onCreateFile();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-blue-900 font-semibold flex items-center justify-between"
                  >
                    <span>Non-SFS (Standard Heads)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-mono">CSMOP</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateFileDropdown(false);
                      onCreateFile();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-700 flex items-center justify-between"
                  >
                    <span>Single File System (SFS)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded font-mono">SFS</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inbox */}
            <button
              onClick={() => {
                onSelectModule('file');
                onSelectOption('inbox');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#005199] cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeModule === 'file' && activeOption === 'inbox'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold shadow-inner'
                  : 'text-white hover:bg-[#005199]'
              }`}
              title="File Inbox: Files currently pending at your desk for noting & decisions"
            >
              <span>Inbox</span>
              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-mono font-bold">
                {fileInboxCount}
              </span>
            </button>

            {/* Sent (with Pull Back) */}
            <button
              onClick={() => {
                onSelectModule('file');
                onSelectOption('sent');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#005199] cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeModule === 'file' && activeOption === 'sent'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold shadow-inner'
                  : 'text-white hover:bg-[#005199]'
              }`}
              title="Sent Files: View forwarded files with Pull Back capability for unread files"
            >
              <span>Sent</span>
              <span className="text-[10px] bg-blue-900/70 text-white px-1.5 py-0.2 rounded-full font-mono">
                {fileSentCount}
              </span>
            </button>

            {/* Parked Files */}
            <button
              onClick={() => {
                onSelectModule('file');
                onSelectOption('parked_files');
              }}
              className={`h-full px-2.5 text-xs font-medium border-r border-[#005199] cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeModule === 'file' && activeOption === 'parked_files'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold shadow-inner'
                  : 'text-white hover:bg-[#005199]'
              }`}
              title="Parked Files: Files kept on hold awaiting concurrence, legal opinions, or reports (excluded from pendency SLA)"
            >
              <Archive className="w-3 h-3 text-amber-300" />
              <span>Parked</span>
              <span className="text-[10px] bg-amber-500/80 text-gray-950 font-bold px-1.5 py-0.2 rounded-full font-mono">
                {fileParkedCount}
              </span>
            </button>

            {/* Part Files */}
            <button
              onClick={() => {
                onSelectModule('file');
                onSelectOption('part_files');
              }}
              className={`h-full px-2.5 text-xs font-medium border-r border-[#005199] cursor-pointer transition-colors flex items-center gap-1 ${
                activeModule === 'file' && activeOption === 'part_files'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold shadow-inner'
                  : 'text-white hover:bg-[#005199]'
              }`}
              title="Part Files: Sub-files branched for urgent processing when main file is in circulation"
            >
              <Split className="w-3 h-3 text-cyan-200" />
              <span>Part</span>
              <span className="text-[10px] bg-cyan-700 text-white px-1.5 py-0.2 rounded-full font-mono">
                {filePartCount}
              </span>
            </button>

            {/* Advance Search */}
            <button
              onClick={onAdvanceSearch}
              className="h-full px-2.5 text-xs font-medium text-white hover:bg-[#005199] cursor-pointer transition-colors"
              title="Advance Search across all eFiles"
            >
              <Search className="w-3.5 h-3.5 inline mr-1" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* ================= GROUP 3: ISSUE (Draft for Approval / Dispatch) ================= */}
        <div className="flex items-center h-8 rounded overflow-hidden shadow-sm shrink-0">
          {/* Tag label */}
          <div
            onClick={() => {
              onSelectModule('issue');
              onSelectOption('draft_inbox');
            }}
            title="Issue / Dispatch: Draft for Approval (DFA), Sanctions, OMs, and Outward Dispatch"
            className={`h-full px-3.5 flex items-center font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
              activeModule === 'issue'
                ? 'bg-[#374151] text-white border-b-2 border-purple-400'
                : 'bg-[#2d343e] text-gray-300 hover:text-white hover:bg-[#374151]'
            }`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)',
              paddingRight: '18px',
            }}
          >
            ISSUE
          </div>

          {/* Action buttons */}
          <div className="flex items-center h-full bg-[#5c2d91] -ml-2">
            <button
              onClick={() => {
                onSelectModule('issue');
                onSelectOption('draft_inbox');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#4c2479] cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeModule === 'issue' && (activeOption === 'draft_inbox' || activeOption === 'inbox')
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold'
                  : 'text-white hover:bg-[#4c2479]'
              }`}
              title="Drafts: View Drafts for Approval (DFA) pending sanction / DSC sign-off"
            >
              <span>Drafts</span>
              <span className="text-[10px] bg-purple-300 text-purple-950 font-bold px-1.5 py-0.2 rounded-full font-mono">
                {draftCount}
              </span>
            </button>

            <button
              onClick={() => {
                onSelectModule('issue');
                onSelectOption('draft_dispatched');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#4c2479] cursor-pointer transition-colors ${
                activeModule === 'issue' && activeOption === 'draft_dispatched'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold'
                  : 'text-white hover:bg-[#4c2479]'
              }`}
              title="Dispatched: View dispatched government letters, orders, and speed post numbers"
            >
              <span>Dispatched</span>
            </button>

            <button
              onClick={onAdvanceSearch}
              className="h-full px-2.5 text-xs font-medium text-white hover:bg-[#4c2479] cursor-pointer transition-colors"
            >
              <Search className="w-3.5 h-3.5 inline mr-1" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Purpose Explanation Button */}
      <div className="ml-auto pr-2 shrink-0 flex items-center">
        <button
          onClick={() => setShowPurposeGuide(true)}
          className="px-2.5 py-1 bg-[#263140] hover:bg-[#323f52] text-blue-200 hover:text-white rounded border border-gray-700/60 flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer"
          title="Explain the Purpose of this Quick Action Ribbon"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Ribbon Purpose & Workflow Guide</span>
        </button>
      </div>

      {/* Right Carousel Arrow */}
      <button
        title="Scroll Right"
        className="h-10 px-2 bg-[#2a313b] hover:bg-[#353d49] text-gray-400 hover:text-white flex items-center justify-center border-l border-[#191e24] cursor-pointer shrink-0 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Educational Purpose Guide Modal */}
      {showPurposeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn text-xs">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xl overflow-hidden flex flex-col text-gray-800">
            <div className="bg-[#004e93] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">
                  NIC eOffice — Purpose of the Quick-Access Action Ribbon
                </h3>
              </div>
              <button
                onClick={() => setShowPurposeGuide(false)}
                className="text-blue-100 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto leading-relaxed">
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-950">
                <p className="font-semibold mb-1">
                  Why does this horizontal toolbar exist in official NIC eOffice?
                </p>
                <p className="text-[11px]">
                  In government administrative workflow (CSMOP), officers execute hundreds of file
                  transactions daily. Instead of requiring users to repeatedly expand nested
                  left-hand tree menus, NIC designed this <strong>Primary Action Ribbon</strong> as a
                  persistent, 1-click control dock for the 3 main pillars of governance:
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                    <span className="px-2 py-0.5 bg-gray-800 text-white rounded text-[10px]">1. RECEIPT (Dak / Tapal)</span>
                    <span>Inward Communication Gateway</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Where public grievances, court notices, inter-departmental letters, and citizen emails
                    enter the system. Actions include <strong>Electronic Diarisation (E)</strong>, 
                    <strong>Physical Tapal (P)</strong>, and forwarding into files.
                  </p>
                </div>

                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-800 text-white rounded text-[10px]">2. FILE (eFile)</span>
                    <span>Decision Making & Notesheet Processing</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    The core engine where <strong>Green Notes</strong> (official numbered notes), 
                    <strong>Yellow Notes</strong> (draft discussion), and correspondence references are recorded.
                    Includes <strong>Parked Files</strong> (putting files on hold so they do not breach pendency SLAs)
                    and <strong>Sent Files with Pull Back</strong> (recalling a sent file before the recipient reads it).
                  </p>
                </div>

                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="flex items-center gap-2 font-bold text-purple-900 mb-1">
                    <span className="px-2 py-0.5 bg-purple-800 text-white rounded text-[10px]">3. ISSUE (DFA & Dispatch)</span>
                    <span>Outward Official Sanctions & Orders</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Drafts for Approval (DFA) like Government Orders (GOs), Office Memorandums (OMs), and
                    Sanctions signed with <strong>Digital Signature Certificates (DSC)</strong> and dispatched
                    via Postal Speed Post, Email, or eOffice network.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-900 text-[11px]">
                <strong>Tab Polygon Shape Design:</strong> The angled shape (clip-path) on the dark tab
                headers is NIC's visual design motif mimicking the physical index divider tabs protruding
                from official Secretariat paper dockets in government record rooms.
              </div>
            </div>

            <div className="bg-gray-100 px-4 py-2.5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPurposeGuide(false)}
                className="px-4 py-1.5 bg-[#004e93] text-white rounded font-semibold text-xs hover:bg-[#003d73] cursor-pointer"
              >
                Understood, Return to eFile
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Receipt Processing Flow Tooltip / Popover (eOffice 7.0 Visual Cues) */}
      {showWorkflowTooltip && (
        <div
          id="receipt-workflow-status-tooltip"
          style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
          className="fixed w-[380px] sm:w-[430px] bg-[#1a232f] text-gray-100 rounded-lg shadow-2xl border border-blue-500/40 z-[9999] overflow-hidden text-xs select-text animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={() => {
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            setShowWorkflowTooltip(true);
          }}
          onMouseLeave={() => {
            setShowWorkflowTooltip(false);
          }}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#00386a] to-[#005da6] px-3.5 py-2.5 flex items-center justify-between border-b border-blue-400/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-900/90 border border-blue-400/40 flex items-center justify-center text-blue-200">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-white text-xs tracking-wide flex items-center gap-1.5">
                  <span>RECEIPT PROCESSING FLOW</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-mono font-medium">
                    eOffice 7.0
                  </span>
                </div>
                <div className="text-[10px] text-blue-200">
                  CSMOP Inward Dak & PUC Lifecycle
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWorkflowTooltip(false)}
              className="text-blue-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time Status Strip */}
          <div className="bg-[#121922] px-3.5 py-2 border-b border-gray-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Inward Pipeline Active</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 font-mono text-[10px]">
              <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                Desk: {receiptInboxCount}
              </span>
              <span className="bg-blue-400/15 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded">
                Sent: {receiptSentCount}
              </span>
            </div>
          </div>

          {/* Stepper Pipeline: 4 Stages reflecting actual eOffice 7.0 visual cues */}
          <div className="p-3.5 space-y-3 bg-[#1a232f]">
            {/* Step 1: Diarisation */}
            <div className="flex items-start gap-2.5 relative">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-[10px] shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="w-0.5 h-7 bg-emerald-600/40 my-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-100 text-xs flex items-center gap-1">
                    1. Inward Diarisation (eDak / Physical)
                  </span>
                  <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700/50">
                    Auto-Stamped
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                  Incoming postal tapal or electronic citizen mail is indexed. An immutable Computer Diary Number (e.g. <span className="font-mono text-emerald-300 font-bold">518042/2026/FIN</span>) is stamped with barcoded receipt metadata.
                </p>
              </div>
            </div>

            {/* Step 2: Desk Scrutiny & Inbox */}
            <div className="flex items-start gap-2.5 relative">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-950 border-2 border-amber-400 text-amber-300 flex items-center justify-center font-bold text-[10px] shadow-xs animate-pulse">
                  2
                </div>
                <div className="w-0.5 h-7 bg-gray-700 my-0.5" />
              </div>
              <div className="flex-1 min-w-0 bg-[#232d3b] p-2.5 rounded border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200 text-xs flex items-center gap-1">
                    2. Desk Scrutiny & Action (Current Desk)
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-400/40">
                    Active Desk
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                  Scrutinised by Dealing Officer for statutory timelines & priority (Immediate, Urgent, Normal). Currently <strong className="text-white font-mono">{receiptInboxCount}</strong> communications await examination.
                </p>
              </div>
            </div>

            {/* Step 3: Put in File (PUC) */}
            <div className="flex items-start gap-2.5 relative">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#16202c] border border-cyan-500/60 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  3
                </div>
                <div className="w-0.5 h-7 bg-gray-700 my-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-200 text-xs">
                    3. Put in File (PUC Integration)
                  </span>
                  <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-700/50">
                    Docketing
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                  Receipt is attached as <strong className="text-cyan-300 font-medium">Paper Under Consideration (PUC)</strong> inside an active or newly generated eFile docket for green notesheet examination.
                </p>
              </div>
            </div>

            {/* Step 4: Outward Issue & Disposal */}
            <div className="flex items-start gap-2.5">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#16202c] border border-blue-500/60 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                  4
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-200 text-xs">
                    4. Outward Dispatch / Disposal
                  </span>
                  <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700/50">
                    Dispatched
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                  Fair copy / Draft for Approval (DFA) is issued, cryptographically signed using NIC DSC Token, and dispatched outward. Receipt marked as closed in register.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="bg-[#121922] p-2.5 border-t border-gray-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setShowWorkflowTooltip(false);
                onSelectModule('receipt');
                onSelectOption('inbox');
              }}
              className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white py-1 px-2.5 rounded text-[11px] font-semibold text-center transition-colors cursor-pointer"
            >
              Open Receipt Inbox ({receiptInboxCount})
            </button>
            <button
              onClick={() => {
                setShowWorkflowTooltip(false);
                onCreateReceipt();
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white py-1 px-3 rounded text-[11px] font-semibold transition-colors cursor-pointer"
            >
              + Diarise New
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
