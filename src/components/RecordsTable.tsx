import React, { useState } from 'react';
import { Star, FileText, Send, Paperclip, CheckSquare, Search, RefreshCw, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Download, ShieldCheck, Eye } from 'lucide-react';
import { ReceiptRecord, SubMenuOption } from '../types';

interface RecordsTableProps {
  records: ReceiptRecord[];
  onSelectRecord: (record: ReceiptRecord) => void;
  activeOption: SubMenuOption;
  onRefresh: () => void;
  onSendSelected: (ids: string[]) => void;
  onAttachToFile: (ids: string[]) => void;
  onToggleStar: (id: string) => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  onSelectRecord,
  activeOption,
  onRefresh,
  onSendSelected,
  onAttachToFile,
  onToggleStar,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'E' | 'P'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    if (typeFilter !== 'ALL' && rec.type !== typeFilter) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        rec.receiptNo.toString().includes(term) ||
        rec.subject.toLowerCase().includes(term) ||
        rec.sender.toLowerCase().includes(term) ||
        rec.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalRecords = 98; // Shown as in Screenshot 2: "Total Records: 98"
  const totalPages = Math.ceil(totalRecords / pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
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
        return 'Receipt Inbox';
      case 'created':
        return 'Created Receipts';
      case 'sent':
        return 'Sent Receipts';
      case 'initiated_actions':
        return 'Initiated Actions';
      case 'acknowledgement':
        return 'Acknowledgements';
      case 'closed':
        return 'Closed Receipts';
      case 'browse_electronic':
        return 'Electronic Diarisation';
      case 'browse_physical':
        return 'Physical Diarisation';
      default:
        return 'Receipts';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Operations & Action Toolbar */}
      <div className="bg-[#f4f6f9] border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onAttachToFile(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border font-medium transition-all ${
              selectedIds.length > 0
                ? 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300 shadow-xs cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            title="Put Receipt into File / Attach"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Put in File</span>
          </button>

          <button
            onClick={() => onSendSelected(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border font-medium transition-all ${
              selectedIds.length > 0
                ? 'bg-[#0062b8] hover:bg-[#005199] text-white border-[#005199] shadow-xs cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            title="Send / Forward to Officer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send / Forward</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-300 mx-0.5"></div>

          {/* Type Filter Pills */}
          <div className="flex items-center bg-gray-200/80 p-0.5 rounded border border-gray-300">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                typeFilter === 'ALL'
                  ? 'bg-white text-blue-800 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('E')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                typeFilter === 'E'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Electronic (E)
            </button>
            <button
              onClick={() => setTypeFilter('P')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                typeFilter === 'P'
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

        {/* Right Search Input & Context Badge */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Diary No, Subject, Sender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-64 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
            {getSubTitleText()}
          </span>
        </div>
      </div>

      {/* Main Data Grid / Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[#f0f3f8] border-b border-gray-300 text-gray-700 font-semibold sticky top-0 z-10 shadow-xs">
              <th className="w-8 py-2 px-2.5 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="w-8 py-2 px-1 text-center">
                <Star className="w-3.5 h-3.5 text-gray-400 mx-auto" />
              </th>
              <th className="w-10 py-2 px-1 text-center">Nature</th>
              <th className="w-16 py-2 px-2">Number</th>
              <th className="py-2 px-3">Subject</th>
              <th className="py-2 px-3 hidden md:table-cell">Sender / Department</th>
              <th className="py-2 px-2.5 w-32 hidden lg:table-cell">Received Date</th>
              <th className="py-2 px-2.5 w-24 hidden xl:table-cell">Priority</th>
              <th className="py-2 px-2.5 w-28 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((rec) => {
              const isSelected = selectedIds.includes(rec.id);

              return (
                <tr
                  key={rec.id}
                  className={`hover:bg-[#f2f7fd] transition-colors group ${
                    isSelected ? 'bg-blue-50/80' : ''
                  }`}
                >
                  {/* Checkbox (matches Screenshot 2) */}
                  <td className="py-2 px-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(rec.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>

                  {/* Star Favorite (matches Screenshot 2) */}
                  <td className="py-2 px-1 text-center">
                    <button
                      onClick={() => onToggleStar(rec.id)}
                      className="text-gray-400 hover:text-amber-500 cursor-pointer p-0.5 transition-colors"
                      title={rec.starred ? 'Starred' : 'Mark as Starred'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          rec.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Nature: 'E' or 'P' (matches Screenshot 2) */}
                  <td className="py-2 px-1 text-center font-medium">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        rec.type === 'E'
                          ? 'text-blue-700 bg-blue-50 border border-blue-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}
                      title={rec.type === 'E' ? 'Electronic Receipt' : 'Physical Tapal'}
                    >
                      {rec.type}
                    </span>
                  </td>

                  {/* Number (matches Screenshot 2: 610, 598, 597, 588, 574) */}
                  <td className="py-2 px-2 font-semibold text-gray-900">
                    {rec.receiptNo}
                  </td>

                  {/* Subject Line (matches Screenshot 2: blue hyperlink link) */}
                  <td className="py-2 px-3">
                    <button
                      onClick={() => onSelectRecord(rec)}
                      className="text-[#005ba8] hover:text-[#003f77] hover:underline font-medium text-left line-clamp-1 cursor-pointer"
                      title={rec.subject}
                    >
                      {rec.subject}
                    </button>
                    {rec.fileNumber && (
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="font-semibold text-gray-600">Attached File:</span>
                        <span className="text-gray-600 bg-gray-100 px-1 py-0.2 rounded border border-gray-200">
                          {rec.fileNumber}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Sender / Department */}
                  <td className="py-2 px-3 hidden md:table-cell">
                    <div className="text-gray-900 font-medium truncate max-w-[200px]">{rec.sender}</div>
                    <div className="text-gray-500 text-[10px] truncate max-w-[200px]">{rec.senderDesignation}</div>
                  </td>

                  {/* Received Date */}
                  <td className="py-2 px-2.5 text-gray-600 whitespace-nowrap hidden lg:table-cell text-[11px]">
                    {rec.receivedDate}
                  </td>

                  {/* Priority */}
                  <td className="py-2 px-2.5 hidden xl:table-cell">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        rec.priority === 'Immediate'
                          ? 'bg-red-100 text-red-800'
                          : rec.priority === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </td>

                  {/* Quick Action Icons */}
                  <td className="py-2 px-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onSelectRecord(rec)}
                        className="p-1 hover:bg-blue-100 rounded text-blue-700 transition-colors cursor-pointer"
                        title="Open in eOffice Viewer (Notesheet + Letter)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSendSelected([rec.id])}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                        title="Forward / Send"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-500">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-sm">No records found matching current criteria</p>
                  <p className="text-xs text-gray-400 mt-1">Try modifying your search or filter options</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Status Bar (matching Screenshot 2: "Total Records: 98") */}
      <div className="bg-[#f4f6f9] border-t border-gray-300 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700">
        {/* Exact phrase as in Screenshot 2 */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-xs">
            Total Records: {totalRecords}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, totalRecords)}
          </span>
        </div>

        {/* Pagination & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">Records per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded border ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 cursor-pointer'
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 font-medium text-gray-800">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1 rounded border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 cursor-pointer'
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
