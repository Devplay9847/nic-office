import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  User,
  MapPin,
  Phone,
  FileCheck,
  Send,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Award,
  FileText,
  CalendarDays,
  BadgeCheck,
  Check,
  Ban,
  Download,
} from 'lucide-react';
import { LeaveApplication, SubMenuOption } from '../types';

interface ELeaveWorkspaceProps {
  applications?: LeaveApplication[];
  leaveApplications?: LeaveApplication[];
  activeOption?: SubMenuOption;
  onSelectOption?: (option: SubMenuOption) => void;
  onApplyLeave: (newApp: LeaveApplication) => void;
  onApproveLeave?: (id: string, remarks?: string) => void;
  onRejectLeave?: (id: string, remarks?: string) => void;
  onUpdateStatus?: (id: string, status: 'Sanctioned' | 'Rejected', remarks: string) => void;
}

export const ELeaveWorkspace: React.FC<ELeaveWorkspaceProps> = ({
  applications: rawApplications,
  leaveApplications,
  activeOption,
  onApplyLeave,
  onApproveLeave,
  onRejectLeave,
  onUpdateStatus,
}) => {
  // Gracefully handle either prop name
  const applications = leaveApplications || rawApplications || [];

  const [activeTab, setActiveTab] = useState<'my_leaves' | 'approvals' | 'holidays'>('my_leaves');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<LeaveApplication | null>(null);

  // Form State for Apply Leave
  const [leaveType, setLeaveType] = useState<LeaveApplication['leaveType']>('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('2026-09-14');
  const [toDate, setToDate] = useState('2026-09-15');
  const [reason, setReason] = useState('');
  const [stationLeaving, setStationLeaving] = useState(false);
  const [stationAddress, setStationAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('+91 94280 15923');
  const [relievingOfficer, setRelievingOfficer] = useState('Smt. Priya Venkatesh, Joint Director (Technical)');

  // Sync with SubNavDrawer
  useEffect(() => {
    if (activeOption === 'leave_apply' || activeOption === 'apply_leave') {
      setIsApplyModalOpen(true);
    } else if (activeOption === 'leave_approvals') {
      setActiveTab('approvals');
    } else if (activeOption === 'leave_holidays') {
      setActiveTab('holidays');
    } else if (activeOption === 'leave_my' || activeOption === 'my_leaves') {
      setActiveTab('my_leaves');
    }
  }, [activeOption]);

  // Leave Balances for logged-in Officer (Dr. Rajesh Sharma)
  const [balances, setBalances] = useState({
    casualLeave: { available: 8, total: 12 },
    earnedLeave: { available: 28, total: 300 },
    halfPayLeave: { available: 20, total: 20 },
    restrictedHoliday: { available: 2, total: 2 },
    commutedMedical: { available: 10, total: 10 },
  });

  // Calculate days between fromDate and toDate
  const calculateDays = () => {
    try {
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDays();

    const newApp: LeaveApplication = {
      id: `lv-${Date.now()}`,
      applicationNo: `ELV/IN-SPACE/2026/${Math.floor(100 + Math.random() * 900)}`,
      employeeName: 'DR. RAJESH SHARMA (Self)',
      designation: 'Director (Authorisation) / Scientist G',
      department: 'Authorisation Wing, IN-SPACe Ahmedabad',
      leaveType,
      fromDate: new Date(fromDate).toLocaleDateString('en-GB'),
      toDate: new Date(toDate).toLocaleDateString('en-GB'),
      totalDays: days,
      reason: reason || 'Personal official requirement',
      stationLeaving,
      stationLeavingAddress: stationLeaving ? stationAddress : undefined,
      contactNumber,
      appliedDate: new Date().toLocaleDateString('en-GB'),
      status: 'Under Review',
      relievingOfficer,
    };

    onApplyLeave(newApp);

    // Deduct balance preview
    if (leaveType.includes('Casual')) {
      setBalances((prev) => ({
        ...prev,
        casualLeave: { ...prev.casualLeave, available: Math.max(0, prev.casualLeave.available - days) },
      }));
    } else if (leaveType.includes('Earned')) {
      setBalances((prev) => ({
        ...prev,
        earnedLeave: { ...prev.earnedLeave, available: Math.max(0, prev.earnedLeave.available - days) },
      }));
    }

    setIsApplyModalOpen(false);
    setReason('');
    setStationAddress('');
    setStationLeaving(false);
  };

  const handleApprove = (id: string) => {
    if (onApproveLeave) {
      onApproveLeave(id, 'Sanctioned with DSC authentication. Work arrangements accepted.');
    } else if (onUpdateStatus) {
      onUpdateStatus(id, 'Sanctioned', 'Sanctioned with DSC authentication. Work arrangements accepted.');
    }
  };

  const handleReject = (id: string) => {
    if (onRejectLeave) {
      onRejectLeave(id, 'Returned due to urgent launch-schedule exigency of service.');
    } else if (onUpdateStatus) {
      onUpdateStatus(id, 'Rejected', 'Returned due to urgent launch-schedule exigency of service.');
    }
  };

  const myLeaves = applications.filter((a) => a.employeeName.includes('Self') || a.employeeName.includes('RAJESH SHARMA'));
  const subordinateLeaves = applications.filter((a) => !a.employeeName.includes('Self') && !a.employeeName.includes('RAJESH SHARMA'));

  // Gazetted & Space Holidays Calendar 2026
  const gazettedHolidays = [
    { date: '26 Jan 2026', day: 'Monday', holiday: 'Republic Day', type: 'Gazetted National Holiday' },
    { date: '04 Mar 2026', day: 'Wednesday', holiday: 'Holi (Festival of Colours)', type: 'Gazetted Holiday' },
    { date: '03 Apr 2026', day: 'Friday', holiday: 'Good Friday', type: 'Gazetted Holiday' },
    { date: '14 Apr 2026', day: 'Tuesday', holiday: 'Dr. B.R. Ambedkar Jayanti', type: 'Gazetted Holiday' },
    { date: '15 Aug 2026', day: 'Saturday', holiday: 'Independence Day', type: 'Gazetted National Holiday' },
    { date: '23 Aug 2026', day: 'Sunday', holiday: 'National Space Day (Chandrayaan-3 Moon Landing)', type: 'Special Space Centre Observance' },
    { date: '02 Oct 2026', day: 'Friday', holiday: 'Mahatma Gandhi Jayanti', type: 'Gazetted National Holiday' },
    { date: '20 Oct 2026', day: 'Tuesday', holiday: 'Dussehra (Vijay Dashami)', type: 'Gazetted Holiday' },
    { date: '08 Nov 2026', day: 'Sunday', holiday: 'Diwali (Deepavali)', type: 'Gazetted Holiday' },
    { date: '25 Dec 2026', day: 'Friday', holiday: 'Christmas Day', type: 'Gazetted Holiday' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] overflow-hidden select-none">
      {/* Top Banner */}
      <div className="bg-[#005ba8] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#004e90]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-md border border-white/20">
            <Calendar className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight">eLeave — Electronic Leave Management Portal</h1>
              <span className="text-[10px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                eOffice v7.2.0
              </span>
              <span className="text-[10px] bg-blue-400/30 text-blue-100 px-2 py-0.5 rounded border border-blue-300/40">
                IN-SPACe Ahmedabad
              </span>
            </div>
            <p className="text-xs text-blue-100 opacity-90">
              CCS (Leave) Rules 1972 Compliant • Online Leave Sanction, Station Leaving Permission & Delegated File Custody.
            </p>
          </div>
        </div>

        {/* Action Button: Apply Leave */}
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Cards */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide flex items-center justify-between">
          <span>Leave Ledger Balance for: DR. RAJESH SHARMA, Director (Authorisation)</span>
          <span className="text-emerald-700 font-semibold font-mono">Leave Year: 2026</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Casual Leave */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 rounded border border-blue-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-blue-900 font-semibold">
              <span>Casual Leave (CL)</span>
              <span className="text-[9px] bg-blue-200/80 text-blue-800 px-1.5 py-0.5 rounded font-mono">Available</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-900 font-mono">{balances.casualLeave.available}</span>
              <span className="text-xs text-blue-700">/ {balances.casualLeave.total} Days</span>
            </div>
            <p className="text-[10px] text-blue-600 mt-0.5">Max 12 days / calendar yr</p>
          </div>

          {/* Earned Leave */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-2.5 rounded border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold">
              <span>Earned Leave (EL)</span>
              <span className="text-[9px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Accumulated</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-900 font-mono">{balances.earnedLeave.available}</span>
              <span className="text-xs text-emerald-700">/ {balances.earnedLeave.total} Max</span>
            </div>
            <p className="text-[10px] text-emerald-600 mt-0.5">Carried forward annually</p>
          </div>

          {/* Half Pay Leave */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-2.5 rounded border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
              <span>Half Pay Leave (HPL)</span>
              <span className="text-[9px] bg-amber-200/80 text-amber-800 px-1.5 py-0.5 rounded font-mono">Medical</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-900 font-mono">{balances.halfPayLeave.available}</span>
              <span className="text-xs text-amber-700">Days</span>
            </div>
            <p className="text-[10px] text-amber-600 mt-0.5">Commutable on medical</p>
          </div>

          {/* Restricted Holiday */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-2.5 rounded border border-purple-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-purple-900 font-semibold">
              <span>Restricted Holiday (RH)</span>
              <span className="text-[9px] bg-purple-200/80 text-purple-800 px-1.5 py-0.5 rounded font-mono">Optional</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-900 font-mono">{balances.restrictedHoliday.available}</span>
              <span className="text-xs text-purple-700">/ 2 Days</span>
            </div>
            <p className="text-[10px] text-purple-600 mt-0.5">From Gazetted list</p>
          </div>

          {/* Commuted Medical Leave */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-2.5 rounded border border-rose-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-rose-900 font-semibold">
              <span>Medical / Commuted</span>
              <span className="text-[9px] bg-rose-200/80 text-rose-800 px-1.5 py-0.5 rounded font-mono">Certified</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-900 font-mono">{balances.commutedMedical.available}</span>
              <span className="text-xs text-rose-700">Days</span>
            </div>
            <p className="text-[10px] text-rose-600 mt-0.5">With medical certificate</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-gray-200 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setActiveTab('my_leaves')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_leaves'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Leave Applications ({myLeaves.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Subordinate Approvals ({subordinateLeaves.length})</span>
            {subordinateLeaves.some((a) => a.status === 'Under Review') && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('holidays')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'holidays'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Gazetted Holidays 2026 ({gazettedHolidays.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'holidays' ? (
          <div className="max-w-4xl mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-[#005ba8] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-xs">Gazetted & Closed Space Center Holidays (Calendar Year 2026)</h3>
              </div>
              <span className="text-[11px] text-blue-100">DoPT & Department of Space OM</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
                  <th className="px-4 py-2">Holiday Date</th>
                  <th className="px-4 py-2">Day of Week</th>
                  <th className="px-4 py-2">Festival / Occasion</th>
                  <th className="px-4 py-2">Holiday Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gazettedHolidays.map((h, i) => (
                  <tr key={i} className="hover:bg-blue-50/50">
                    <td className="px-4 py-2.5 font-bold text-gray-900 font-mono">{h.date}</td>
                    <td className="px-4 py-2.5 text-gray-600">{h.day}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#0062b8]">{h.holiday}</td>
                    <td className="px-4 py-2.5 text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] border border-gray-200">
                        {h.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
              <span>
                {activeTab === 'my_leaves' ? 'My Official Leave Register' : 'Subordinate Officers Leave Approvals'}
              </span>
              <span className="text-gray-400 font-normal text-[11px]">
                Showing {activeTab === 'my_leaves' ? myLeaves.length : subordinateLeaves.length} applications
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200">
                  <th className="px-3 py-2">Application & Officer</th>
                  <th className="px-3 py-2">Leave Nature</th>
                  <th className="px-3 py-2">Period (From - To)</th>
                  <th className="px-3 py-2 text-center">Days</th>
                  <th className="px-3 py-2">Reason & Station Leaving</th>
                  <th className="px-3 py-2 text-center">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(activeTab === 'my_leaves' ? myLeaves : subordinateLeaves).map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="font-mono text-[10px] text-blue-700 font-bold">{app.applicationNo || app.id}</div>
                      <div className="font-bold text-gray-900 mt-0.5">{app.employeeName}</div>
                      <div className="text-[10px] text-gray-500">{app.designation}</div>
                      <div className="text-[9px] text-gray-400 font-mono">Applied: {app.appliedDate}</div>
                    </td>

                    <td className="px-3 py-2.5 font-medium text-gray-800">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] border border-gray-200 font-medium">
                        {app.leaveType}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-gray-700 font-mono text-[11px]">
                      {app.fromDate} to {app.toDate}
                    </td>

                    <td className="px-3 py-2.5 text-center font-bold text-gray-900 font-mono">
                      {app.totalDays}
                    </td>

                    <td className="px-3 py-2.5 max-w-xs">
                      <div className="text-gray-800 line-clamp-2">{app.reason}</div>
                      {app.stationLeaving && (
                        <div className="mt-1 text-[10px] text-blue-800 font-medium flex items-center gap-1 bg-blue-50 p-1 rounded border border-blue-100">
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">Out: {app.stationLeavingAddress}</span>
                        </div>
                      )}
                      {app.relievingOfficer && (
                        <div className="mt-0.5 text-[9px] text-gray-500 italic">
                          Charge handed to: {app.relievingOfficer}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Sanctioned' || app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-right text-[11px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAppForSlip(app)}
                          className="px-2 py-1 bg-white hover:bg-blue-50 text-[#0062b8] border border-blue-300 rounded text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          title="View formal Government Leave Slip"
                        >
                          View Slip
                        </button>

                        {/* Approval actions for subordinate leaves */}
                        {activeTab === 'approvals' && app.status === 'Under Review' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer shadow-xs flex items-center gap-1"
                              title="Sanction with DSC"
                            >
                              <Check className="w-3 h-3" />
                              <span>Sanction (DSC)</span>
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer shadow-xs"
                              title="Return / Reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#005ba8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Application for Leave (eLeave Portal)</h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="p-5 space-y-4 text-xs text-gray-700">
              {/* Applicant Info */}
              <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">DR. RAJESH SHARMA</div>
                  <div className="text-[11px] text-gray-600">Director (Authorisation) / Scientist G • IN-SPACe</div>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-[#0062b8] rounded text-[10px] font-bold font-mono">
                  EMP ID: 9487
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Nature / Type of Leave *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveApplication['leaveType'])}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL) [Available: {balances.casualLeave.available} days]</option>
                  <option value="Earned Leave (EL)">Earned Leave (EL) [Available: {balances.earnedLeave.available} days]</option>
                  <option value="Half Pay Leave (HPL)">Half Pay Leave (HPL) [Available: {balances.halfPayLeave.available} days]</option>
                  <option value="Commuted / Medical Leave">Commuted / Medical Leave [Available: {balances.commutedMedical.available} days]</option>
                  <option value="Restricted Holiday (RH)">Restricted Holiday (RH) [Available: {balances.restrictedHoliday.available} days]</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">From Date *</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">To Date *</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
              </div>

              <div className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Calculated Leave Duration:</span>
                <span className="font-bold text-blue-900 font-mono text-sm">{calculateDays()} Days</span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Reason for Leave *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Specify genuine domestic reason or medical grounds..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              {/* Station Leaving Permission */}
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stationLeaving}
                    onChange={(e) => setStationLeaving(e.target.checked)}
                    className="rounded text-[#0062b8]"
                  />
                  <span className="font-bold text-gray-800">Permission to Leave Headquarters / Station Required?</span>
                </label>

                {stationLeaving && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                        Address during Station Absence *
                      </label>
                      <input
                        type="text"
                        value={stationAddress}
                        onChange={(e) => setStationAddress(e.target.value)}
                        placeholder="House / Hotel address, City, State with PIN..."
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                        required={stationLeaving}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Emergency Contact Number</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Relieving Officer (Handover)</label>
                  <input
                    type="text"
                    value={relievingOfficer}
                    onChange={(e) => setRelievingOfficer(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formal Government Leave Slip Modal */}
      {selectedAppForSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
            <div className="bg-[#005ba8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Government of India — Official Leave Sanction Slip</h3>
              </div>
              <button
                onClick={() => setSelectedAppForSlip(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-serif text-gray-800">
              <div className="text-center border-b pb-3 border-gray-300">
                <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
                  Indian National Space Promotion and Authorisation Centre (IN-SPACe)
                </p>
                <p className="text-[11px] text-gray-600 font-sans">
                  Department of Space, Government of India • Headquarters Ahmedabad
                </p>
                <p className="font-bold text-xs text-[#0062b8] font-sans mt-1">
                  LEAVE SANCTION & STATION LEAVING ORDER
                </p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Application No: {selectedAppForSlip.applicationNo || selectedAppForSlip.id} • Date of Application: {selectedAppForSlip.appliedDate}
                </p>
              </div>

              <div className="space-y-2 leading-relaxed">
                <p>
                  1. Sanction of the Competent Authority is hereby conveyed for the grant of <strong>{selectedAppForSlip.totalDays} day(s)</strong> of <strong>{selectedAppForSlip.leaveType}</strong> to <strong>{selectedAppForSlip.employeeName}</strong>, {selectedAppForSlip.designation}, for the period from <strong>{selectedAppForSlip.fromDate}</strong> to <strong>{selectedAppForSlip.toDate}</strong> on grounds of: <em>&quot;{selectedAppForSlip.reason}&quot;</em>.
                </p>

                <p>
                  2. <strong>Station Leaving Permission:</strong> {selectedAppForSlip.stationLeaving ? (
                    <span>Station leaving permission is granted. Address during absence: <em>{selectedAppForSlip.stationLeavingAddress}</em>. Emergency contact: {selectedAppForSlip.contactNumber}.</span>
                  ) : (
                    <span>Officer will remain at Station Headquarters during the leave period.</span>
                  )}
                </p>

                {selectedAppForSlip.relievingOfficer && (
                  <p>
                    3. <strong>Charge Delegation:</strong> During the period of leave, statutory files and routine charge are delegated to <strong>{selectedAppForSlip.relievingOfficer}</strong>.
                  </p>
                )}

                <div className="bg-gray-50 p-3 rounded border border-gray-200 mt-3 font-sans text-[11px]">
                  <div className="font-bold text-gray-700 mb-1">Leave Account Verification Certificate:</div>
                  <p className="text-gray-600 text-[10px]">
                    Certified that the officer has sufficient leave balance standing to credit in the establishment service ledger as required under Rule 14 & 26 of CCS (Leave) Rules, 1972.
                  </p>
                </div>
              </div>

              {/* Digital Signature Watermark & Sanction Details */}
              <div className="border-t border-gray-300 pt-4 flex items-center justify-between font-sans">
                <div>
                  <div className="text-[10px] text-gray-500">Sanction Status:</div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    selectedAppForSlip.status === 'Sanctioned' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedAppForSlip.status}
                  </span>
                </div>

                <div className="text-right border border-emerald-500/40 bg-emerald-50/50 p-2.5 rounded">
                  <div className="flex items-center justify-end gap-1 text-emerald-800 font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digitally Authenticated in eOffice</span>
                  </div>
                  <div className="text-[10px] text-gray-700 font-bold mt-0.5">
                    {selectedAppForSlip.sanctionedBy || 'DR. PAWAN GOENKA, Chairman, IN-SPACe'}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    Signing Authority: Competent Administrative Head
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={() => {
                  alert(`Printing official leave slip for ${selectedAppForSlip.employeeName}`);
                }}
                className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Copy</span>
              </button>

              <button
                onClick={() => setSelectedAppForSlip(null)}
                className="px-4 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
