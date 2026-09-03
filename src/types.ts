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
  flag?: string; // e.g. "Flag 'A' (PUC)"
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
  language?: 'English' | 'Hindi';
  subject: string;
  addressee: string;
  addressedToDesignation: string;
  addressedToOrg: string;
  body: string;
  copyTo: string[];
  attachments?: string[];
  status: 'DFA (Draft)' | 'Approved' | 'Dispatched';
  createdDate: string;
  approvedBy?: string;
  signedWithDSC?: boolean;
  dispatchDetails?: {
    mode: 'Postal (Speed Post)' | 'Email' | 'Special Messenger' | 'eOffice NIC';
    dispatchNo: string;
    dispatchDate: string;
    trackingNo?: string;
  };
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
  queueStatus?: 'inbox' | 'sent' | 'parked' | 'closed' | 'part';
  isReadByRecipient?: boolean; // false enables Pull Back
  sentToOfficer?: string;
  sentDate?: string;
  parkDetails?: {
    parkedDate: string;
    parkDueDate: string;
    reason: string;
    remarks?: string;
  };
  isPartFile?: boolean;
  parentFileId?: string;
  parentFileNumber?: string;
  partName?: string;
  daysPending?: number;
  starred: boolean;
  dueDate?: string;
  notes: EFileNote[];
  yellowNotes?: EFileYellowNote[];
  correspondenceReceiptIds: string[]; // List of ReceiptRecord ids linked to this file
  drafts: EFileDraft[];
  movements: EFileMovement[];
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'docx' | 'odt' | 'pptx';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  flag?: string; // e.g. "Flag 'B'"
  description?: string;
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
  | 'kms'
  | 'eleave'
  | 'etour'
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
  | 'part_files'
  | 'draft_inbox'
  | 'draft_approved'
  | 'draft_dispatched'
  | 'all_circulars'
  | 'csmop_rules'
  | 'gfr_rules'
  | 'my_leaves'
  | 'apply_leave'
  | 'my_tours'
  | 'apply_tour'
  | 'kms_all'
  | 'kms_csmop'
  | 'kms_gfr'
  | 'kms_sops'
  | 'kms_space'
  | 'leave_my'
  | 'leave_apply'
  | 'leave_approvals'
  | 'leave_holidays'
  | 'tour_my'
  | 'tour_apply'
  | 'tour_sanctions'
  | 'tour_settlement';

export interface KmsDocument {
  id: string;
  title: string;
  category: 'CSMOP & Procedures' | 'GFR & Financial Rules' | 'CCS Conduct & Leave' | 'eOffice SOPs' | 'Space Policy & Acts' | 'Finance Dept Circulars';
  refNumber: string;
  date: string;
  issuedBy: string;
  summary: string;
  fileType: 'pdf' | 'odt' | 'docx';
  size: string;
  downloadUrl?: string;
  starred?: boolean;
  content?: string;
}

export interface LeaveApplication {
  id: string;
  applicationNo?: string;
  employeeName: string;
  designation: string;
  department: string;
  leaveType: 'Casual Leave (CL)' | 'Earned Leave (EL)' | 'Half Pay Leave (HPL)' | 'Commuted / Medical Leave' | 'Restricted Holiday (RH)';
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  stationLeaving: boolean;
  stationLeavingAddress?: string;
  contactNumber: string;
  appliedDate: string;
  status: 'Sanctioned' | 'Approved' | 'Under Review' | 'Recommended' | 'Rejected' | 'Cancelled';
  sanctionedBy?: string;
  remarks?: string;
  relievingOfficer?: string;
  prefixHolidays?: string;
  suffixHolidays?: string;
}

export interface TourApplication {
  id: string;
  proposalNo?: string;
  officerName: string;
  designation: string;
  department: string;
  tourNo: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  travelMode: 'Air (Economy)' | 'Train (AC 1st / 2nd)' | 'Official Vehicle' | 'State Road Transport';
  estimatedCost: number;
  advanceRequested: number;
  status: 'Approved' | 'Sanctioned' | 'Pending Sanction' | 'Settlement Submitted' | 'Completed' | 'Rejected';
  sanctionedDate?: string;
  officeOrderNo?: string;
  sanctionOrderNo?: string;
  approvingAuthority?: string;
  settlementDetails?: {
    airFare: number;
    dailyAllowance: number;
    hotelLodging: number;
    localConveyance: number;
    totalClaimed: number;
    advanceDeducted: number;
    netPayable: number;
    submissionDate: string;
    settledBy?: string;
  };
}

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
