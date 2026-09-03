import React, { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { ActiveModule } from '../types';

interface ActionRibbonProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  activeSubView: string;
  onSelectSubView: (view: string) => void;
  onCreateReceipt: () => void;
  onCreateFile: () => void;
  onAdvanceSearch: () => void;
}

export const ActionRibbon: React.FC<ActionRibbonProps> = ({
  onToggleDrawer,
  isDrawerOpen,
  activeModule,
  onSelectModule,
  activeSubView,
  onSelectSubView,
  onCreateReceipt,
  onCreateFile,
  onAdvanceSearch,
}) => {
  const [createReceiptDropdown, setCreateReceiptDropdown] = useState(false);

  return (
    <div className="relative w-full bg-[#1c2229] border-b border-[#12161b] flex items-center select-none z-20 h-10 overflow-x-auto shadow-sm">
      {/* Leftmost: Hamburger menu icon button */}
      <button
        onClick={onToggleDrawer}
        title={isDrawerOpen ? "Collapse Sub-Menu" : "Expand Sub-Menu"}
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
        {/* ================= GROUP 1: RECEIPT ================= */}
        <div className="flex items-center h-8 rounded overflow-hidden shadow-sm shrink-0">
          {/* Tag label with angled right slant */}
          <div
            onClick={() => onSelectModule('receipt')}
            className={`h-full px-3.5 flex items-center font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
              activeModule === 'receipt'
                ? 'bg-[#374151] text-white border-b-2 border-blue-400'
                : 'bg-[#2d343e] text-gray-300 hover:text-white hover:bg-[#374151]'
            }`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)',
              paddingRight: '18px',
            }}
          >
            RECEIPT
          </div>

          {/* Action buttons connected to RECEIPT */}
          <div className="flex items-center h-full bg-[#1976d2] -ml-2">
            {/* Create ▸ with dropdown */}
            <div className="relative h-full">
              <button
                onClick={() => setCreateReceiptDropdown(!createReceiptDropdown)}
                className="h-full px-3 text-xs font-medium text-white hover:bg-[#1565c0] flex items-center gap-1 border-r border-[#1565c0] cursor-pointer transition-colors"
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
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">eFile</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreateReceiptDropdown(false);
                      onCreateReceipt();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-700 flex items-center justify-between"
                  >
                    <span>Physical (Tapal)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Paper</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inbox */}
            <button
              onClick={() => {
                onSelectModule('receipt');
                onSelectSubView('inbox');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors ${
                activeModule === 'receipt' && activeSubView === 'inbox'
                  ? 'bg-[#e2e8f0] text-gray-900 font-bold shadow-inner'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
            >
              Inbox
            </button>

            {/* Sent */}
            <button
              onClick={() => {
                onSelectModule('receipt');
                onSelectSubView('sent');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors ${
                activeModule === 'receipt' && activeSubView === 'sent'
                  ? 'bg-[#e2e8f0] text-gray-900 font-bold'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
            >
              Sent
            </button>

            {/* Advance Search */}
            <button
              onClick={onAdvanceSearch}
              className="h-full px-3 text-xs font-medium text-white hover:bg-[#1565c0] cursor-pointer transition-colors"
            >
              Advance Search
            </button>
          </div>
        </div>

        {/* ================= GROUP 2: FILE ================= */}
        <div className="flex items-center h-8 rounded overflow-hidden shadow-sm shrink-0">
          {/* Tag label */}
          <div
            onClick={() => onSelectModule('file')}
            className={`h-full px-3.5 flex items-center font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
              activeModule === 'file'
                ? 'bg-[#374151] text-white border-b-2 border-blue-400'
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
          <div className="flex items-center h-full bg-[#1976d2] -ml-2">
            <button
              onClick={onCreateFile}
              className="h-full px-3 text-xs font-medium text-white hover:bg-[#1565c0] border-r border-[#1565c0] cursor-pointer transition-colors"
            >
              Create
            </button>

            {/* In Screenshot 1, FILE -> Inbox is depicted in active silver gray */}
            <button
              onClick={() => {
                onSelectModule('file');
                onSelectSubView('inbox');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors ${
                activeModule === 'file' && activeSubView === 'inbox'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold shadow-inner'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
            >
              Inbox
            </button>

            <button
              onClick={() => {
                onSelectModule('file');
                onSelectSubView('sent');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors ${
                activeModule === 'file' && activeSubView === 'sent'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
            >
              Sent
            </button>

            <button
              onClick={onAdvanceSearch}
              className="h-full px-3 text-xs font-medium text-white hover:bg-[#1565c0] cursor-pointer transition-colors"
            >
              Advance Search
            </button>
          </div>
        </div>

        {/* ================= GROUP 3: ISSUE ================= */}
        <div className="flex items-center h-8 rounded overflow-hidden shadow-sm shrink-0">
          {/* Tag label */}
          <div
            onClick={() => onSelectModule('issue')}
            className={`h-full px-3.5 flex items-center font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${
              activeModule === 'issue'
                ? 'bg-[#374151] text-white border-b-2 border-blue-400'
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
          <div className="flex items-center h-full bg-[#1976d2] -ml-2">
            <button
              onClick={() => {
                onSelectModule('issue');
                onSelectSubView('sent');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors ${
                activeModule === 'issue' && activeSubView === 'sent'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
            >
              Sent
            </button>

            <button
              onClick={() => {
                onSelectModule('issue');
                onSelectSubView('returned');
              }}
              className={`h-full px-3 text-xs font-medium border-r border-[#1565c0] cursor-pointer transition-colors ${
                activeModule === 'issue' && activeSubView === 'returned'
                  ? 'bg-[#d6dbdf] text-gray-950 font-bold'
                  : 'text-white hover:bg-[#1565c0]'
              }`}
            >
              Returned
            </button>

            <button
              onClick={onAdvanceSearch}
              className="h-full px-3 text-xs font-medium text-white hover:bg-[#1565c0] cursor-pointer transition-colors"
            >
              Advance Search
            </button>
          </div>
        </div>
      </div>

      {/* Right Carousel Arrow */}
      <button
        title="Scroll Right"
        className="ml-auto h-10 px-2 bg-[#2a313b] hover:bg-[#353d49] text-gray-400 hover:text-white flex items-center justify-center border-l border-[#191e24] cursor-pointer shrink-0 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
