import React, { useState } from 'react';
import { X, FileText, Save, CheckCircle2, Bookmark, Send, Sparkles } from 'lucide-react';
import { EFileDraft } from '../types';

interface DfaComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileNumber: string;
  fileSubject: string;
  onSaveDraft: (draft: Partial<EFileDraft>) => void;
}

export const DfaComposerModal: React.FC<DfaComposerModalProps> = ({
  isOpen,
  onClose,
  fileNumber,
  fileSubject,
  onSaveDraft,
}) => {
  const [type, setType] = useState<EFileDraft['type']>('Office Memorandum (OM)');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [subject, setSubject] = useState(fileSubject ? `Regarding: ${fileSubject}` : 'Sanction of Funds & Administrative Concurrence');
  const [addressee, setAddressee] = useState('All Section Heads & Regional Offices');
  const [addressedToDesignation, setAddressedToDesignation] = useState('Joint Directors / Deputy Directors');
  const [addressedToOrg, setAddressedToOrg] = useState('Kerala State IT Mission (KSITM)');
  const [copyToText, setCopyToText] = useState('1. PS to Secretary (Electronics & IT Department)\n2. Director, KSITM\n3. Section Guard File');
  
  // Standard Government draft template texts
  const templates: Record<string, string> = {
    'Office Memorandum (OM)': `OFFICE MEMORANDUM\n\nSub: ${fileSubject || 'Administrative and Financial Guidelines for FY 2026'}\n\n1. The undersigned is directed to invite attention to Government Decision on the aforementioned subject and state that administrative approval is hereby conveyed for the execution of the subject proposal.\n\n2. The expenditure involved will be debited to the Major Head under Plan Funds.\n\n3. This issues with the concurrence of Finance Wing vide eFile No. ${fileNumber}.`,
    'Sanction Order': `ORDER\n\nSanction of the competent authority is hereby accorded for an amount of Rs. 4,50,000/- (Rupees Four Lakhs Fifty Thousand only) towards the procurement and implementation of the infrastructure upgrades.\n\n2. The amount is sanctioned subject to strict adherence to Kerala Financial Code (KFC) rules and GeM guidelines.\n\n3. The Section Officer (Finance) is authorized to draw and disburse the amount.`,
    'Letter': `To,\n${addressee},\n${addressedToDesignation},\n${addressedToOrg}\n\nSir,\n\nI am directed to convey the administrative concurrence of this Department regarding the proposal submitted under file ${fileNumber}.\n\nPlease furnish the progress report by 15th of next month.\n\nYours faithfully,\n(AUDITOR1)\nFor Director, KSITM`,
    'Office Order': `OFFICE ORDER\n\nConsequent upon administrative review, the committee constituted for statutory review shall convene on 10th of next month.\n\nAll members are requested to attend without fail.\n\nBy Order,\nDirector (Finance & Administration)`,
    'Circular': `CIRCULAR\n\nAll officers and dealing hands are hereby requested to process all receipts and noting strictly through eOffice 7.0 platform.\n\nPhysical movement of tapal is strictly prohibited except in statutory emergencies.`,
    'D.O. Letter': `D.O. Letter No: ${fileNumber}\n\nDear Colleague,\n\nI am writing this to request your personal attention to the pending audit compliance matter.\n\nEarly action is solicited.\n\nWith warm regards,\nYours sincerely,\n(MANOJ K. VARMA)`,
  };

  const [body, setBody] = useState(templates['Office Memorandum (OM)']);

  if (!isOpen) return null;

  const handleTypeChange = (newType: EFileDraft['type']) => {
    setType(newType);
    if (templates[newType]) {
      setBody(templates[newType]);
    }
  };

  const handleInsertTag = (tag: string) => {
    setBody((prev) => `${prev} ${tag}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      alert('Please provide Subject and Draft Body.');
      return;
    }

    const copyToArray = copyToText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveDraft({
      type,
      language,
      subject,
      addressee,
      addressedToDesignation,
      addressedToOrg,
      body,
      copyTo: copyToArray,
      status: 'DFA (Draft)',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#004e93] text-white px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold">eOffice 7.0 — Create Draft for Approval (DFA)</h2>
              <p className="text-[10px] text-blue-200">File: {fileNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
          {/* Nature & Language Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/70 p-2.5 rounded border border-blue-200">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Draft Nature (Communication Type) <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white font-semibold text-blue-950 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Office Memorandum (OM)">Office Memorandum (OM)</option>
                <option value="Sanction Order">Sanction Order</option>
                <option value="Letter">Official Letter</option>
                <option value="Office Order">Office Order</option>
                <option value="Circular">Circular</option>
                <option value="D.O. Letter">Demi-Official (D.O.) Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Draft Language</label>
              <div className="flex items-center gap-3 pt-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dfa-lang"
                    value="English"
                    checked={language === 'English'}
                    onChange={() => setLanguage('English')}
                  />
                  <span className="font-semibold text-gray-800">English</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dfa-lang"
                    value="Hindi"
                    checked={language === 'Hindi'}
                    onChange={() => setLanguage('Hindi')}
                  />
                  <span className="font-semibold text-gray-800">हिन्दी (Hindi)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Addressee Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Addressed To (Recipient) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={addressee}
                onChange={(e) => setAddressee(e.target.value)}
                placeholder="e.g. All Section Heads"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={addressedToDesignation}
                onChange={(e) => setAddressedToDesignation(e.target.value)}
                placeholder="e.g. Joint Directors"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Organization / Dept</label>
              <input
                type="text"
                value={addressedToOrg}
                onChange={(e) => setAddressedToOrg(e.target.value)}
                placeholder="e.g. Kerala State IT Mission"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Subject Line <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Sanction of matching funds for eGovernance audit..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Body Editor with Quick Tag Helpers */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-gray-700 font-semibold">
                Draft Body (Fair Copy Formulation) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-gray-500">Insert tag:</span>
                <button
                  type="button"
                  onClick={() => handleInsertTag(fileNumber)}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer font-mono"
                >
                  #FileNo#
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag(new Date().toLocaleDateString('en-GB'))}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer font-mono"
                >
                  #Date#
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('AUDITOR1')}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer font-mono"
                >
                  #Officer#
                </button>
              </div>
            </div>
            <textarea
              rows={8}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-gray-300 rounded p-2.5 text-xs font-serif leading-relaxed focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Copy To (Endorsements) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Copy Forwarded To (One per line):
            </label>
            <textarea
              rows={2}
              value={copyToText}
              onChange={(e) => setCopyToText(e.target.value)}
              placeholder="1. PS to Director&#10;2. Finance Section&#10;3. Guard File"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-[11px]"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-gray-500">
              Draft will be placed in the Draft (DFA) tab for officer review and digital signature.
            </span>
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
                <Save className="w-3.5 h-3.5" />
                <span>Save as DFA</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
