import React from 'react';
import { ActiveModule } from '../types';

interface IconSidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  receiptBadgeCount?: number;
  fileBadgeCount?: number;
  onOpenSettings: () => void;
  onOpenDSC: () => void;
}

export const IconSidebar: React.FC<IconSidebarProps> = ({
  activeModule,
  onSelectModule,
  receiptBadgeCount = 12,
  onOpenSettings,
  onOpenDSC,
}) => {
  return (
    <aside className="w-[52px] shrink-0 bg-[#005ba8] border-r border-[#004b8c] flex flex-col items-center py-1.5 select-none z-20 shadow-inner">
      {/* 1. RECEIPT ICON (R) with Orange Badge '12' */}
      <button
        onClick={() => onSelectModule('receipt')}
        title="Receipts & Diarisation (12 pending)"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'receipt'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        {/* Receipt Document Icon with 'R' */}
        <div className="relative w-6 h-6 border-2 border-white rounded-[2px] flex items-center justify-center bg-[#005ba8]">
          {/* Horizontal document lines */}
          <div className="absolute top-1 left-1 right-1 h-[1.5px] bg-white/70"></div>
          <div className="absolute top-2 left-1 right-1 h-[1.5px] bg-white/70"></div>
          {/* Bold R letter in bottom center */}
          <span className="font-bold text-[11px] text-white leading-none mt-1.5">R</span>
        </div>

        {/* Orange Notification Badge '12' as in Screenshot 2 */}
        {receiptBadgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#f05a28] text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-0.5 shadow border border-white">
            {receiptBadgeCount}
          </span>
        )}
      </button>

      {/* 2. FILE ICON (F) */}
      <button
        onClick={() => onSelectModule('file')}
        title="Files & e-Notesheets"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'file'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-7 h-6 flex items-center justify-center">
          {/* Folder base */}
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          </svg>
          {/* F stamp */}
          <span className="absolute text-[10px] font-bold text-white left-1.5 top-2.5">F</span>
          <div className="absolute right-1.5 top-2.5 flex flex-col gap-0.5">
            <span className="w-2.5 h-[1.5px] bg-white"></span>
            <span className="w-2 h-[1.5px] bg-white"></span>
          </div>
        </div>
      </button>

      {/* 3. DRAFT ICON (D) */}
      <button
        onClick={() => onSelectModule('draft')}
        title="Drafts & Approvals"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'draft'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <span className="font-bold text-[10px] text-white absolute -left-1 top-0">D</span>
          <svg className="w-5 h-5 text-white ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </button>

      {/* 4. DISPATCH / INBOX ICON (Envelope with down arrow) */}
      <button
        onClick={() => onSelectModule('dispatch')}
        title="Dispatch & Inward Letters"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'dispatch'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect width="20" height="15" x="2" y="4" rx="2" />
            <path d="m2 4 10 7 10-7" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pt-1">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* 5. NOTICE / NOTESHEET ICON (Envelope with 'N' tag) */}
      <button
        onClick={() => onSelectModule('notesheet')}
        title="Notices, Notesheets & Office Orders"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'notesheet'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect width="20" height="15" x="2" y="4" rx="2" />
            <path d="m2 4 10 7 10-7" />
          </svg>
          {/* 'N' tag on top right */}
          <div className="absolute -top-1.5 -right-1 bg-white text-[#005ba8] font-bold text-[9px] w-3.5 h-3.5 rounded flex items-center justify-center shadow-xs">
            N
          </div>
        </div>
      </button>

      {/* 6. MOVEMENT / MIGRATION ICON (Folder with arrow and 'M') */}
      <button
        onClick={() => onSelectModule('migration')}
        title="Movement & Migration Tracking"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'migration'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          </svg>
          {/* Curved arrow */}
          <svg className="w-3.5 h-3.5 text-white absolute left-0.5 bottom-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span className="font-bold text-[9px] text-white absolute right-1 bottom-1">M</span>
        </div>
      </button>

      {/* 7. KMS (Knowledge Management System) ICON */}
      <button
        onClick={() => onSelectModule('kms')}
        title="KMS — Knowledge Management System"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'kms'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 border-2 border-white rounded-[2px] flex items-center justify-center bg-[#005ba8]">
          <span className="font-bold text-[9px] text-amber-300 font-mono">KMS</span>
        </div>
      </button>

      {/* 8. eLeave ICON */}
      <button
        onClick={() => onSelectModule('eleave')}
        title="eLeave — Leave Management System"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'eleave'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 border-2 border-white rounded-[2px] flex flex-col items-center justify-center bg-[#005ba8]">
          <div className="w-full h-1 bg-amber-400"></div>
          <span className="font-bold text-[8px] text-white">LV</span>
        </div>
      </button>

      {/* 9. eTour ICON */}
      <button
        onClick={() => onSelectModule('etour')}
        title="eTour — Tour & Travel Management"
        className={`relative w-10 h-10 my-0.5 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'etour'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="relative w-6 h-6 border-2 border-white rounded-[2px] flex items-center justify-center bg-[#005ba8]">
          <span className="font-bold text-[8px] text-white font-mono">TOUR</span>
        </div>
      </button>

      {/* 10. DSC (Digital Signature Certificate) USB Token Icon */}
      <button
        onClick={onOpenDSC}
        title="Digital Signature Certificate (DSC) USB Token"
        className={`relative w-10 h-12 my-1 rounded flex items-center justify-center transition-all cursor-pointer ${
          activeModule === 'dsc'
            ? 'bg-[#004785] shadow-inner ring-1 ring-white/30 text-white'
            : 'text-white/90 hover:bg-[#004e90] hover:text-white'
        }`}
      >
        <div className="flex items-center gap-0.5">
          {/* USB Token Graphic */}
          <div className="flex flex-col items-center">
            {/* USB plug head */}
            <div className="w-2.5 h-1.5 border border-white bg-white/30 rounded-t-xs"></div>
            {/* USB body */}
            <div className="w-3.5 h-6 border border-white rounded-b-xs flex flex-col items-center justify-center bg-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          {/* Vertical 'DSC' text */}
          <div className="flex flex-col text-[8px] font-bold text-white leading-tight">
            <span>D</span>
            <span>S</span>
            <span>C</span>
          </div>
        </div>
      </button>

      {/* Divider */}
      <div className="w-6 h-[1px] bg-blue-300/30 my-auto"></div>

      {/* 8. SETTINGS GEAR ICON */}
      <button
        onClick={onOpenSettings}
        title="eOffice Preferences & Configuration"
        className="w-10 h-10 mt-auto mb-1 rounded flex items-center justify-center text-white/90 hover:bg-[#004e90] hover:text-white transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </aside>
  );
};
