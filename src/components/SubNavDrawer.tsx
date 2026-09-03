import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, FileText, FolderPlus, Inbox, Send, Activity, CheckSquare, Archive } from 'lucide-react';
import { SubMenuOption, ActiveModule } from '../types';

interface SubNavDrawerProps {
  isOpen: boolean;
  activeModule: ActiveModule;
  activeOption: SubMenuOption;
  onSelectOption: (option: SubMenuOption) => void;
  inboxCount?: number;
  fileInboxCount?: number;
  onDiariseElectronic: () => void;
  onDiarisePhysical: () => void;
  onCreateNewFile?: () => void;
}

export const SubNavDrawer: React.FC<SubNavDrawerProps> = ({
  isOpen,
  activeModule,
  activeOption,
  onSelectOption,
  inboxCount = 98,
  fileInboxCount = 6,
  onDiariseElectronic,
  onDiarisePhysical,
  onCreateNewFile,
}) => {
  // Matching screenshot: "Browse & Diarise" / "Create New" is expanded by default
  const [browseExpanded, setBrowseExpanded] = useState(true);
  const [fileCreateExpanded, setFileCreateExpanded] = useState(true);
  const [inboxExpanded, setInboxExpanded] = useState(false);
  const [ackExpanded, setAckExpanded] = useState(false);
  const [closedExpanded, setClosedExpanded] = useState(false);

  if (!isOpen) {
    return null;
  }

  // Determine Title based on active module
  const getModuleTitle = () => {
    switch (activeModule) {
      case 'receipt':
        return 'Receipt';
      case 'file':
        return 'File Management';
      case 'draft':
        return 'Draft (DFA)';
      case 'dispatch':
        return 'Dispatch (Outbox)';
      case 'notesheet':
        return 'Notices & Circulars';
      case 'migration':
        return 'File Movement';
      case 'dsc':
        return 'DSC Token';
      default:
        return 'Receipt';
    }
  };

  return (
    <div className="w-56 shrink-0 bg-[#252f3f] text-gray-200 border-r border-[#1a212d] flex flex-col select-none text-xs shadow-lg z-10">
      {/* Drawer Header (Solid Royal Blue - as in Screenshot 2) */}
      <div className="h-10 bg-[#0062b8] text-white px-3 flex items-center justify-between font-semibold border-b border-[#005299] shadow-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-100" />
          <span className="text-sm font-semibold tracking-wide">{getModuleTitle()}</span>
        </div>
      </div>

      {/* Navigation Tree Items */}
      <div className="flex-1 overflow-y-auto py-1">
        {/* ================= FILE MODULE NAVIGATION ================= */}
        {activeModule === 'file' ? (
          <>
            {/* 1. Create New File (Collapsible) */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => setFileCreateExpanded(!fileCreateExpanded)}
                className="w-full px-3 py-2 text-left flex items-center justify-between text-gray-200 hover:bg-[#323d50] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Create New</span>
                </div>
                {fileCreateExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {fileCreateExpanded && (
                <div className="bg-[#1f2734] py-1 pl-6 pr-2 space-y-0.5 border-t border-[#293444]/60">
                  <button
                    onClick={() => {
                      onSelectOption('create_new_file');
                      if (onCreateNewFile) onCreateNewFile();
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-2 cursor-pointer transition-colors ${
                      activeOption === 'create_new_file'
                        ? 'bg-[#0062b8] text-white font-medium'
                        : 'text-gray-300 hover:text-white hover:bg-[#2b3546]'
                    }`}
                  >
                    <span className="text-emerald-400 font-bold text-xs">E</span>
                    <span>Electronic (eFile)</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectOption('create_new_file');
                      if (onCreateNewFile) onCreateNewFile();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-[#2b3546] transition-colors"
                  >
                    <span className="text-amber-400 font-bold text-xs">P</span>
                    <span>Physical File</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. File Inbox */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('inbox')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'inbox'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Inbox</span>
                  <span className="ml-1 text-[10px] bg-emerald-600/80 text-white px-1.5 py-0.2 rounded-full font-mono">
                    {fileInboxCount}
                  </span>
                </div>
              </button>
            </div>

            {/* 3. Created Files */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('created')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'created'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Created</span>
                </div>
              </button>
            </div>

            {/* 4. Sent Files */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('sent')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'sent'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Sent</span>
                </div>
              </button>
            </div>

            {/* 5. Parked Files */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('parked_files')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'parked_files'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Parked Files</span>
                </div>
              </button>
            </div>

            {/* 6. Completed / Closed Files */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('completed_files')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'completed_files'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Completed / Closed</span>
                </div>
              </button>
            </div>
          </>
        ) : (
          /* ================= RECEIPT MODULE NAVIGATION ================= */
          <>
            {/* 1. Browse & Diarise (Collapsible with ^ in Screenshot 2) */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => setBrowseExpanded(!browseExpanded)}
                className="w-full px-3 py-2 text-left flex items-center justify-between text-gray-200 hover:bg-[#323d50] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Browse & Diarise</span>
                </div>
                {browseExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {/* Sub-items: Physical & Electronic (as shown in Screenshot 2) */}
              {browseExpanded && (
                <div className="bg-[#1f2734] py-1 pl-6 pr-2 space-y-0.5 border-t border-[#293444]/60">
                  <button
                    onClick={() => {
                      onSelectOption('browse_physical');
                      onDiarisePhysical();
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-2 cursor-pointer transition-colors ${
                      activeOption === 'browse_physical'
                        ? 'bg-[#0062b8] text-white font-medium'
                        : 'text-gray-300 hover:text-white hover:bg-[#2b3546]'
                    }`}
                  >
                    <span className="text-gray-400 text-xs">›</span>
                    <span>Physical</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectOption('browse_electronic');
                      onDiariseElectronic();
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-2 cursor-pointer transition-colors ${
                      activeOption === 'browse_electronic'
                        ? 'bg-[#0062b8] text-white font-medium'
                        : 'text-gray-300 hover:text-white hover:bg-[#2b3546]'
                    }`}
                  >
                    <span className="text-gray-400 text-xs">›</span>
                    <span>Electronic</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Inbox (with chevron down v in Screenshot 2) */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => {
                  onSelectOption('inbox');
                  setInboxExpanded(!inboxExpanded);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'inbox'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Inbox</span>
                  <span className="ml-1 text-[10px] bg-blue-600/60 text-blue-100 px-1.5 py-0.2 rounded-full font-mono">
                    {inboxCount}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${inboxExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* 3. Created */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('created')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'created'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Created</span>
                </div>
              </button>
            </div>

            {/* 4. Sent */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('sent')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'sent'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Sent</span>
                </div>
              </button>
            </div>

            {/* 5. Initiated Actions */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => onSelectOption('initiated_actions')}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'initiated_actions'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Initiated Actions</span>
                </div>
              </button>
            </div>

            {/* 6. Acknowledgement */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => {
                  onSelectOption('acknowledgement');
                  setAckExpanded(!ackExpanded);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'acknowledgement'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Acknowledgement</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${ackExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* 7. Closed */}
            <div className="border-b border-[#303c4f]/40">
              <button
                onClick={() => {
                  onSelectOption('closed');
                  setClosedExpanded(!closedExpanded);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer group ${
                  activeOption === 'closed'
                    ? 'bg-[#313c4f] text-white font-semibold border-l-3 border-[#0099ff]'
                    : 'text-gray-200 hover:bg-[#323d50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play className="w-2.5 h-2.5 text-[#00b4d8] fill-current" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Closed</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${closedExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* SubNav Footer / Node Status */}
      <div className="p-2 bg-[#1b222d] border-t border-[#293444] text-[10px] text-gray-400 flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span>KSITM Local Node</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></span>
        </div>
        <span className="text-gray-500 truncate">IP: 10.162.24.110 (VPN-NIC)</span>
      </div>
    </div>
  );
};

