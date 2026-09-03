import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  Send,
  X,
  ChevronRight,
  Filter,
  Check,
  XCircle,
} from 'lucide-react';
import { LeaveApplication } from '../types';

interface ELeaveWorkspaceProps {
  applications: LeaveApplication[];
  onApplyLeave: (newApp: Partial<LeaveApplication>) => void;
  onUpdateStatus?: (id: string, status: 'Sanctioned' | 'Rejected', remarks: string) => void;
}

export const ELeaveWorkspace: React.FC<ELeaveWorkspaceProps> = ({
  applications,
  onApplyLeave,
  onUpdateStatus,
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_leaves' | 'approvals'>('my_leaves');
  
  // Leave Form States
  const [leaveType, setLeaveType] = useState<LeaveApplication['leaveType']>('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('2026-09-10');
  const [toDate, setToDate] = useState('2026-09-11');
  const [totalDays, setTotalDays] = useState(2);
  const [reason, setReason] = useState('');
  const [stationLeaving, setStationLeaving] = useState(false);
  const [stationAddress, setStationAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('+91 94471 28941');

  // Balances
  const balances = {
    casualLeave: { available: 8, total: 12, unit: 'Days' },
    earnedLeave: { available: 28, total: 300, unit: 'Days' },
    halfPayLeave: { available: 20, total: 20, unit: 'Days' },
    restrictedHoliday: { available: 2, total: 2, unit: 'Days' },
  };

  const handleDatesChange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    const d1 = new Date(from);
    const d2 = new Date(to);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(Math.max(1, diffDays));
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please specify the reason for leave.');
      return;
    }

    onApplyLeave({
      employeeName: 'AUDITOR1 (Self)',
      designation: 'Auditor1, Finance & Statutory Verification',
      department: 'KSITM Finance Wing',
      leaveType,
      fromDate: fromDate.split('-').reverse().join('/'),
      toDate: toDate.split('-').reverse().join('/'),
      totalDays,
      reason,
      stationLeaving,
      stationLeavingAddress: stationLeaving ? stationAddress : undefined,
      contactNumber,
      appliedDate: new Date().toLocaleDateString('en-GB'),
      status: 'Under Review',
    });

    setIsApplyModalOpen(false);
    setReason('');
    setStationLeaving(false);
    setStationAddress('');
  };

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
              <h1 className="text-base font-bold tracking-tight">eLeave — Electronic Leave Management System</h1>
              <span className="text-[10px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                eOffice v7.2.0
              </span>
            </div>
            <p className="text-xs text-blue-100 opacity-90">
              Apply for leave, check credit balances, request station-leaving permissions, and manage reporting approvals.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Header Cards */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {/* Casual Leave */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded border border-blue-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-blue-900 font-semibold">
              <span>Casual Leave (CL)</span>
              <span className="text-[10px] bg-blue-200/80 text-blue-800 px-1.5 py-0.5 rounded font-mono">2026</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-900 font-mono">{balances.casualLeave.available}</span>
              <span className="text-xs text-blue-700">/ {balances.casualLeave.total} Days</span>
            </div>
            <p className="text-[10px] text-blue-600 mt-1">Lapses on 31 Dec 2026</p>
          </div>

          {/* Earned Leave */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 rounded border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold">
              <span>Earned Leave (EL)</span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Accumulated</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-900 font-mono">{balances.earnedLeave.available}</span>
              <span className="text-xs text-emerald-700">/ {balances.earnedLeave.total} Max</span>
            </div>
            <p className="text-[10px] text-emerald-600 mt-1">Carried forward annually</p>
          </div>

          {/* Half Pay Leave */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 rounded border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
              <span>Half Pay Leave (HPL)</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-800 px-1.5 py-0.5 rounded font-mono">Medical</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-900 font-mono">{balances.halfPayLeave.available}</span>
              <span className="text-xs text-amber-700">Days</span>
            </div>
            <p className="text-[10px] text-amber-600 mt-1">Commutable on medical grounds</p>
          </div>

          {/* Restricted Holiday */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded border border-purple-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-purple-900 font-semibold">
              <span>Restricted Holiday (RH)</span>
              <span className="text-[10px] bg-purple-200/80 text-purple-800 px-1.5 py-0.5 rounded font-mono">Optional</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-900 font-mono">{balances.restrictedHoliday.available}</span>
              <span className="text-xs text-purple-700">/ 2 Days</span>
            </div>
            <p className="text-[10px] text-purple-600 mt-1">As per Gazetted list</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white border-b border-gray-200 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('my_leaves')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my_leaves'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            My Leave Applications ({applications.filter(a => a.employeeName.includes('Self')).length})
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'approvals'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Department Leave Approvals ({applications.length})
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Leave Register & Application Lifecycle</span>
            <span className="text-gray-400 font-normal text-[11px]">Total: {applications.length} applications recorded</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200">
                <th className="px-3 py-2">Employee / Officer</th>
                <th className="px-3 py-2">Leave Nature</th>
                <th className="px-3 py-2">Period (From - To)</th>
                <th className="px-3 py-2 text-center">Days</th>
                <th className="px-3 py-2">Reason & Station Leaving</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-right">Sanction Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-gray-900">{app.employeeName}</div>
                    <div className="text-[10px] text-gray-500">{app.designation}</div>
                    <div className="text-[9px] text-gray-400 font-mono">Applied: {app.appliedDate}</div>
                  </td>

                  <td className="px-3 py-2.5 font-medium text-gray-800">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px]">
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
                      <div className="mt-0.5 text-[10px] text-blue-700 font-medium flex items-center gap-1">
                        <span>Station Out: {app.stationLeavingAddress}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Sanctioned'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-right text-[11px] text-gray-600">
                    {app.sanctionedBy ? (
                      <div>
                        <div className="font-semibold text-emerald-800">{app.sanctionedBy}</div>
                        <div className="text-[10px] text-gray-500 italic">{app.remarks}</div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            if (onUpdateStatus) {
                              onUpdateStatus(app.id, 'Sanctioned', 'Sanctioned by Competent Authority.');
                            }
                          }}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Sanction
                        </button>
                        <button
                          onClick={() => {
                            if (onUpdateStatus) {
                              onUpdateStatus(app.id, 'Rejected', 'Exigency of government service.');
                            }
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#0062b8] text-white px-4 py-3 flex items-center justify-between">
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

            <form onSubmit={handleSubmitApplication} className="p-5 space-y-4 text-xs text-gray-700">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Nature of Leave <span className="text-red-500">*</span>
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveApplication['leaveType'])}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL) - Balance: 8 Days</option>
                  <option value="Earned Leave (EL)">Earned Leave (EL) - Balance: 28 Days</option>
                  <option value="Half Pay Leave (HPL)">Half Pay Leave (HPL) - Medical</option>
                  <option value="Restricted Holiday (RH)">Restricted Holiday (RH) - Balance: 2 Days</option>
                  <option value="Commuted / Medical Leave">Commuted / Medical Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">From Date *</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => handleDatesChange(e.target.value, toDate)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">To Date *</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => handleDatesChange(fromDate, e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
              </div>

              <div className="p-2 bg-blue-50 rounded text-blue-900 font-medium">
                Total Days of Leave: <span className="font-bold text-sm font-mono">{totalDays} Day(s)</span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State clear domestic or medical reason as per Secretariat service rules..."
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stationLeaving}
                    onChange={(e) => setStationLeaving(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-bold text-gray-800">Permission to Leave Headquarters / Station</span>
                </label>

                {stationLeaving && (
                  <div className="space-y-2 pl-6 animate-fadeIn">
                    <input
                      type="text"
                      value={stationAddress}
                      onChange={(e) => setStationAddress(e.target.value)}
                      placeholder="Outstation contact address during leave period..."
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                      required={stationLeaving}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Mobile Contact during Leave</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                  required
                />
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
                  className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
