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
} from 'lucide-react';
import { EFileRecord, RecordType, SubMenuOption } from '../types';

interface FilesTableProps {
  files: EFileRecord[];
  onSelectFile: (file: EFileRecord) => void;
  activeOption: SubMenuOption;
  onCreateFile: () => void;
  onSendFiles: (fileIds: string[]) => void;
  onToggleStar: (fileId: string) => void;
  onRefresh: () => void;
}

export const FilesTable: React.FC<FilesTableProps> = ({
  files,
  onSelectFile,
  activeOption,
  onCreateFile,
  onSendFiles,
  onToggleStar,
  onRefresh,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [natureFilter, setNatureFilter] = useState<'ALL' | 'E' | 'P'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredFiles = files.filter((f) => {
    if (natureFilter !== 'ALL' && f.nature !== natureFilter) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        f.fileNumber.toLowerCase().includes(term) ||
        f.subject.toLowerCase().includes(term) ||
        f.section.toLowerCase().includes(term) ||
        f.pendingWith.toLowerCase().includes(term)
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
    switch (activeOption) {
      case 'inbox':
        return 'Electronic File Inbox (Active Files at Desk)';
      case 'created':
      case 'create_new_file':
        return 'Created / Initiated Files';
      case 'sent':
        return 'Sent / Forwarded Files';
      case 'parked_files':
        return 'Parked Files';
      case 'completed_files':
      case 'closed':
        return 'Completed / Closed Files';
      default:
        return 'File Management';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Operations Toolbar */}
      <div className="bg-[#f4f6f9] border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onCreateFile}
            className="px-3 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Create New Electronic File"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create File</span>
          </button>

          <button
            onClick={() => onSendFiles(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border font-medium transition-all ${
              selectedIds.length > 0
                ? 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300 shadow-xs cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            title="Send / Forward to Officer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send File</span>
          </button>

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
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Electronic (E)
            </button>
            <button
              onClick={() => setNatureFilter('P')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                natureFilter === 'P'
                  ? 'bg-amber-700 text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Physical (P)
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Search Input */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by File No, Subject, Section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Sub-Header Banner */}
      <div className="bg-[#e9eff6] px-3 py-1.5 border-b border-gray-200 flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center gap-1.5 font-bold text-gray-900">
          <FolderOpen className="w-4 h-4 text-[#0062b8]" />
          <span>{getSubTitleText()}</span>
        </div>
        <div className="text-[11px] text-gray-600">
          Total Electronic Files: <strong className="text-gray-900">{files.length}</strong>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
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
              <th className="py-2 px-3 min-w-[280px] border-r border-gray-200">
                Subject
              </th>
              <th className="py-2 px-3 w-28 border-r border-gray-200">
                Opening Date
              </th>
              <th className="py-2 px-3 w-36 border-r border-gray-200">
                Sent By / Desk
              </th>
              <th className="py-2 px-2.5 w-24 text-center border-r border-gray-200">
                Classification
              </th>
              <th className="py-2 px-2.5 w-20 text-center border-r border-gray-200">
                Priority
              </th>
              <th className="py-2 px-3 w-24 text-center">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((f, idx) => {
                const isSelected = selectedIds.includes(f.id);
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

                    {/* Nature Badge */}
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

                    {/* File Number (Clickable Link to Open Split Workspace) */}
                    <td className="py-2.5 px-3 border-r border-gray-100 font-mono text-[11px]">
                      <button
                        onClick={() => onSelectFile(f)}
                        className="text-[#005199] hover:text-[#00305a] hover:underline font-bold text-left block truncate max-w-xs cursor-pointer flex items-center gap-1.5"
                        title="Click to Open eFile Split-View Workspace"
                      >
                        <Folder className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">{f.fileNumber}</span>
                      </button>
                    </td>

                    {/* Subject */}
                    <td className="py-2.5 px-3 border-r border-gray-100">
                      <div
                        onClick={() => onSelectFile(f)}
                        className="cursor-pointer text-gray-800 hover:text-blue-900 leading-snug line-clamp-2"
                        title={f.subject}
                      >
                        {f.subject}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>Notes: <strong>{f.notes.length}</strong></span>
                        <span>•</span>
                        <span>Linked PUC: <strong>{f.correspondenceReceiptIds.length}</strong></span>
                        <span>•</span>
                        <span>Section: <strong>{f.section}</strong></span>
                      </div>
                    </td>

                    {/* Opening Date */}
                    <td className="py-2.5 px-3 border-r border-gray-100 text-[11px] text-gray-600 font-mono">
                      {f.openingDate}
                    </td>

                    {/* Sent By / Desk */}
                    <td className="py-2.5 px-3 border-r border-gray-100 text-[11px]">
                      <span className="font-semibold text-gray-900 block truncate">{f.pendingWith}</span>
                      <span className="text-[10px] text-gray-500 block truncate">From: {f.sentBy}</span>
                    </td>

                    {/* Classification */}
                    <td className="py-2.5 px-2.5 text-center border-r border-gray-100">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          f.classification === 'Secret' || f.classification === 'Top Secret'
                            ? 'bg-red-100 text-red-800 font-bold'
                            : f.classification === 'Confidential'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {f.classification}
                      </span>
                    </td>

                    {/* Priority */}
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

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectFile(f)}
                        className="px-2 py-1 bg-[#0062b8] hover:bg-[#005199] text-white text-[11px] rounded font-semibold cursor-pointer shadow-xs"
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
                  <p className="font-semibold text-gray-700">No electronic files found matching criteria.</p>
                  <button
                    onClick={onCreateFile}
                    className="mt-2 text-blue-700 hover:underline font-bold text-xs"
                  >
                    + Create a new Electronic File
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="bg-[#f0f4f9] border-t border-gray-300 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 shrink-0">
        <div className="flex items-center gap-2">
          <span>Total Electronic Files: <strong className="text-gray-900 font-bold">{totalFiles}</strong></span>
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

        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <span className="mr-2 text-[11px]">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-gray-300 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-gray-300 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
