import React, { useState } from 'react';
import { X, Bookmark, FileText, Check, Paperclip, ChevronRight, Layers } from 'lucide-react';
import { ReceiptRecord, EFileNote } from '../types';

interface ReferencingModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: ReceiptRecord[];
  notes: EFileNote[];
  onInsertReference: (refTag: string) => void;
}

export const ReferencingModal: React.FC<ReferencingModalProps> = ({
  isOpen,
  onClose,
  receipts,
  notes,
  onInsertReference,
}) => {
  const [refType, setRefType] = useState<'puc' | 'note' | 'annexure'>('puc');
  const [selectedFlag, setSelectedFlag] = useState("Flag 'A' (PUC)");
  const [selectedPage, setSelectedPage] = useState('1');
  const [selectedNoteNo, setSelectedNoteNo] = useState(notes.length > 0 ? notes[0].noteNumber.toString() : '1');
  const [selectedPara, setSelectedPara] = useState('Para 1');
  const [annexureTitle, setAnnexureTitle] = useState('Annexure I (Compliance Report)');

  if (!isOpen) return null;

  const handleInsert = () => {
    let tag = '';
    if (refType === 'puc') {
      tag = `[Ref: ${selectedFlag} - Page ${selectedPage}]`;
    } else if (refType === 'note') {
      tag = `[Ref: Note #${selectedNoteNo} (${selectedPara})]`;
    } else {
      tag = `[Ref: ${annexureTitle}]`;
    }

    onInsertReference(tag);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#004e93] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-300" />
            <h2 className="text-sm font-bold">eOffice 7.0 — Insert Document Reference & Flag</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          {/* Reference Category Selector */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded border border-gray-200">
            <button
              type="button"
              onClick={() => setRefType('puc')}
              className={`flex-1 py-1.5 rounded font-semibold text-center transition-colors cursor-pointer ${
                refType === 'puc' ? 'bg-white text-blue-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Correspondence / PUC
            </button>
            <button
              type="button"
              onClick={() => setRefType('note')}
              className={`flex-1 py-1.5 rounded font-semibold text-center transition-colors cursor-pointer ${
                refType === 'note' ? 'bg-white text-blue-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Previous Noting
            </button>
            <button
              type="button"
              onClick={() => setRefType('annexure')}
              className={`flex-1 py-1.5 rounded font-semibold text-center transition-colors cursor-pointer ${
                refType === 'annexure' ? 'bg-white text-blue-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3. Annexure
            </button>
          </div>

          {/* Type 1: Correspondence PUC Flags */}
          {refType === 'puc' && (
            <div className="space-y-3 bg-blue-50/60 p-3 rounded border border-blue-200">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Select Flagged Document:</label>
                <div className="space-y-1.5">
                  {[
                    { flag: "Flag 'A' (PUC)", desc: receipts[0]?.subject || 'Paper Under Consideration (Primary Receipt)' },
                    { flag: "Flag 'B' (Sanction)", desc: 'Prior Administrative Sanction Order & GO' },
                    { flag: "Flag 'C' (Audit Sheet)", desc: 'Internal Audit Observations & Vouchers' },
                  ].map((item) => (
                    <label
                      key={item.flag}
                      className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-colors ${
                        selectedFlag === item.flag
                          ? 'bg-white border-blue-600 text-blue-950 shadow-xs'
                          : 'bg-white/60 border-gray-200 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="flagChoice"
                        checked={selectedFlag === item.flag}
                        onChange={() => setSelectedFlag(item.flag)}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-bold text-blue-900">{item.flag}</span>
                        <p className="text-[11px] text-gray-600 truncate max-w-sm">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-semibold">Page Number:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 bg-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Type 2: Previous Notes */}
          {refType === 'note' && (
            <div className="space-y-3 bg-emerald-50/60 p-3 rounded border border-emerald-200">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Select Prior Note:</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {notes.map((n) => (
                    <label
                      key={n.id}
                      className={`flex items-start gap-2 p-2 rounded border cursor-pointer ${
                        selectedNoteNo === n.noteNumber.toString()
                          ? 'bg-white border-emerald-600 text-emerald-950 shadow-xs'
                          : 'bg-white/60 border-gray-200 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="noteChoice"
                        checked={selectedNoteNo === n.noteNumber.toString()}
                        onChange={() => setSelectedNoteNo(n.noteNumber.toString())}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-bold text-emerald-900">Note #{n.noteNumber}</span>
                        <span className="text-[10px] text-gray-500 ml-2">by {n.author}</span>
                        <p className="text-[11px] text-gray-600 line-clamp-1">{n.text}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-semibold">Paragraph:</label>
                <select
                  value={selectedPara}
                  onChange={(e) => setSelectedPara(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="Para 1">Para 1</option>
                  <option value="Para 2">Para 2</option>
                  <option value="Para 3">Para 3</option>
                  <option value="Concluding Para">Concluding Recommendation</option>
                </select>
              </div>
            </div>
          )}

          {/* Type 3: Annexures */}
          {refType === 'annexure' && (
            <div className="space-y-3 bg-amber-50/60 p-3 rounded border border-amber-200">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Annexure Title:</label>
                <input
                  type="text"
                  value={annexureTitle}
                  onChange={(e) => setAnnexureTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Inserts a formal cross-reference linking the paragraph to the attached schedule or annexure.
              </p>
            </div>
          )}

          {/* Live Preview Tag */}
          <div className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Tag to insert:</span>
            <span className="font-bold font-mono text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
              {refType === 'puc'
                ? `[Ref: ${selectedFlag} - Page ${selectedPage}]`
                : refType === 'note'
                ? `[Ref: Note #${selectedNoteNo} (${selectedPara})]`
                : `[Ref: ${annexureTitle}]`}
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Reference</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
