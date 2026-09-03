export type RecordType = 'E' | 'P'; // Electronic | Physical

export interface ReceiptRecord {
  id: string;
  receiptNo: number;
  type: RecordType;
  starred: boolean;
  subjectCode: string;
  subject: string;
  sender: string;
  senderDesignation: string;
  receivedDate: string;
  letterDate: string;
  category: string;
  priority: 'Normal' | 'Immediate' | 'Urgent';
  status: 'In Progress' | 'Under Review' | 'Forwarded' | 'Closed';
  pendingWith: string;
  pdfUrl?: string;
  fileNumber?: string;
  notes?: ReceiptNote[];
}

export interface ReceiptNote {
  id: string;
  author: string;
  designation: string;
  department: string;
  timestamp: string;
  text: string;
  isGreenNote?: boolean;
  signedBy?: string;
}

export interface EFileNote {
  id: string;
  noteNumber: number;
  author: string;
  designation: string;
  department: string;
  timestamp: string;
  text: string;
  isGreenNote: boolean;
  signedBy?: string;
  certDetails?: {
    cn: string;
    serial: string;
    issuer: string;
    validTo: string;
    hash: string;
  };
}

export interface EFileYellowNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface EFileDraft {
  id: string;
  draftNo: string;
  type: 'Letter' | 'Office Memorandum (OM)' | 'Office Order' | 'Circular' | 'Sanction Order' | 'D.O. Letter';
  subject: string;
  addressee: string;
  addressedToDesignation: string;
  addressedToOrg: string;
  body: string;
  copyTo: string[];
  status: 'DFA (Draft)' | 'Approved' | 'Dispatched';
  createdDate: string;
  approvedBy?: string;
  signedWithDSC?: boolean;
}

export interface EFileMovement {
  id: string;
  sentBy: string;
  sentTo: string;
  sentDate: string;
  receivedDate?: string;
  timeSpent: string;
  actionTaken: string;
  remarks: string;
}

export interface EFileRecord {
  id: string;
  fileNumber: string;
  nature: RecordType; // E or P
  subject: string;
  basicHead: string;
  primaryHead: string;
  secondaryHead?: string;
  tertiaryHead?: string;
  year: string;
  section: string;
  classification: 'Unclassified' | 'Confidential' | 'Secret' | 'Top Secret';
  priority: 'Normal' | 'Urgent' | 'Immediate';
  openingDate: string;
  sentBy: string;
  pendingWith: string;
  status: 'Active' | 'Under Review' | 'Forwarded' | 'Parked' | 'Closed';
  starred: boolean;
  dueDate?: string;
  notes: EFileNote[];
  yellowNotes?: EFileYellowNote[];
  correspondenceReceiptIds: string[]; // List of ReceiptRecord ids linked to this file
  drafts: EFileDraft[];
  movements: EFileMovement[];
}

export type ActiveModule =
  | 'receipt'
  | 'file'
  | 'issue'
  | 'draft'
  | 'dispatch'
  | 'notesheet'
  | 'migration'
  | 'dsc'
  | 'settings';

export type SubMenuOption =
  | 'browse_physical'
  | 'browse_electronic'
  | 'inbox'
  | 'created'
  | 'sent'
  | 'initiated_actions'
  | 'acknowledgement'
  | 'closed'
  | 'create_new_file'
  | 'parked_files'
  | 'completed_files'
  | 'draft_inbox'
  | 'draft_approved'
  | 'draft_dispatched';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'receipt' | 'file' | 'system' | 'dsc';
  receiptNo?: number;
  fileNumber?: string;
}
