import React, { useState } from 'react';
import { X, Search, Filter, Calendar, RotateCcw } from 'lucide-react';

interface AdvanceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: any) => void;
}

export const AdvanceSearchModal: React.FC<AdvanceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [diaryNo, setDiaryNo] = useState('');
  const [fileNo, setFileNo] = useState('');
  const [subject, setSubject] = useState('');
  const [nature, setNature] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sender, setSender] = useState('');

  if (!isOpen) return null;

  const handleReset = () => {
    setDiaryNo('');
    setFileNo('');
    setSubject('');
    setNature('ALL');
    setCategory('ALL');
    setFromDate('');
    setToDate('');
    setSender('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ diaryNo, fileNo, subject, nature, category, fromDate, toDate, sender });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <h2 className="text-sm font-bold">eOffice Advance Search</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Fields */}
        <form onSubmit={handleSearch} className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Diary / Receipt No.</label>
              <input
                type="text"
                value={diaryNo}
                onChange={(e) => setDiaryNo(e.target.value)}
                placeholder="e.g. 610, 598"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">File Number</label>
              <input
                type="text"
                value={fileNo}
                onChange={(e) => setFileNo(e.target.value)}
                placeholder="e.g. eFile/KSITM/2026/..."
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Subject Keyword</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Search words in subject or notesheet..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Receipt Nature</label>
              <select
                value={nature}
                onChange={(e) => setNature(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="ALL">All Natures (Electronic & Physical)</option>
                <option value="E">Electronic (E)</option>
                <option value="P">Physical (P)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Sender Name / Department</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Sender or Office"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
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
                <Search className="w-3.5 h-3.5" />
                <span>Search Records</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
