import React, { useState } from 'react';
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
} from 'lucide-react';
import { KmsDocument } from '../types';

interface KMSWorkspaceProps {
  documents: KmsDocument[];
  onReferenceCopy?: (citation: string) => void;
  onOpenDocInViewer?: (doc: KmsDocument) => void;
}

export const KMSWorkspace: React.FC<KMSWorkspaceProps> = ({
  documents,
  onReferenceCopy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<KmsDocument | null>(documents[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'ALL',
    'CSMOP & Procedures',
    'GFR & Financial Rules',
    'CCS Conduct & Leave',
    'eOffice SOPs',
    'Finance Dept Circulars',
  ];

  const filteredDocs = documents.filter((doc) => {
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
              CENTRAL SECRETARIAT MANUAL OF OFFICE PROCEDURE (CSMOP)
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
              <strong>7.2. Yellow Note (Scratchpad Noting):</strong> A Yellow Note is recorded during preliminary deliberations or informal consultations before a decision is finalized. A Yellow Note does not form part of the permanent official record unless explicitly confirmed and converted to a permanent Green Note.
            </p>
            <p className="mt-2">
              <strong>7.3. Green Note (Permanent Official Record):</strong> Every green note shall be consecutively numbered in the notesheet, dated, and authenticated with the dealing hand's or officer's digital signature certificate (Class 3 DSC or eSign).
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
              <strong>8.2. Alphabetical Flags:</strong> The primary communication under consideration shall be flagged as <em>Flag 'A' (PUC)</em>. Annexures and supporting documents shall be flagged as <em>Flag 'B'</em>, <em>Flag 'C'</em>, etc.
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
              Ministry of Finance — Department of Expenditure
            </p>
            <p className="font-bold text-xs text-[#0062b8] font-sans mt-0.5">
              GENERAL FINANCIAL RULES (GFR-2017)
            </p>
            <p className="text-[10px] text-gray-500 font-sans">
              Chapter 6: Procurement of Goods and Services
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
              <li><strong>Up to Rs. 25,000/-:</strong> Through any available suppliers on GeM meeting quality and delivery requirements.</li>
              <li><strong>Rs. 25,000/- to Rs. 5,00,000/-:</strong> Through GeM seller having lowest price amongst at least three different manufacturers.</li>
              <li><strong>Above Rs. 5,00,000/-:</strong> Through online bidding or reverse auction on GeM portal.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 border-l-2 border-[#0062b8] pl-2 mb-1 font-sans">
              Rule 154: Purchase of goods without quotation
            </h4>
            <p>
              Purchase of goods up to the value of Rs. 25,000/- only on each occasion may be made without inviting quotations or bids on the basis of a certificate to be recorded by the competent authority.
            </p>
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
            </div>
            <p className="text-xs text-blue-100 opacity-90">
              Official Government Orders, CSMOP Secretariat Manuals, GFR-2017 Rules, and eOffice Standard Operating Procedures.
            </p>
          </div>
        </div>

        {/* Global Search inside KMS */}
        <div className="relative w-72">
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
      </div>

      {/* Category Pills Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
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
                No circulars or rules found matching your query.
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border-l-4 border-[#0062b8]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
                        {doc.refNumber}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {doc.date}
                      </span>
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
                  </div>
                  <h2 className="font-bold text-sm text-gray-900 mt-1 leading-snug">
                    {activeDoc.title}
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">Issuing Authority: {activeDoc.issuedBy}</p>
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
                <div className="w-full max-w-3xl bg-white rounded shadow border border-gray-200 p-8 min-h-[600px]">
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
    </div>
  );
};
