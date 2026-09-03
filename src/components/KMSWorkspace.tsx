import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  FileText,
  Download,
  ExternalLink,
  Copy,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  Clock,
  Printer,
  X,
  Star,
  Plus,
  Compass,
  Bookmark,
  Building,
  Check,
} from 'lucide-react';
import { KmsDocument, SubMenuOption } from '../types';

interface KMSWorkspaceProps {
  documents: KmsDocument[];
  activeOption?: SubMenuOption;
  onSelectOption?: (option: SubMenuOption) => void;
  onReferenceCopy?: (citation: string) => void;
  onOpenDocInViewer?: (doc: KmsDocument) => void;
  onAddDocument?: (newDoc: KmsDocument) => void;
  onToggleBookmark?: (id: string) => void;
}

export const KMSWorkspace: React.FC<KMSWorkspaceProps> = ({
  documents,
  activeOption,
  onReferenceCopy,
  onAddDocument,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<KmsDocument | null>(documents[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New circular form state
  const [newTitle, setNewTitle] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newCategory, setNewCategory] = useState<KmsDocument['category']>('Space Policy & Acts');
  const [newAuthority, setNewAuthority] = useState('IN-SPACe Directorate of Authorisation');
  const [newSummary, setNewSummary] = useState('');

  // Sync with SubNavDrawer active option if provided
  useEffect(() => {
    if (activeOption === 'kms_csmop') setSelectedCategory('CSMOP & Procedures');
    else if (activeOption === 'kms_gfr') setSelectedCategory('GFR & Financial Rules');
    else if (activeOption === 'kms_sops') setSelectedCategory('eOffice SOPs');
    else if (activeOption === 'kms_space') setSelectedCategory('Space Policy & Acts');
    else if (activeOption === 'kms_all') setSelectedCategory('ALL');
  }, [activeOption]);

  // Keep activeDoc valid if documents change
  useEffect(() => {
    if (!activeDoc && documents.length > 0) {
      setActiveDoc(documents[0]);
    }
  }, [documents, activeDoc]);

  const categories = [
    'ALL',
    'Space Policy & Acts',
    'CSMOP & Procedures',
    'GFR & Financial Rules',
    'CCS Conduct & Leave',
    'eOffice SOPs',
    'Finance Dept Circulars',
  ];

  const filteredDocs = documents.filter((doc) => {
    if (onlyBookmarks && !doc.starred) return false;
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        doc.title.toLowerCase().includes(term) ||
        doc.refNumber.toLowerCase().includes(term) ||
        doc.summary.toLowerCase().includes(term) ||
        doc.issuedBy.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleCopyCitation = (doc: KmsDocument) => {
    const citation = `[Ref: ${doc.refNumber} - "${doc.title}"]`;
    navigator.clipboard?.writeText(citation);
    setCopiedId(doc.id);
    if (onReferenceCopy) onReferenceCopy(citation);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRef.trim()) return;

    const newDoc: KmsDocument = {
      id: `kms-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      refNumber: newRef.trim(),
      date: new Date().toLocaleDateString('en-GB'),
      issuedBy: newAuthority.trim(),
      summary: newSummary.trim() || 'Official directive uploaded to KMS repository.',
      fileType: 'pdf',
      size: '1.5 MB',
      starred: true,
    };

    if (onAddDocument) {
      onAddDocument(newDoc);
    }
    setActiveDoc(newDoc);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewRef('');
    setNewSummary('');
  };

  const getDocSampleContent = (doc: KmsDocument) => {
    if (doc.id === 'kms-1') {
      return (
        <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
          <div className="text-center border-b pb-3 border-gray-200">
            <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
              Government of India
            </p>
            <p className="text-[11px] text-gray-600 font-sans">
              Ministry of Personnel, Public Grievances and Pensions
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Department of Administrative Reforms and Public Grievances (DARPG)
            </p>
            <p className="font-bold text-xs mt-1 text-[#0062b8] font-sans">
              CENTRAL SECRETARIAT MANUAL OF OFFICE PROCEDURE (CSMOP - 16TH EDITION)
            </p>
            <p className="text-[10px] text-gray-500 font-sans mt-0.5">
              Ref: DARPG-CSMOP-2024/V16 • Effective from 15 January 2024
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Chapter 7: Guidelines on Official Noting (Green Notes & Yellow Notes)
            </h4>
            <p>
              <strong>7.1. Nature of Noting:</strong> A note is written remarks recorded on a Paper Under Consideration (PUC) to facilitate its disposal. It should consist of a precise statement of facts, analysis of questions requiring decision, and specific recommendations on action to be taken.
            </p>
            <p className="mt-2">
              <strong>7.2. Yellow Note (Scratchpad Noting):</strong> A Yellow Note is recorded during preliminary deliberations or informal consultations before a decision is finalized. A Yellow Note does not form part of the permanent official record unless explicitly confirmed and converted to a permanent Green Note. Dealing hands may edit or discard yellow notes freely.
            </p>
            <p className="mt-2">
              <strong>7.3. Green Note (Permanent Official Record):</strong> Every green note shall be consecutively numbered in the notesheet, dated, and authenticated with the dealing hand&apos;s or officer&apos;s digital signature certificate (Class 3 DSC or eSign). Once signed, a Green Note cannot be edited or altered.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Chapter 8: Referencing and Flagging
            </h4>
            <p>
              <strong>8.1. Referencing:</strong> Quotations from previous notings, rules, or circulars must be cited explicitly with page number, paragraph, and file head identification.
            </p>
            <p className="mt-2">
              <strong>8.2. Alphabetical Flags:</strong> The primary communication under consideration shall be flagged as <em>Flag &apos;A&apos; (PUC)</em>. Annexures and supporting documents shall be flagged as <em>Flag &apos;B&apos;</em>, <em>Flag &apos;C&apos;</em>, etc.
            </p>
          </div>
        </div>
      );
    }

    if (doc.id === 'kms-2') {
      return (
        <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
          <div className="text-center border-b pb-3 border-gray-200">
            <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
              Indian National Space Promotion and Authorisation Centre (IN-SPACe)
            </p>
            <p className="text-[11px] text-gray-600 font-sans">
              Autonomous Nodal Agency under Department of Space, Government of India
            </p>
            <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">
              GUIDELINES FOR AUTHORISATION OF SPACE ACTIVITIES (GASA-2024)
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Ref: IN-SPACE/AUTH-POL/2024/GASA-01 • Indian Space Policy 2023 Implementation
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Chapter 2: Scope and Applicability of IN-SPACe Authorisations
            </h4>
            <p>
              <strong>2.1. Nodal Jurisdiction:</strong> IN-SPACe acts as a single-window autonomous agency to permit, authorize, and supervise space activities of Non-Government Entities (NGEs), including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 font-sans text-[11px]">
              <li>Establishment and operations of Space Objects (Satellites in LEO, MEO, GEO, and cislunar orbits).</li>
              <li>Launch of rockets and sub-orbital vehicles from Indian territory or outer continental shelves.</li>
              <li>Establishment and operations of Telemetry, Tracking & Command (TT&C) Ground Stations.</li>
              <li>Dissemination of Earth Observation high-resolution satellite imagery data under NDSAP norms.</li>
              <li>Communication transponder leasing and ITU radio-frequency coordination for NGSO constellations.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Chapter 4: Statutory Technical Safety and Security Audits
            </h4>
            <p>
              <strong>4.1. Clean-Room Pre-Integration Audits:</strong> Any commercial payload intended for launch from ISRO launch facilities (such as SDSC-SHAR Sriharikota) shall undergo mandatory static discharge, thermal vacuum, and RF EMI/EMC compliance audits conducted by the Authorisation Directorate.
            </p>
            <p className="mt-2">
              <strong>4.2. Orbital Debris Mitigation:</strong> Satellites operating in Low Earth Orbit (LEO) must comply with ISO 24113 standards ensuring safe de-orbiting or disposal within 25 years post-mission life.
            </p>
          </div>
        </div>
      );
    }

    if (doc.id === 'kms-3') {
      return (
        <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
          <div className="text-center border-b pb-3 border-gray-200">
            <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
              Ministry of Finance — Department of Expenditure
            </p>
            <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">
              GENERAL FINANCIAL RULES (GFR-2017 WITH AMENDMENTS 2026)
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Chapter 6: Procurement of Goods and Services in Scientific & Strategic Departments
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Rule 149: Government e-Marketplace (GeM) Mandate
            </h4>
            <p>
              The Procurement of common use Goods and Services by Ministries or Departments will be mandatory for Goods or Services available on GeM.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 font-sans text-[11px]">
              <li><strong>Up to Rs. 25,000/-:</strong> Through any available suppliers on GeM meeting quality, specification, and delivery requirements.</li>
              <li><strong>Rs. 25,000/- to Rs. 5,00,000/-:</strong> Through GeM seller having lowest price amongst at least three different manufacturers.</li>
              <li><strong>Above Rs. 5,00,000/-:</strong> Through online bidding or reverse auction on GeM portal.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Rule 166: Single Tender Enquiry on Proprietary Grounds (PAC)
            </h4>
            <p>
              Procurement from a single source may be resorted to only in cases of emergency or when a specific space telemetry component is manufactured by only one firm holding valid space-qualification certification. A Proprietary Article Certificate (PAC) signed by Scientist G / Division Head is mandatory.
            </p>
          </div>
        </div>
      );
    }

    if (doc.id === 'kms-4') {
      return (
        <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
          <div className="text-center border-b pb-3 border-gray-200">
            <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
              Department of Personnel & Training (DoPT) & Department of Space
            </p>
            <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">
              CENTRAL CIVIL SERVICES (LEAVE) RULES, 1972 & CLASSIFIED INSTALLATION CODES
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Rules on Casual Leave, Earned Leave, Station Leaving, and Handover Protocols
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Rule 11: Casual Leave (CL) & Half-Day Permissions
            </h4>
            <p>
              Casual Leave is not a recognized form of leave and government servants on CL are technically not treated as absent from duty. CL cannot be combined with any other regular leave (such as EL or HPL). Maximum 8 to 12 days per calendar year are credited.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Rule 26: Earned Leave (EL) Credit & Encashment
            </h4>
            <p>
              Government servants are credited with 15 days of EL on 1st January and 15 days on 1st July each calendar year. Maximum accumulation allowed is 300 days.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Station Leaving Permission & Security Clearance
            </h4>
            <p>
              Officers handling classified files, cryptographic keys, or launch-critical authorization portfolios must obtain prior written permission to leave headquarters / station, furnishing full residential address and 24/7 active mobile contact number during the leave period.
            </p>
          </div>
        </div>
      );
    }

    if (doc.id === 'kms-5') {
      return (
        <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
          <div className="text-center border-b pb-3 border-gray-200">
            <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
              National Informatics Centre (NIC) — eOffice Project Division
            </p>
            <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">
              eOFFICE 7.0 STANDARD OPERATING PROCEDURE (SOP) FOR DIGITAL SIGNATURES & DSC
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Ref: NIC-EOFFICE7-SOP-09 • SHA-256 PKI Crypto Token Operations
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Section 3: Class-3 USB Crypto Token Standards
            </h4>
            <p>
              All Green Notes and Drafts for Approval (DFA) sanctioned in eOffice 7.0 must be authenticated using FIPS 140-2 Level 3 certified USB cryptographic tokens (e.g. WatchData ProxKey, ePass 2003, SafeNet).
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 font-sans text-[11px]">
              <li>Digital signatures must be anchored to Root CCA India cert chain.</li>
              <li>Tokens are strictly non-transferable and personal to the credentialed officer.</li>
              <li>Signing applet utilizes SHA-256 RSA 2048-bit key hashing.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (doc.id === 'kms-6') {
      return (
        <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
          <div className="text-center border-b pb-3 border-gray-200">
            <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
              Department of Space — Internal Finance Division (IFD)
            </p>
            <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">
              DELEGATION OF FINANCIAL POWERS RULES (DFPR-2026) - IN-SPACe
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Ref: DOS/FIN-POW/2026/INSPACE-08 • Statutory Expenditure Limits
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Table of Financial Powers & Sanctioning Authorities
            </h4>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-gray-300 font-sans">
                <thead>
                  <tr className="bg-gray-100 font-semibold text-gray-800">
                    <th className="p-1.5 border">Competent Authority</th>
                    <th className="p-1.5 border">Procurement of Equipment</th>
                    <th className="p-1.5 border">Tour Program & Advances</th>
                    <th className="p-1.5 border">Technical Consultancy</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-1.5 border font-semibold">Chairman, IN-SPACe</td>
                    <td className="p-1.5 border">Up to Rs. 25 Crores</td>
                    <td className="p-1.5 border">Full Powers (International & Domestic)</td>
                    <td className="p-1.5 border">Up to Rs. 5 Crores</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 border font-semibold">Director (Authorisation)</td>
                    <td className="p-1.5 border">Up to Rs. 50 Lakhs</td>
                    <td className="p-1.5 border">Full Powers for Subordinate Officers</td>
                    <td className="p-1.5 border">Up to Rs. 20 Lakhs</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 border font-semibold">Joint Director / Scientist F</td>
                    <td className="p-1.5 border">Up to Rs. 5 Lakhs</td>
                    <td className="p-1.5 border">Domestic Travel Recommending Authority</td>
                    <td className="p-1.5 border">NIL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 text-xs text-gray-800 leading-relaxed font-serif">
        <div className="text-center border-b pb-3 border-gray-200">
          <p className="font-bold text-sm text-gray-900 uppercase font-sans">{doc.issuedBy}</p>
          <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">{doc.title}</p>
          <p className="text-[10px] text-gray-500 font-sans">Order Ref: {doc.refNumber} | Date: {doc.date}</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
            Executive Summary & Provisions
          </h4>
          <p>{doc.summary}</p>
          <p className="mt-3">
            In accordance with official administrative reforms and eOffice version 7 interoperability standards, all dealing officers are directed to strictly adhere to the guidelines herein. Any deviations shall be flagged to the competent reporting authority.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] overflow-hidden select-none">
      {/* Top Banner */}
      <div className="bg-[#005ba8] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#004e90]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-md border border-white/20">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight">KMS — Knowledge Management System</h1>
              <span className="text-[10px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                eOffice v7.2.0
              </span>
              <span className="text-[10px] bg-blue-400/30 text-blue-100 px-2 py-0.5 rounded border border-blue-300/40">
                IN-SPACe Central Repository
              </span>
            </div>
            <p className="text-xs text-blue-100 opacity-90">
              Official Space Policy Acts, CSMOP Secretariat Manuals, GFR-2017 Rules, and eOffice Standard Operating Procedures.
            </p>
          </div>
        </div>

        {/* Right Action Controls: Search + Add Circular */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Rules, GFR, CSMOP, Circulars..."
              className="w-full bg-white text-gray-800 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Circular / SOP</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer text-[11px] ${
                selectedCategory === cat
                  ? 'bg-[#0062b8] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Starred / Bookmarked Filter */}
        <button
          onClick={() => setOnlyBookmarks(!onlyBookmarks)}
          className={`px-3 py-1 rounded border text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            onlyBookmarks
              ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarks ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>Starred Circulars</span>
        </button>
      </div>

      {/* Main Dual Pane: Left Document List | Right Live Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Document List */}
        <div className="w-96 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Official Documents ({filteredDocs.length})</span>
            <span className="text-[10px] text-gray-400">Click to preview</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No circulars or rules found matching your filter criteria.
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`p-3 cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-blue-50/90 border-l-4 border-[#0062b8]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
                        {doc.refNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {doc.date}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleBookmark) onToggleBookmark(doc.id);
                          }}
                          className="text-gray-300 hover:text-amber-500 p-0.5 transition-colors cursor-pointer"
                          title={doc.starred ? 'Starred' : 'Add to Starred'}
                        >
                          <Star className={`w-3.5 h-3.5 ${doc.starred ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-xs text-gray-900 mt-1 line-clamp-2 leading-tight">
                      {doc.title}
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {doc.summary}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-gray-400 border-t border-gray-100">
                      <span className="text-[#0062b8] font-medium">{doc.category}</span>
                      <span className="uppercase font-mono font-semibold">{doc.fileType} • {doc.size}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Preview Pane */}
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
          {activeDoc ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Document Header */}
              <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-[#0062b8] font-bold text-[10px] rounded font-mono">
                      {activeDoc.refNumber}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Issued on {activeDoc.date}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200">
                      Active In-Force
                    </span>
                  </div>
                  <h2 className="font-bold text-sm text-gray-900 mt-1 leading-snug">
                    {activeDoc.title}
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    <span>Issuing Authority: {activeDoc.issuedBy}</span>
                  </p>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCitation(activeDoc)}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 text-[#0062b8] border border-blue-300 rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Copy reference citation formatted for eOffice notesheet"
                  >
                    {copiedId === activeDoc.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation for Note Sheet</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      alert(`Printing official copy of ${activeDoc.refNumber}`);
                    }}
                    className="p-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-xs cursor-pointer"
                    title="Print Document"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      alert(`Downloading official PDF: ${activeDoc.title} (${activeDoc.refNumber})`);
                    }}
                    className="px-3 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official PDF</span>
                  </button>
                </div>
              </div>

              {/* Document Reading View (Realistic official look) */}
              <div className="flex-1 overflow-y-auto p-6 flex justify-center">
                <div className="w-full max-w-3xl bg-white rounded shadow-sm border border-gray-200 p-8 min-h-[600px]">
                  {getDocSampleContent(activeDoc)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-xs">
              <BookOpen className="w-12 h-12 text-gray-300 mb-2" />
              <p>Select a document from the Knowledge Repository to preview.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload / Register New Circular Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#005ba8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Register Circular / SOP into KMS</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-5 space-y-4 text-xs text-gray-700">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Document / Circular Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operating Protocols for Private Ground Station TT&C..."
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Order / Ref Number *</label>
                  <input
                    type="text"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    placeholder="e.g. IN-SPACE/SOP/2026/012"
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Category Classification</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as KmsDocument['category'])}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                  >
                    <option value="Space Policy & Acts">Space Policy & Acts</option>
                    <option value="CSMOP & Procedures">CSMOP & Procedures</option>
                    <option value="GFR & Financial Rules">GFR & Financial Rules</option>
                    <option value="CCS Conduct & Leave">CCS Conduct & Leave</option>
                    <option value="eOffice SOPs">eOffice SOPs</option>
                    <option value="Finance Dept Circulars">Finance Dept Circulars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Issuing Authority / Wing</label>
                <input
                  type="text"
                  value={newAuthority}
                  onChange={(e) => setNewAuthority(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Executive Summary & Directives</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Outline the core rules, threshold limits, or procedures mandated by this order..."
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold cursor-pointer"
                >
                  Add to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
