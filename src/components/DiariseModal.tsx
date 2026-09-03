import React, { useState } from 'react';
import {
  X,
  Upload,
  Save,
  CheckCircle2,
  FileText,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Send,
  Copy,
  Printer,
  FileCheck,
} from 'lucide-react';
import { RecordType, ReceiptRecord } from '../types';
import { InspaceLogo } from './InspaceLogo';

interface DiariseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType: RecordType;
  onSave: (record: Partial<ReceiptRecord>, andSend?: boolean) => void;
}

export const DiariseModal: React.FC<DiariseModalProps> = ({
  isOpen,
  onClose,
  defaultType,
  onSave,
}) => {
  const [type, setType] = useState<RecordType>(defaultType);
  const [activeFormTab, setActiveFormTab] = useState<'diary' | 'contact' | 'subject'>('diary');

  // Diary Details
  const [deliveryMode, setDeliveryMode] = useState('Speed Post');
  const [modeNo, setModeNo] = useState('SP-KL-8839210IN');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);

  // Contact Details
  const [senderType, setSenderType] = useState('Central Govt / NGE Space Entity');
  const [senderName, setSenderName] = useState('Dr. S. K. Somnath');
  const [senderDesignation, setSenderDesignation] = useState('Chief Regulatory & Missions Lead');
  const [ministry, setMinistry] = useState('Department of Space (DOS)');
  const [organization, setOrganization] = useState('Indian National Space Promotion and Authorisation Centre (IN-SPACe)');
  const [address, setAddress] = useState('IN-SPACe Headquarters, Bopal, Ahmedabad - 380058');
  const [pincode, setPincode] = useState('380058');
  const [state, setState] = useState('Gujarat');
  const [email, setEmail] = useState('missions.auth@inspace.gov.in');
  const [mobile, setMobile] = useState('+91 79 2791 2000');

  // Category & Subject
  const [category, setCategory] = useState('Space Authorisation & Regulation');
  const [subCategory, setSubCategory] = useState('Non-Government Entity (NGE) Launch Clearance');
  const [subject, setSubject] = useState('Orbital Mission & Frequency Allocation Authorisation for Commercial Small-Sat Constellation');
  const [remarks, setRemarks] = useState('Scrutinised technical dossier, ground telemetry coordinates, and safety orbital clearance as per IN-SPACe Guidelines.');
  const [enclosures, setEnclosures] = useState('Annexure I (Mission Trajectory & Debris Plan), Annexure II (ITU Frequency Filing)');
  const [priority, setPriority] = useState<'Normal' | 'Immediate' | 'Urgent'>('Urgent');

  // Preview Controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = (andSend: boolean = false, andCopy: boolean = false) => {
    if (!subject.trim() || !senderName.trim()) {
      alert('Please fill in required fields (Sender Name and Subject).');
      return;
    }

    const newRecordNo = Math.floor(620 + Math.random() * 50);
    const code = `${type}${newRecordNo}/INSPACE/2026`;

    onSave(
      {
        receiptNo: newRecordNo,
        type,
        subjectCode: code,
        subject: `${code} - ${subject}`,
        sender: `${senderName} (${organization || ministry})`,
        senderDesignation: senderDesignation || 'Dealing Officer',
        receivedDate:
          new Date().toLocaleDateString('en-GB') +
          ' ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        letterDate: new Date(letterDate).toLocaleDateString('en-GB'),
        category,
        priority,
        status: 'In Progress',
        pendingWith: 'DIRECTOR_AUTH (Self)',
        flag: "Flag 'A' (PUC)",
        notes: remarks.trim()
          ? [
              {
                id: `n-${Date.now()}`,
                author: 'DR. RAJESH SHARMA',
                designation: 'Joint Director (Space Authorisation)',
                department: 'IN-SPACe',
                timestamp:
                  new Date().toLocaleDateString('en-GB') +
                  ' ' +
                  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: remarks.trim(),
                isGreenNote: true,
                signedBy: 'Digitally Signed by DR. RAJESH SHARMA (IN-SPACe NIC-CA IST)',
              },
            ]
          : [],
      },
      andSend
    );

    if (!andCopy) {
      onClose();
    } else {
      alert(`Receipt #${newRecordNo} generated! Contact details preserved for next entry.`);
      setSubject('');
      setRemarks('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-2 sm:p-4 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col h-[92vh]">
        {/* ================= Header ================= */}
        <div className="bg-[#004e93] text-white px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">
                  eOffice 7.0 - Browse & Diarise (DAK Entry)
                </span>
                <span className="bg-[#ff9900] text-black font-extrabold text-[10px] px-2 py-0.5 rounded font-mono">
                  {type === 'E' ? 'ELECTRONIC RECEIPT' : 'PHYSICAL TAPAL'}
                </span>
              </div>
              <p className="text-[10px] text-blue-200">
                National Informatics Centre • Central Diary Registration Module
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded text-white cursor-pointer transition-colors"
            title="Close Diarise Window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= Body: Split Screen (Left PDF Preview | Right Form) ================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT: Scanned Document / DAK Viewer */}
          <div className="w-full md:w-5/12 bg-gray-900 border-r border-gray-300 flex flex-col overflow-hidden">
            {/* Document Viewer Toolbar */}
            <div className="bg-gray-800 text-gray-200 px-3 py-1.5 flex items-center justify-between text-xs border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-gray-300">Page 1 / 1</span>
                <div className="h-3.5 w-[1px] bg-gray-600 mx-1"></div>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                  className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-gray-400 w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
                  className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white cursor-pointer ml-1"
                  title="Rotate 90 Degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <label className="bg-[#0062b8] hover:bg-blue-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Browse PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        alert(`Uploaded ${e.target.files[0].name} for electronic diarisation.`);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Document Canvas Preview */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#2d3748]">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease',
                }}
                className="bg-white text-gray-900 w-[420px] min-h-[580px] p-6 shadow-2xl rounded-sm border border-gray-300 text-[11px] flex flex-col justify-between font-serif relative"
              >
                {/* Government Watermark & Stamp */}
                <div className="absolute right-4 top-4 border-2 border-emerald-700 text-emerald-800 p-1.5 text-center text-[9px] font-mono uppercase font-bold rounded rotate-[-4deg] opacity-90">
                  <span>eOFFICE DAK VERIFIED</span>
                  <br />
                  <span>RECVD: {new Date().toLocaleDateString('en-GB')}</span>
                </div>

                {/* Letterhead */}
                <div>
                  <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
                    <div className="flex justify-center items-center mb-1">
                      <InspaceLogo className="h-8" showSubtext={false} />
                    </div>
                    <div className="font-bold text-[10px] tracking-widest text-gray-700 uppercase">
                      GOVERNMENT OF INDIA • DEPARTMENT OF SPACE
                    </div>
                    <div className="font-extrabold text-xs text-blue-950 mt-0.5">
                      INDIAN NATIONAL SPACE PROMOTION AND AUTHORISATION CENTRE (IN-SPACe)
                    </div>
                    <div className="text-[9px] text-gray-600">
                      IN-SPACe Headquarters, Bopal, Ahmedabad - 380058, Gujarat | Web: www.inspace.gov.in
                    </div>
                  </div>

                  {/* Letter meta */}
                  <div className="flex justify-between text-[10px] mb-3 text-gray-700 font-mono">
                    <span>No. IN-SPACe/AUTH/2026/MSN-04</span>
                    <span>Date: {letterDate}</span>
                  </div>

                  {/* Addressee */}
                  <div className="mb-3 space-y-0.5 text-[10px]">
                    <p className="font-bold">To,</p>
                    <p>The Joint Director (Space Authorisations & Promotion),</p>
                    <p>Indian National Space Promotion and Authorisation Centre (IN-SPACe),</p>
                    <p>Ahmedabad - 380058.</p>
                  </div>

                  {/* Subject */}
                  <div className="mb-3 bg-amber-50/70 p-2 border-l-2 border-amber-500 text-[10.5px]">
                    <span className="font-bold text-gray-900">Sub: </span>
                    <span className="text-gray-800 font-medium">
                      {subject || 'Application for Space Mission Authorisation & Ground Station Clearance'}
                    </span>
                  </div>

                  {/* Letter Body */}
                  <div className="space-y-2 text-[10.5px] leading-relaxed text-gray-800 text-justify">
                    <p>Sir,</p>
                    <p>
                      In compliance with the Indian Space Policy and IN-SPACe Regulatory Guidelines,
                      we hereby submit the comprehensive technical dossier, mission profile, and orbital safety
                      clearance documents for official authorisation by IN-SPACe.
                    </p>
                    <p>
                      The spectrum coordination documents and ground telemetry station parameters
                      have been appended as Annexures I and II for immediate perusal and
                      incorporation into the eFile notesheet.
                    </p>
                    <p>
                      Formal mission authorisation and clearance for utilizing designated launch facility
                      infrastructure may kindly be accorded at the earliest convenience.
                    </p>
                  </div>
                </div>

                {/* Signatory */}
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end text-[10px]">
                  <div>
                    <span className="text-[8px] font-mono text-gray-400">
                      BARCODE: *INSPACE-AUTH-781920*
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-950">Yours faithfully,</p>
                    <p className="font-bold text-gray-900 mt-2">({senderName})</p>
                    <p className="text-gray-600">{senderDesignation}</p>
                    <p className="text-gray-500 text-[9px]">{organization}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Structured Diarisation Form */}
          <div className="w-full md:w-7/12 bg-[#f8fafc] flex flex-col overflow-hidden">
            {/* Form Section Selector Tabs */}
            <div className="bg-[#e2e8f0] px-3 pt-2 border-b border-gray-300 flex items-center gap-1 shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setActiveFormTab('diary')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x ${
                  activeFormTab === 'diary'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-white shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                1. Diary Details
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('contact')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x ${
                  activeFormTab === 'contact'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-white shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                2. Contact Details
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('subject')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer border-t border-x ${
                  activeFormTab === 'subject'
                    ? 'bg-white text-blue-900 border-gray-300 border-b-white shadow-xs'
                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                3. Category & Subject
              </button>
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4 bg-white">
              {/* Receipt Nature Option Bar */}
              <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded border border-blue-200">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-950">Receipt Nature:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="modal-nature"
                      value="E"
                      checked={type === 'E'}
                      onChange={() => setType('E')}
                      className="text-blue-600"
                    />
                    <span className="font-semibold text-blue-900">Electronic (eFile)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="modal-nature"
                      value="P"
                      checked={type === 'P'}
                      onChange={() => setType('P')}
                      className="text-amber-600"
                    />
                    <span className="font-semibold text-amber-900">Physical (Tapal DAK)</span>
                  </label>
                </div>
                <span className="text-[11px] text-gray-500 font-mono">
                  Diary Year: <strong>2026</strong>
                </span>
              </div>

              {/* TAB 1: DIARY DETAILS */}
              {activeFormTab === 'diary' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Delivery Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={deliveryMode}
                        onChange={(e) => setDeliveryMode(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Speed Post">Speed Post (India Post)</option>
                        <option value="By Hand">By Hand / Special Messenger</option>
                        <option value="Registered Post">Registered Post (AD)</option>
                        <option value="Courier">Courier Service</option>
                        <option value="Email">Official Email (Govt NIC)</option>
                        <option value="Fax">Fax / Telex</option>
                        <option value="Electronic">eOffice Inter-Dept Portal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Mode / Consignment Number
                      </label>
                      <input
                        type="text"
                        value={modeNo}
                        onChange={(e) => setModeNo(e.target.value)}
                        placeholder="e.g. SP-KL-8839210IN"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Letter Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={letterDate}
                        onChange={(e) => setLetterDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Received Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={receivedDate}
                        onChange={(e) => setReceivedDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">हिन्दी (Hindi)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Priority</label>
                    <div className="flex items-center gap-4">
                      {(['Normal', 'Urgent', 'Immediate'] as const).map((p) => (
                        <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={p}
                            checked={priority === p}
                            onChange={() => setPriority(p)}
                          />
                          <span
                            className={`font-semibold ${
                              p === 'Immediate'
                                ? 'text-red-700'
                                : p === 'Urgent'
                                ? 'text-amber-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {p}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('contact')}
                      className="bg-[#0062b8] text-white px-3.5 py-1.5 rounded font-bold hover:bg-[#005199] cursor-pointer"
                    >
                      Next: Contact Details &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT DETAILS */}
              {activeFormTab === 'contact' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Sender Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={senderType}
                        onChange={(e) => setSenderType(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="State Govt">State Government Department</option>
                        <option value="Ministry">Central Ministry / Dept</option>
                        <option value="Attached Office">Attached / Subordinate Office</option>
                        <option value="VIP / MP / MLA">VIP / Minister / MP / MLA</option>
                        <option value="Autonomous Body">Autonomous Body / Commission</option>
                        <option value="PSU">Public Sector Undertaking (PSU)</option>
                        <option value="Citizen">Citizen / Grievance</option>
                        <option value="NGO">NGO / Private Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Sender Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Manoj K. Varma"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={senderDesignation}
                        onChange={(e) => setSenderDesignation(e.target.value)}
                        placeholder="e.g. Joint Director (Finance)"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Organization / Department
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Kerala State IT Mission (KSITM)"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Ministry / Apex Entity
                    </label>
                    <input
                      type="text"
                      value={ministry}
                      onChange={(e) => setMinistry(e.target.value)}
                      placeholder="e.g. Electronics & Information Technology Department"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Postal Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. ICT Complex, Vellayambalam, Thiruvananthapuram"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Pin Code</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Mobile</label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('diary')}
                      className="text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded cursor-pointer"
                    >
                      &larr; Back to Diary Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('subject')}
                      className="bg-[#0062b8] text-white px-3.5 py-1.5 rounded font-bold hover:bg-[#005199] cursor-pointer"
                    >
                      Next: Category & Subject &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CATEGORY & SUBJECT */}
              {activeFormTab === 'subject' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Main Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option>Finance & Accounts</option>
                        <option>Statutory Audit & Concurrence</option>
                        <option>Procurement & GeM</option>
                        <option>Establishment & Administration</option>
                        <option>IT & Infrastructure Projects</option>
                        <option>RTI & Public Grievance</option>
                        <option>General Correspondence</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Sub-Category
                      </label>
                      <input
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder="e.g. Statutory Audit Compliance"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-700 font-semibold">
                        Subject Line <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {subject.length} / 250 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={250}
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Statutory Audit Compliance Report for Financial Year 2025-26"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Enclosures / Annexures Description
                    </label>
                    <input
                      type="text"
                      value={enclosures}
                      onChange={(e) => setEnclosures(e.target.value)}
                      placeholder="e.g. Annexure I (Balance Sheet), Annexure II (Audit Observations)"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Initial Noting / Diarisation Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter dealing officer remarks or tagging notes..."
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ================= Authentic eOffice 7.0 Action Footer ================= */}
            <div className="p-3 bg-[#e9edf2] border-t border-gray-300 flex items-center justify-between flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded border border-gray-300 font-semibold cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Generate & Copy */}
                <button
                  type="button"
                  onClick={() => handleGenerate(false, true)}
                  title="Generate receipt and preserve sender details for next DAK"
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 rounded font-semibold flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-600" />
                  <span>Generate & Copy</span>
                </button>

                {/* Generate & Send */}
                <button
                  type="button"
                  onClick={() => handleGenerate(true, false)}
                  title="Generate receipt and immediately forward to officer"
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate & Send</span>
                </button>

                {/* Generate (Default) */}
                <button
                  type="button"
                  onClick={() => handleGenerate(false, false)}
                  title="Generate official eOffice Diary Number and save to Inbox"
                  className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold flex items-center gap-1.5 cursor-pointer text-xs shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Generate Diary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

