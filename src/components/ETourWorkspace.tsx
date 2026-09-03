import React, { useState } from 'react';
import {
  Navigation,
  Plus,
  Calendar,
  Clock,
  MapPin,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Download,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { TourApplication } from '../types';

interface ETourWorkspaceProps {
  tours: TourApplication[];
  onApplyTour: (newTour: Partial<TourApplication>) => void;
  onSanctionTour?: (id: string) => void;
}

export const ETourWorkspace: React.FC<ETourWorkspaceProps> = ({
  tours,
  onApplyTour,
  onSanctionTour,
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedTourForOrder, setSelectedTourForOrder] = useState<TourApplication | null>(null);

  // Form States
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('2026-09-20');
  const [endDate, setEndDate] = useState('2026-09-22');
  const [travelMode, setTravelMode] = useState<TourApplication['travelMode']>('Air (Economy)');
  const [estimatedCost, setEstimatedCost] = useState(25000);
  const [advanceRequested, setAdvanceRequested] = useState(18000);

  const handleSubmitTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !purpose.trim()) {
      alert('Please fill out destination and official purpose.');
      return;
    }

    const tourNumber = `TOUR/KSITM/2026/${Math.floor(100 + Math.random() * 900)}`;

    onApplyTour({
      officerName: 'AUDITOR1 (Self)',
      designation: 'Auditor1, Finance',
      department: 'KSITM Finance Wing',
      tourNo: tourNumber,
      destination,
      purpose,
      startDate: startDate.split('-').reverse().join('/'),
      endDate: endDate.split('-').reverse().join('/'),
      travelMode,
      estimatedCost: Number(estimatedCost),
      advanceRequested: Number(advanceRequested),
      status: 'Pending Sanction',
    });

    setIsApplyModalOpen(false);
    setDestination('');
    setPurpose('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] overflow-hidden select-none">
      {/* Top Banner */}
      <div className="bg-[#005ba8] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#004e90]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-md border border-white/20">
            <Navigation className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight">eTour — Official Travel & TA/DA Management</h1>
              <span className="text-[10px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                eOffice v7.2.0
              </span>
            </div>
            <p className="text-xs text-blue-100 opacity-90">
              Submit tour programs, request travel advances, generate formal tour sanction orders, and track TA/DA claims.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Tour Program</span>
        </button>
      </div>

      {/* Tour Register Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Official Tour Programs & Sanction Register</span>
            <span className="text-gray-400 font-normal text-[11px]">{tours.length} tours recorded</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200">
                <th className="px-3 py-2">Tour No. & Officer</th>
                <th className="px-3 py-2">Destination</th>
                <th className="px-3 py-2">Dates (From - To)</th>
                <th className="px-3 py-2">Travel Mode</th>
                <th className="px-3 py-2 text-right">Estimated Cost / Advance</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-[#0062b8] font-mono">{tour.tourNo}</div>
                    <div className="font-medium text-gray-900">{tour.officerName}</div>
                    <div className="text-[10px] text-gray-500">{tour.designation}</div>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{tour.destination}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{tour.purpose}</div>
                  </td>

                  <td className="px-3 py-2.5 text-gray-700 font-mono text-[11px]">
                    {tour.startDate} to {tour.endDate}
                  </td>

                  <td className="px-3 py-2.5 text-gray-700">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium">
                      {tour.travelMode}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-right font-mono">
                    <div className="font-bold text-gray-900">₹{tour.estimatedCost.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">Adv: ₹{tour.advanceRequested.toLocaleString()}</div>
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tour.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : tour.status === 'Pending Sanction'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {tour.status}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {tour.status === 'Approved' ? (
                        <button
                          onClick={() => setSelectedTourForOrder(tour)}
                          className="px-2 py-1 bg-white hover:bg-blue-50 text-[#0062b8] border border-blue-300 rounded text-[10px] font-bold cursor-pointer"
                        >
                          View Sanction Order
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onSanctionTour) onSanctionTour(tour.id);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Sanction Tour
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Tour Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#0062b8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Official Tour Proposal (eTour Portal)</h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitTour} className="p-5 space-y-4 text-xs text-gray-700">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Destination Station / City *</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. New Delhi / Hyderabad / Bengaluru..."
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Official Purpose of Tour *</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Specify official agenda, ministry meeting, or conference details..."
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tour Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tour End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Entitled Mode of Travel</label>
                <select
                  value={travelMode}
                  onChange={(e) => setTravelMode(e.target.value as TourApplication['travelMode'])}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                >
                  <option value="Air (Economy)">Air (Economy - Air India / GeM travel partner)</option>
                  <option value="Train (AC 1st / 2nd)">Train (AC 1st / 2nd Class)</option>
                  <option value="Official Vehicle">Official Department Vehicle</option>
                  <option value="State Road Transport">State Road Transport Corporation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Estimated Expenditure (₹)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Travel Advance Requested (₹)</label>
                  <input
                    type="number"
                    value={advanceRequested}
                    onChange={(e) => setAdvanceRequested(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
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
                  className="px-4 py-1.5 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Tour Program</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tour Sanction Order Modal */}
      {selectedTourForOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="bg-[#0062b8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Formal Tour Sanction Proceedings</h3>
              </div>
              <button
                onClick={() => setSelectedTourForOrder(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh] text-xs font-serif leading-relaxed text-gray-900">
              <div className="text-center border-b pb-3 border-gray-200 font-sans">
                <p className="font-bold text-sm uppercase">Proceedings of the Director, KSITM</p>
                <p className="text-[11px] text-gray-600">Kerala State IT Mission, Thiruvananthapuram</p>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">
                  {selectedTourForOrder.officeOrderNo || 'GO(Rt) No. 412/2026/ITD'} | Dated: {selectedTourForOrder.sanctionedDate || '01/09/2026'}
                </p>
              </div>

              <div className="my-4">
                <p>
                  <strong>Sub:</strong> KSITM - Administration - Deputation of Officer on Official Tour to {selectedTourForOrder.destination} - Sanctioned - Orders issued.
                </p>
                <p className="mt-2">
                  <strong>Read:</strong> Tour Program Proposal No. {selectedTourForOrder.tourNo} submitted by {selectedTourForOrder.officerName}.
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-3 my-3">
                <p className="font-bold font-sans uppercase text-[11px] text-[#0062b8]">ORDER:</p>
                <p className="mt-1">
                  Sanction is hereby accorded for the official tour program of <strong>{selectedTourForOrder.officerName}</strong>, {selectedTourForOrder.designation} to proceed to <strong>{selectedTourForOrder.destination}</strong> from <strong>{selectedTourForOrder.startDate}</strong> to <strong>{selectedTourForOrder.endDate}</strong> in connection with: <em>"{selectedTourForOrder.purpose}"</em>.
                </p>
                <p className="mt-2">
                  The officer is permitted to travel by <strong>{selectedTourForOrder.travelMode}</strong> as per entitlement. A travel advance of <strong>₹{selectedTourForOrder.advanceRequested.toLocaleString()}/-</strong> is sanctioned.
                </p>
              </div>

              <div className="mt-6 flex justify-between items-end pt-4 font-sans text-[11px]">
                <div>
                  <p className="text-gray-500 text-[10px]">Digitally verified by eTour Engine</p>
                  <p className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NIC Sub-CA Sanctioned</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">MANOJ K. VARMA</p>
                  <p className="text-gray-600 text-[10px]">Joint Director (Finance)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 px-4 py-2.5 border-t border-gray-200 flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  alert('Printing Tour Sanction Order...');
                }}
                className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded font-medium flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Order</span>
              </button>
              <button
                onClick={() => setSelectedTourForOrder(null)}
                className="px-3 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded font-bold cursor-pointer"
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
