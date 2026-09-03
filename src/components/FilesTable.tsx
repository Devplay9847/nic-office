import React, { useState } from 'react';
import {
  Star,
  Folder,
  FolderOpen,
  Send,
  Search,
  RefreshCw,
  Plus,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Paperclip,
  CheckSquare,
  Square,
  AlertTriangle,
  Archive,
  RotateCcw,
  Split,
  GitMerge,
  Info,
  Calendar,
  Lock,
} from 'lucide-react';
import { EFileRecord, RecordType, SubMenuOption } from '../types';

interface FilesTableProps {
  files: EFileRecord[];
  onSelectFile: (file: EFileRecord) => void;
  activeOption: SubMenuOption;
  onSelectOption?: (option: SubMenuOption) => void;
  onCreateFile: () => void;
  onSendFiles: (fileIds: string[]) => void;
  onToggleStar: (fileId: string) => void;
  onRefresh: () => void;
  onPullBackFile?: (file: EFileRecord) => void;
  onParkFile?: (file: EFileRecord) => void;
  onUnparkFile?: (file: EFileRecord) => void;
  onCreatePartFile?: (file: EFileRecord) => void;
  onMergePartFile?: (file: EFileRecord) => void;
}

export const FilesTable: React.FC<FilesTableProps> = ({
  files,
  onSelectFile,
  activeOption,
  onSelectOption,
  onCreateFile,
  onSendFiles,
  onToggleStar,
  onRefresh,
  onPullBackFile,
  onParkFile,
  onUnparkFile,
  onCreatePartFile,
  onMergePartFile,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [natureFilter, setNatureFilter] = useState<'ALL' | 'E' | 'P'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Normalize current queue filter based on activeOption
  const getQueueFilter = (): 'inbox' | 'sent' | 'parked' | 'part' | 'closed' | 'all' => {
    switch (activeOption) {
      case 'inbox':
      case 'created':
      case 'create_new_file':
        return 'inbox';
      case 'sent':
        return 'sent';
      case 'parked_files':
        return 'parked';
      case 'part_files':
        return 'part';
      case 'completed_files':
      case 'closed':
        return 'closed';
      default:
        return 'inbox';
    }
  };

  const currentQueue = getQueueFilter();

  // Counts for each queue tab
  const inboxFilesCount = files.filter(
    (f) => !f.isPartFile && (f.queueStatus === 'inbox' || (!f.queueStatus && f.status !== 'Parked' && f.status !== 'Closed'))
  ).length;

  const sentFilesCount = files.filter(
    (f) => f.queueStatus === 'sent' || f.status === 'Forwarded'
  ).length;

  const parkedFilesCount = files.filter(
    (f) => f.queueStatus === 'parked' || f.status === 'Parked'
  ).length;

  const partFilesCount = files.filter(
    (f) => f.isPartFile === true || f.queueStatus === 'part'
  ).length;

  const closedFilesCount = files.filter(
    (f) => f.queueStatus === 'closed' || f.status === 'Closed'
  ).length;

  // Filter files by queue, nature, and search term
  const filteredFiles = files.filter((f) => {
    // 1. Queue Filter
    if (currentQueue === 'inbox') {
      const isInbox = !f.isPartFile && (f.queueStatus === 'inbox' || (!f.queueStatus && f.status !== 'Parked' && f.status !== 'Closed'));
      if (!isInbox) return false;
    } else if (currentQueue === 'sent') {
      const isSent = f.queueStatus === 'sent' || f.status === 'Forwarded';
      if (!isSent) return false;
    } else if (currentQueue === 'parked') {
      const isParked = f.queueStatus === 'parked' || f.status === 'Parked';
      if (!isParked) return false;
    } else if (currentQueue === 'part') {
      const isPart = f.isPartFile === true || f.queueStatus === 'part';
      if (!isPart) return false;
    } else if (currentQueue === 'closed') {
      const isClosed = f.queueStatus === 'closed' || f.status === 'Closed';
      if (!isClosed) return false;
    }

    // 2. Nature filter
    if (natureFilter !== 'ALL' && f.nature !== natureFilter) return false;

    // 3. Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        f.fileNumber.toLowerCase().includes(term) ||
        f.subject.toLowerCase().includes(term) ||
        f.section.toLowerCase().includes(term) ||
        f.pendingWith.toLowerCase().includes(term) ||
        (f.sentToOfficer && f.sentToOfficer.toLowerCase().includes(term)) ||
        (f.parkDetails && f.parkDetails.reason.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const totalFiles = filteredFiles.length;
  const totalPages = Math.ceil(totalFiles / pageSize) || 1;

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSubTitleText = () => {
    switch (currentQueue) {
      case 'inbox':
        return 'Electronic File Inbox — Active Files at Your Desk';
      case 'sent':
        return 'Sent / Forwarded Files — Movement Tracking & Pull Back';
      case 'parked':
        return 'Parked Electronic Files — Excluded from Daily Pendency Aging';
      case 'part':
        return 'Part Files — Branched Sub-Files under CSMOP';
      case 'closed':
        return 'Completed / Closed Files — Historical Records Retention';
      default:
        return 'Electronic File Management (eFile)';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* 1. eOffice Queue Tabs Bar */}
      <div className="bg-[#f0f4f9] border-b border-gray-300 px-3 pt-2 flex items-center justify-between gap-2 text-xs shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1">
          {/* Inbox Tab */}
          <button
            onClick={() => onSelectOption && onSelectOption('inbox')}
            className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x flex items-center gap-1.5 ${
              currentQueue === 'inbox'
                ? 'bg-white text-blue-900 border-gray-300 shadow-xs border-b-2 border-b-white -mb-[1px]'
                : 'bg-gray-200/70 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>File Inbox</span>
            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-mono">
              {inboxFilesCount}
            </span>
          </button>

          {/* Sent Tab */}
          <button
            onClick={() => onSelectOption && onSelectOption('sent')}
            className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x flex items-center gap-1.5 ${
              currentQueue === 'sent'
                ? 'bg-white text-blue-900 border-gray-300 shadow-xs border-b-2 border-b-white -mb-[1px]'
                : 'bg-gray-200/70 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-blue-700" />
            <span>Sent Files</span>
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-mono">
              {sentFilesCount}
            </span>
          </button>

          {/* Parked Tab */}
          <button
            onClick={() => onSelectOption && onSelectOption('parked_files')}
            className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x flex items-center gap-1.5 ${
              currentQueue === 'parked'
                ? 'bg-white text-amber-900 border-gray-300 shadow-xs border-b-2 border-b-white -mb-[1px]'
                : 'bg-gray-200/70 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-amber-600" />
            <span>Parked Files</span>
            <span className="text-[10px] bg-amber-500 text-gray-950 font-bold px-1.5 py-0.2 rounded-full font-mono">
              {parkedFilesCount}
            </span>
          </button>

          {/* Part Files Tab */}
          <button
            onClick={() => onSelectOption && onSelectOption('part_files')}
            className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x flex items-center gap-1.5 ${
              currentQueue === 'part'
                ? 'bg-white text-blue-900 border-gray-300 shadow-xs border-b-2 border-b-white -mb-[1px]'
                : 'bg-gray-200/70 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-cyan-600" />
            <span>Part Files</span>
            <span className="text-[10px] bg-cyan-700 text-white px-1.5 py-0.2 rounded-full font-mono">
              {partFilesCount}
            </span>
          </button>

          {/* Closed Files Tab */}
          <button
            onClick={() => onSelectOption && onSelectOption('completed_files')}
            className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x flex items-center gap-1.5 ${
              currentQueue === 'closed'
                ? 'bg-white text-blue-900 border-gray-300 shadow-xs border-b-2 border-b-white -mb-[1px]'
                : 'bg-gray-200/70 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-gray-600" />
            <span>Closed Files</span>
            <span className="text-[10px] bg-gray-500 text-white px-1.5 py-0.2 rounded-full font-mono">
              {closedFilesCount}
            </span>
          </button>
        </div>

        {/* View title label on right */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-gray-600 font-medium pb-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>{getSubTitleText()}</span>
        </div>
      </div>

      {/* 2. Operations Toolbar */}
      <div className="bg-[#f8fafc] border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onCreateFile}
            className="px-3 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Create New Electronic File (CSMOP Heads or SFS)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create File</span>
          </button>

          {/* Send File */}
          <button
            onClick={() => onSendFiles(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border font-medium transition-all ${
              selectedIds.length > 0
                ? 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300 shadow-xs cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            title="Send / Forward selected files to an officer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send File</span>
          </button>

          {/* Park Selected */}
          {currentQueue === 'inbox' && (
            <button
              onClick={() => {
                if (selectedIds.length > 0) {
                  const targetFile = files.find((f) => f.id === selectedIds[0]);
                  if (targetFile && onParkFile) onParkFile(targetFile);
                }
              }}
              disabled={selectedIds.length === 0}
              className={`px-2.5 py-1 rounded flex items-center gap-1 border font-medium transition-all ${
                selectedIds.length > 0
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              title="Park File: Put file on hold with due date & reason"
            >
              <Archive className="w-3.5 h-3.5 text-amber-700" />
              <span>Park File</span>
            </button>
          )}

          {/* Part File Creation */}
          {currentQueue === 'inbox' && (
            <button
              onClick={() => {
                if (selectedIds.length > 0) {
                  const targetFile = files.find((f) => f.id === selectedIds[0]);
                  if (targetFile && onCreatePartFile) onCreatePartFile(targetFile);
                }
              }}
              disabled={selectedIds.length === 0}
              className={`px-2.5 py-1 rounded flex items-center gap-1 border font-medium transition-all ${
                selectedIds.length > 0
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-300 shadow-xs cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              title="Create Part File from selected file"
            >
              <Split className="w-3.5 h-3.5 text-cyan-700" />
              <span>Create Part File</span>
            </button>
          )}

          <div className="h-5 w-[1px] bg-gray-300 mx-0.5"></div>

          {/* Nature Filter Pills */}
          <div className="flex items-center bg-gray-200/80 p-0.5 rounded border border-gray-300">
            <button
              onClick={() => setNatureFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                natureFilter === 'ALL'
                  ? 'bg-white text-blue-800 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Files
            </button>
            <button
              onClick={() => setNatureFilter('E')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                natureFilter === 'E'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Electronic (E)
            </button>
            <button
              onClick={() => setNatureFilter('P')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                natureFilter === 'P'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Physical (P)
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            title="Refresh eFiles Repository"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search File No, Subject, Officer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 bg-white border border-gray-300 rounded text-xs w-48 sm:w-64 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Table Container */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          {/* Header */}
          <thead className="sticky top-0 bg-[#f1f4f8] text-gray-700 border-b border-gray-300 text-[11px] select-none z-10 shadow-xs">
            <tr>
              <th className="py-2 px-2.5 w-8 text-center border-r border-gray-200">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredFiles.length}
                  onChange={toggleSelectAll}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2 px-2 w-7 text-center border-r border-gray-200">
                <Star className="w-3.5 h-3.5 text-gray-400 mx-auto" />
              </th>
              <th className="py-2 px-2.5 w-12 text-center border-r border-gray-200">
                Nature
              </th>
              <th className="py-2 px-3 w-56 border-r border-gray-200">
                File Number
              </th>
              <th className="py-2 px-3 min-w-[260px] border-r border-gray-200">
                Subject
              </th>

              {currentQueue === 'inbox' && (
                <>
                  <th className="py-2 px-3 w-28 border-r border-gray-200">
                    Opening Date
                  </th>
                  <th className="py-2 px-3 w-36 border-r border-gray-200">
                    Pending Desk
                  </th>
                  <th className="py-2 px-2.5 w-24 text-center border-r border-gray-200">
                    Days Pending
                  </th>
                  <th className="py-2 px-2.5 w-20 text-center border-r border-gray-200">
                    Priority
                  </th>
                </>
              )}

              {currentQueue === 'sent' && (
                <>
                  <th className="py-2 px-3 w-36 border-r border-gray-200">
                    Sent To Officer
                  </th>
                  <th className="py-2 px-3 w-28 border-r border-gray-200">
                    Sent Date
                  </th>
                  <th className="py-2 px-3 w-28 text-center border-r border-gray-200">
                    Recipient Status
                  </th>
                  <th className="py-2 px-3 w-28 text-center border-r border-gray-200">
                    Pull Back Option
                  </th>
                </>
              )}

              {currentQueue === 'parked' && (
                <>
                  <th className="py-2 px-3 w-28 border-r border-gray-200">
                    Park Due Date
                  </th>
                  <th className="py-2 px-3 min-w-[200px] border-r border-gray-200">
                    Parking Reason & Authority
                  </th>
                  <th className="py-2 px-3 w-28 text-center border-r border-gray-200">
                    Park Action
                  </th>
                </>
              )}

              {currentQueue === 'part' && (
                <>
                  <th className="py-2 px-3 w-44 border-r border-gray-200">
                    Parent Main File
                  </th>
                  <th className="py-2 px-3 w-28 text-center border-r border-gray-200">
                    Merge Option
                  </th>
                </>
              )}

              {currentQueue === 'closed' && (
                <>
                  <th className="py-2 px-3 w-28 border-r border-gray-200">
                    Record Date
                  </th>
                  <th className="py-2 px-3 w-28 text-center border-r border-gray-200">
                    Retention Cat.
                  </th>
                </>
              )}

              <th className="py-2 px-3 w-24 text-center">
                Action
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((f, idx) => {
                const isSelected = selectedIds.includes(f.id);
                const daysPending = f.daysPending ?? 1;

                return (
                  <tr
                    key={f.id}
                    className={`transition-colors hover:bg-blue-50/70 group ${
                      isSelected ? 'bg-blue-50/80' : idx % 2 === 1 ? 'bg-[#fcfdfd]' : 'bg-white'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-2.5 text-center border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(f.id)}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Star */}
                    <td className="py-2.5 px-2 text-center border-r border-gray-100">
                      <button
                        onClick={() => onToggleStar(f.id)}
                        className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            f.starred
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Nature */}
                    <td className="py-2.5 px-2.5 text-center border-r border-gray-100">
                      <span
                        className={`inline-block font-bold text-[11px] px-1.5 py-0.5 rounded shadow-xs font-mono ${
                          f.nature === 'E'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {f.nature}
                      </span>
                    </td>

                    {/* File Number */}
                    <td className="py-2.5 px-3 border-r border-gray-100 font-mono text-[11px]">
                      <button
                        onClick={() => onSelectFile(f)}
                        className="text-[#005199] hover:text-[#00305a] hover:underline font-bold text-left block truncate max-w-xs cursor-pointer flex items-center gap-1.5"
                        title="Click to Open eFile Split-View Notesheet & Correspondence"
                      >
                        <Folder className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">{f.fileNumber}</span>
                      </button>
                      {f.isPartFile && (
                        <span className="inline-block mt-0.5 text-[9px] bg-cyan-100 text-cyan-800 font-bold px-1 rounded font-sans">
                          Part File
                        </span>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="py-2.5 px-3 border-r border-gray-100">
                      <div
                        onClick={() => onSelectFile(f)}
                        className="cursor-pointer text-gray-800 hover:text-blue-900 leading-snug line-clamp-2 font-medium"
                        title={f.subject}
                      >
                        {f.subject}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>Notes: <strong>{f.notes.length}</strong></span>
                        <span>•</span>
                        <span>Linked Receipts: <strong>{f.correspondenceReceiptIds.length}</strong></span>
                        <span>•</span>
                        <span>Section: <strong>{f.section}</strong></span>
                        {f.classification !== 'Unclassified' && (
                          <span className="text-red-700 font-bold uppercase">• {f.classification}</span>
                        )}
                      </div>
                    </td>

                    {/* INBOX COLUMNS */}
                    {currentQueue === 'inbox' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px] text-gray-600 font-mono">
                          {f.openingDate}
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px]">
                          <span className="font-semibold text-gray-900 block truncate">{f.pendingWith}</span>
                          <span className="text-[10px] text-gray-500 block truncate">From: {f.sentBy}</span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center border-r border-gray-100">
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              daysPending >= 7
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : daysPending >= 3
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                            title={daysPending >= 7 ? 'SLA Alert: Over 7 days pending' : 'Within pendency limits'}
                          >
                            {daysPending} {daysPending === 1 ? 'day' : 'days'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center border-r border-gray-100">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              f.priority === 'Immediate'
                                ? 'bg-red-600 text-white font-bold'
                                : f.priority === 'Urgent'
                                ? 'bg-amber-100 text-amber-900 font-bold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {f.priority}
                          </span>
                        </td>
                      </>
                    )}

                    {/* SENT COLUMNS */}
                    {currentQueue === 'sent' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px]">
                          <span className="font-bold text-gray-900 block truncate">
                            {f.sentToOfficer || f.pendingWith}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px] text-gray-600 font-mono">
                          {f.sentDate || '27/08/2026'}
                        </td>
                        <td className="py-2.5 px-3 text-center border-r border-gray-100 text-[11px]">
                          {f.isReadByRecipient ? (
                            <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                              Read / Opened
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold animate-pulse">
                              Unread by Officer
                            </span>
                          )}
                        </td>
                        {/* PULL BACK BUTTON (Highlight of eOffice 7.0!) */}
                        <td className="py-2.5 px-3 text-center border-r border-gray-100">
                          {!f.isReadByRecipient ? (
                            <button
                              onClick={() => onPullBackFile && onPullBackFile(f)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-[10px] rounded shadow-xs flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                              title="Pull Back: Recall unread file back to your Inbox"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Pull Back</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">
                              Cannot recall (Read)
                            </span>
                          )}
                        </td>
                      </>
                    )}

                    {/* PARKED COLUMNS */}
                    {currentQueue === 'parked' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px]">
                          <div className="font-mono font-bold text-amber-900 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{f.parkDetails?.parkDueDate || '15/09/2026'}</span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            Parked: {f.parkDetails?.parkedDate || '25/08/2026'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px]">
                          <p className="font-medium text-gray-900">
                            {f.parkDetails?.reason || 'Awaiting Finance Concurrence'}
                          </p>
                          {f.parkDetails?.remarks && (
                            <p className="text-[10px] text-gray-500 mt-0.5">{f.parkDetails.remarks}</p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center border-r border-gray-100">
                          <button
                            onClick={() => onUnparkFile && onUnparkFile(f)}
                            className="px-2.5 py-1 bg-[#2a3b4c] hover:bg-[#1e2a36] text-white font-bold text-[10px] rounded shadow-xs flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                            title="Unpark File: Restore immediately to your active Inbox"
                          >
                            <Archive className="w-3 h-3 text-amber-400" />
                            <span>Unpark File</span>
                          </button>
                        </td>
                      </>
                    )}

                    {/* PART FILES COLUMNS */}
                    {currentQueue === 'part' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px]">
                          <span className="font-mono text-blue-900 font-bold block truncate">
                            {f.parentFileNumber || 'eFile/KSITM/2026/DC-AUDIT/042'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center border-r border-gray-100">
                          <button
                            onClick={() => onMergePartFile && onMergePartFile(f)}
                            className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-[10px] rounded shadow-xs flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                            title="Merge Part File into Main Parent File"
                          >
                            <GitMerge className="w-3 h-3" />
                            <span>Merge to Main</span>
                          </button>
                        </td>
                      </>
                    )}

                    {/* CLOSED COLUMNS */}
                    {currentQueue === 'closed' && (
                      <>
                        <td className="py-2.5 px-3 border-r border-gray-100 text-[11px] text-gray-600 font-mono">
                          31/03/2026
                        </td>
                        <td className="py-2.5 px-3 text-center border-r border-gray-100 text-[11px]">
                          <span className="text-[10px] bg-gray-100 text-gray-800 font-bold px-1.5 py-0.5 rounded border border-gray-300">
                            Category 'B' (10 Yrs)
                          </span>
                        </td>
                      </>
                    )}

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectFile(f)}
                        className="px-2.5 py-1 bg-[#0062b8] hover:bg-[#005199] text-white text-[11px] rounded font-semibold cursor-pointer shadow-xs transition-colors"
                      >
                        Open File
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-12 text-gray-500">
                  <Folder className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700">No electronic files in this queue.</p>
                  <button
                    onClick={onCreateFile}
                    className="mt-2 text-blue-700 hover:underline font-bold text-xs cursor-pointer"
                  >
                    + Create a new Electronic File
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Table Footer / Pagination */}
      <div className="bg-[#f0f4f9] border-t border-gray-300 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 shrink-0">
        <div className="flex items-center gap-2">
          <span>Total Electronic Files in Queue: <strong className="text-gray-900 font-bold">{totalFiles}</strong></span>
          <span>|</span>
          <div className="flex items-center gap-1">
            <span>Page Size:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-gray-300 rounded px-1.5 py-0.5 bg-white text-xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
