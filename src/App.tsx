import React, { useState } from 'react';
import { Header } from './components/Header';
import { ActionRibbon } from './components/ActionRibbon';
import { IconSidebar } from './components/IconSidebar';
import { SubNavDrawer } from './components/SubNavDrawer';
import { RecordsTable } from './components/RecordsTable';
import { FilesTable } from './components/FilesTable';
import { EFileWorkspace } from './components/EFileWorkspace';
import { CreateFileModal } from './components/CreateFileModal';
import { PutInFileModal } from './components/PutInFileModal';
import { FileViewerModal } from './components/FileViewerModal';
import { DiariseModal } from './components/DiariseModal';
import { AdvanceSearchModal } from './components/AdvanceSearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AnnouncementsModal } from './components/AnnouncementsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HelpModal } from './components/HelpModal';
import { SendModal } from './components/SendModal';
import { INITIAL_RECORDS, INITIAL_FILES, MOCK_NOTIFICATIONS } from './data/mockData';
import {
  ReceiptRecord,
  EFileRecord,
  ActiveModule,
  SubMenuOption,
  RecordType,
  NotificationItem,
  EFileNote,
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [activeModule, setActiveModule] = useState<ActiveModule>('file'); // Default to file per user instruction to focus on e-File
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Open by default as in Screenshot 2
  const [activeSubView, setActiveSubView] = useState('inbox');
  const [activeOption, setActiveOption] = useState<SubMenuOption>('inbox');
  const [activeLanguage, setActiveLanguage] = useState('en');

  // Data States
  const [records, setRecords] = useState<ReceiptRecord[]>(INITIAL_RECORDS);
  const [files, setFiles] = useState<EFileRecord[]>(INITIAL_FILES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [selectedRecord, setSelectedRecord] = useState<ReceiptRecord | null>(null);
  const [selectedFile, setSelectedFile] = useState<EFileRecord | null>(null);
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);
  const [isPutInFileModalOpen, setIsPutInFileModalOpen] = useState(false);
  const [receiptIdsForPutInFile, setReceiptIdsForPutInFile] = useState<string[]>([]);
  const [isDiariseModalOpen, setIsDiariseModalOpen] = useState(false);
  const [diariseDefaultType, setDiariseDefaultType] = useState<RecordType>('E');
  const [isAdvanceSearchModalOpen, setIsAdvanceSearchModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedIdsForSend, setSelectedIdsForSend] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Receipt Handlers
  const handleToggleStar = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    );
  };

  const handleCreateReceipt = (type: RecordType = 'E') => {
    setDiariseDefaultType(type);
    setIsDiariseModalOpen(true);
  };

  const handleSaveDiarisedRecord = (newRec: Partial<ReceiptRecord>) => {
    const fullRecord: ReceiptRecord = {
      id: `rec-${newRec.receiptNo}`,
      receiptNo: newRec.receiptNo || 615,
      type: newRec.type || 'E',
      starred: false,
      subjectCode: newRec.subjectCode || `A${newRec.receiptNo}/FIN/2026`,
      subject: newRec.subject || 'New Diarised Receipt',
      sender: newRec.sender || 'Department of IT',
      senderDesignation: newRec.senderDesignation || 'Officer',
      receivedDate: newRec.receivedDate || 'Today',
      letterDate: newRec.letterDate || 'Today',
      category: newRec.category || 'Finance',
      priority: newRec.priority || 'Normal',
      status: 'In Progress',
      pendingWith: 'AUDITOR1 (Self)',
      notes: newRec.notes || [],
    };

    setRecords((prev) => [fullRecord, ...prev]);
    showToast(`Receipt #${fullRecord.receiptNo} Diarised successfully in eOffice.`);
  };

  const handleAddNoteToRecord = (recordId: string, text: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'AUDITOR1',
      designation: 'Auditor1, Finance',
      department: 'KSITM',
      timestamp:
        new Date().toLocaleDateString('en-GB') +
        ' ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      isGreenNote: true,
      signedBy: 'Digitally Signed by AUDITOR1 (eSign NIC-CA)',
    };

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const updatedNotes = [...(r.notes || []), newNote];
          return { ...r, notes: updatedNotes };
        }
        return r;
      })
    );

    if (selectedRecord && selectedRecord.id === recordId) {
      setSelectedRecord((prev) =>
        prev ? { ...prev, notes: [...(prev.notes || []), newNote] } : null
      );
    }

    showToast('Green Note added and digitally signed on Notesheet.');
  };

  // eFile Handlers
  const handleToggleFileStar = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, starred: !f.starred } : f))
    );
  };

  const handleSaveNewFile = (newFileData: Partial<EFileRecord>) => {
    const fileId = `file-${Date.now()}`;
    const fullFile: EFileRecord = {
      id: fileId,
      fileNumber: newFileData.fileNumber || `eFile/KSITM/2026/GEN/${Math.floor(100 + Math.random() * 900)}`,
      nature: newFileData.nature || 'E',
      subject: newFileData.subject || 'Untitled Electronic File',
      basicHead: newFileData.basicHead || '22 - Finance & Accounts',
      primaryHead: newFileData.primaryHead || '03 - Statutory Audit',
      secondaryHead: newFileData.secondaryHead,
      tertiaryHead: newFileData.tertiaryHead,
      year: newFileData.year || '2026',
      section: newFileData.section || 'KSITM-FIN',
      classification: newFileData.classification || 'Confidential',
      priority: newFileData.priority || 'Normal',
      openingDate: newFileData.openingDate || new Date().toLocaleDateString('en-GB'),
      sentBy: 'AUDITOR1 (Self)',
      pendingWith: 'AUDITOR1 (Self)',
      status: 'Active',
      starred: false,
      notes: newFileData.notes || [],
      yellowNotes: newFileData.yellowNotes || [],
      correspondenceReceiptIds: newFileData.correspondenceReceiptIds || [],
      drafts: newFileData.drafts || [],
      movements: newFileData.movements || [],
    };

    setFiles((prev) => [fullFile, ...prev]);
    setSelectedFile(fullFile);
    showToast(`File ${fullFile.fileNumber} created and opened.`);
  };

  const handleAddGreenNoteToFile = (fileId: string, text: string) => {
    const targetFile = files.find((f) => f.id === fileId);
    const noteNumber = (targetFile?.notes.length || 0) + 1;
    const newNote: EFileNote = {
      id: `fn-${Date.now()}`,
      noteNumber,
      author: 'AUDITOR1',
      designation: 'Auditor1, Finance & Statutory Verification',
      department: 'KSITM',
      timestamp:
        new Date().toLocaleDateString('en-GB') +
        ' ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' IST',
      text,
      isGreenNote: true,
      signedBy: 'Digitally Signed by AUDITOR1 (NIC-CA IST)',
      certDetails: {
        cn: 'AUDITOR1 - KSITM',
        serial: '448123901F',
        issuer: 'NIC Sub-CA for Digital Signature 2024',
        validTo: '2027-11-14',
        hash: 'SHA256:7b10fa2e89cc4311029abce910',
      },
    };

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, notes: [...f.notes, newNote] } : f))
    );

    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile((prev) =>
        prev ? { ...prev, notes: [...prev.notes, newNote] } : null
      );
    }

    showToast(`Note #${noteNumber} stamped and signed on Green Notesheet.`);
  };

  const handleAddYellowNoteToFile = (fileId: string, text: string) => {
    const newYellowNote = {
      id: `yn-${Date.now()}`,
      author: 'AUDITOR1',
      timestamp:
        new Date().toLocaleDateString('en-GB') +
        ' ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' IST',
      text,
    };

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, yellowNotes: [...(f.yellowNotes || []), newYellowNote] }
          : f
      )
    );

    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile((prev) =>
        prev
          ? { ...prev, yellowNotes: [...(prev.yellowNotes || []), newYellowNote] }
          : null
      );
    }

    showToast('Yellow Note added to scratchpad.');
  };

  const handleConvertYellowToGreen = (fileId: string, yellowNoteId: string) => {
    const targetFile = files.find((f) => f.id === fileId);
    const yellowNote = targetFile?.yellowNotes?.find((yn) => yn.id === yellowNoteId);
    if (!yellowNote) return;

    // Add as green note
    handleAddGreenNoteToFile(fileId, yellowNote.text);
    // Delete yellow note
    handleDeleteYellowNote(fileId, yellowNoteId);
  };

  const handleDeleteYellowNote = (fileId: string, yellowNoteId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              yellowNotes: f.yellowNotes?.filter((yn) => yn.id !== yellowNoteId) || [],
            }
          : f
      )
    );

    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile((prev) =>
        prev
          ? {
              ...prev,
              yellowNotes:
                prev.yellowNotes?.filter((yn) => yn.id !== yellowNoteId) || [],
            }
          : null
      );
    }
    showToast('Yellow note removed.');
  };

  const handleApproveDraft = (fileId: string, draftId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              drafts: f.drafts.map((d) =>
                d.id === draftId
                  ? { ...d, status: 'Approved', approvedBy: 'MANOJ K. VARMA (JD FIN)' }
                  : d
              ),
            }
          : f
      )
    );

    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile((prev) =>
        prev
          ? {
              ...prev,
              drafts: prev.drafts.map((d) =>
                d.id === draftId
                  ? { ...d, status: 'Approved', approvedBy: 'MANOJ K. VARMA (JD FIN)' }
                  : d
              ),
            }
          : null
      );
    }

    showToast('Draft for Approval (DFA) approved successfully.');
  };

  const handleSignDraftWithDSC = (fileId: string, draftId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              drafts: f.drafts.map((d) =>
                d.id === draftId
                  ? { ...d, status: 'Dispatched', signedWithDSC: true }
                  : d
              ),
            }
          : f
      )
    );

    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile((prev) =>
        prev
          ? {
              ...prev,
              drafts: prev.drafts.map((d) =>
                d.id === draftId
                  ? { ...d, status: 'Dispatched', signedWithDSC: true }
                  : d
              ),
            }
          : null
      );
    }

    showToast('DFA signed with AUDITOR1 DSC Token and dispatched.');
  };

  const handleOpenPutInFileModal = (receiptIds: string[]) => {
    setReceiptIdsForPutInFile(receiptIds);
    setIsPutInFileModalOpen(true);
  };

  const handleConfirmPutInFile = (fileId: string, receiptIds: string[]) => {
    const targetFile = files.find((f) => f.id === fileId);
    if (!targetFile) return;

    // Link receipts to file
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              correspondenceReceiptIds: Array.from(
                new Set([...f.correspondenceReceiptIds, ...receiptIds])
              ),
            }
          : f
      )
    );

    // Update records with file number
    setRecords((prev) =>
      prev.map((r) =>
        receiptIds.includes(r.id) ? { ...r, fileNumber: targetFile.fileNumber } : r
      )
    );

    showToast(`Attached ${receiptIds.length} receipt(s) to ${targetFile.fileNumber}.`);
  };

  const handleCreateNewFileForReceipts = (receiptIds: string[]) => {
    setReceiptIdsForPutInFile(receiptIds);
    setIsCreateFileModalOpen(true);
  };

  const handleOpenSendModal = (ids: string[]) => {
    setSelectedIdsForSend(ids);
    setIsSendModalOpen(true);
  };

  const handleConfirmSend = (recipient: string, remarks: string, priority: string) => {
    if (activeModule === 'file') {
      setFiles((prev) =>
        prev.map((f) =>
          selectedIdsForSend.includes(f.id)
            ? {
                ...f,
                status: 'Forwarded',
                pendingWith: recipient,
                movements: [
                  ...f.movements,
                  {
                    id: `mov-${Date.now()}`,
                    sentBy: 'AUDITOR1',
                    sentTo: recipient,
                    sentDate:
                      new Date().toLocaleDateString('en-GB') +
                      ' ' +
                      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timeSpent: 'Pending',
                    actionTaken: 'Forwarded file',
                    remarks,
                  },
                ],
              }
            : f
        )
      );
      showToast(`Dispatched file(s) to ${recipient}.`);
    } else {
      setRecords((prev) =>
        prev.map((r) =>
          selectedIdsForSend.includes(r.id)
            ? { ...r, status: 'Forwarded', pendingWith: recipient }
            : r
        )
      );
      showToast(`Dispatched ${selectedIdsForSend.length} receipt(s) to ${recipient}.`);
    }
  };

  const handleAdvanceSearchFilter = (criteria: any) => {
    showToast(`Applied advance filter criteria across eOffice repository.`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read.');
  };

  const handleSelectReceiptFromNotif = (receiptNo: number) => {
    const target = records.find((r) => r.receiptNo === receiptNo);
    if (target) {
      setSelectedRecord(target);
    } else {
      showToast(`Opened receipt #${receiptNo}.`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#eef2f6] text-gray-800 font-sans">
      {/* 1. Header (Matching Screenshot 1 & 2) */}
      <Header
        onNotificationClick={() => setIsNotificationsModalOpen(true)}
        onHelpClick={() => setIsHelpModalOpen(true)}
        onProfileClick={() => setIsUserProfileModalOpen(true)}
        notificationCount={notifications.filter((n) => n.unread).length || 62}
        onAnnouncementsClick={() => setIsAnnouncementsModalOpen(true)}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
      />

      {/* 2. Action Ribbon (Matching Screenshot 1 & 2) */}
      <ActionRibbon
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          if (!isDrawerOpen) setIsDrawerOpen(true);
        }}
        activeSubView={activeSubView}
        onSelectSubView={setActiveSubView}
        onCreateReceipt={() => handleCreateReceipt('E')}
        onCreateFile={() => setIsCreateFileModalOpen(true)}
        onAdvanceSearch={() => setIsAdvanceSearchModalOpen(true)}
      />

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Icon Sidebar / Dock (Screenshot 2) */}
        <IconSidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            if (!isDrawerOpen) setIsDrawerOpen(true);
          }}
          receiptBadgeCount={12}
          onOpenSettings={() => setIsUserProfileModalOpen(true)}
          onOpenDSC={() => {
            setIsUserProfileModalOpen(true);
          }}
        />

        {/* Collapsible Secondary Sub-Navigation Drawer (Screenshot 2) */}
        <SubNavDrawer
          isOpen={isDrawerOpen}
          activeModule={activeModule}
          activeOption={activeOption}
          onSelectOption={setActiveOption}
          inboxCount={98}
          fileInboxCount={files.length}
          onDiariseElectronic={() => handleCreateReceipt('E')}
          onDiarisePhysical={() => handleCreateReceipt('P')}
          onCreateNewFile={() => setIsCreateFileModalOpen(true)}
        />

        {/* Main Content Area: eFile Grid or Receipt Grid */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden shadow-inner">
          {activeModule === 'file' ? (
            <FilesTable
              files={files}
              onSelectFile={(f) => setSelectedFile(f)}
              activeOption={activeOption}
              onCreateFile={() => setIsCreateFileModalOpen(true)}
              onSendFiles={(ids) => handleOpenSendModal(ids)}
              onToggleStar={handleToggleFileStar}
              onRefresh={() => showToast('Refreshed electronic files repository.')}
            />
          ) : (
            <RecordsTable
              records={records}
              onSelectRecord={setSelectedRecord}
              activeOption={activeOption}
              onRefresh={() => showToast('Refreshed eOffice records repository.')}
              onSendSelected={handleOpenSendModal}
              onAttachToFile={handleOpenPutInFileModal}
              onToggleStar={handleToggleStar}
            />
          )}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#1e293b] text-white px-4 py-2.5 rounded shadow-xl border border-gray-700 flex items-center gap-2 text-xs animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* 1. Full eOffice 7.0 eFile Workspace (Green Notesheet + Correspondence PUC + DFA) */}
      {selectedFile && (
        <EFileWorkspace
          file={selectedFile}
          receipts={records}
          onClose={() => setSelectedFile(null)}
          onSendFile={(id) => handleOpenSendModal([id])}
          onAddGreenNote={handleAddGreenNoteToFile}
          onAddYellowNote={handleAddYellowNoteToFile}
          onConvertYellowToGreen={handleConvertYellowToGreen}
          onDeleteYellowNote={handleDeleteYellowNote}
          onAttachMoreReceipts={(fileId) => {
            setReceiptIdsForPutInFile(records.map((r) => r.id));
            setIsPutInFileModalOpen(true);
          }}
          onApproveDraft={handleApproveDraft}
          onSignDraftWithDSC={handleSignDraftWithDSC}
        />
      )}

      {/* 2. Create New Electronic File Modal */}
      <CreateFileModal
        isOpen={isCreateFileModalOpen}
        onClose={() => setIsCreateFileModalOpen(false)}
        onSaveFile={handleSaveNewFile}
      />

      {/* 3. Put in File Modal */}
      <PutInFileModal
        isOpen={isPutInFileModalOpen}
        onClose={() => setIsPutInFileModalOpen(false)}
        selectedReceiptIds={receiptIdsForPutInFile}
        receipts={records}
        files={files}
        onConfirmPutInFile={handleConfirmPutInFile}
        onCreateNewFileForReceipts={handleCreateNewFileForReceipts}
      />

      {/* 4. Receipt File Viewer Modal */}
      {selectedRecord && (
        <FileViewerModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSend={(id) => handleOpenSendModal([id])}
          onAddNote={handleAddNoteToRecord}
        />
      )}

      {/* 5. Diarise Modal (Electronic / Physical) */}
      <DiariseModal
        isOpen={isDiariseModalOpen}
        onClose={() => setIsDiariseModalOpen(false)}
        defaultType={diariseDefaultType}
        onSave={handleSaveDiarisedRecord}
      />

      {/* 6. Advance Search Modal */}
      <AdvanceSearchModal
        isOpen={isAdvanceSearchModalOpen}
        onClose={() => setIsAdvanceSearchModalOpen(false)}
        onSearch={handleAdvanceSearchFilter}
      />

      {/* 7. Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectReceipt={handleSelectReceiptFromNotif}
      />

      {/* 8. Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsModalOpen}
        onClose={() => setIsAnnouncementsModalOpen(false)}
      />

      {/* 9. User Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />

      {/* 10. Help & Documentation Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* 11. Send / Forward Modal */}
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        selectedIds={selectedIdsForSend}
        onConfirmSend={handleConfirmSend}
      />
    </div>
  );
}

