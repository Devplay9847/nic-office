import React, { useState, useEffect } from 'react';
import {
  Plane,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  FileText,
  MapPin,
  Calendar,
  IndianRupee,
  Receipt,
  Download,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  Building,
  CreditCard,
  Train,
  Car,
  User,
  Check,
} from 'lucide-react';
import { TourApplication, SubMenuOption } from '../types';

interface ETourWorkspaceProps {
  tours?: TourApplication[];
  tourApplications?: TourApplication[];
  activeOption?: SubMenuOption;
  onSelectOption?: (option: SubMenuOption) => void;
  onApplyTour: (newTour: TourApplication) => void;
  onSanctionTour?: (id: string) => void;
  onApproveTour?: (id: string) => void;
  onSubmitSettlement?: (id: string, settlement: NonNullable<TourApplication['settlementDetails']>) => void;
}

export const ETourWorkspace: React.FC<ETourWorkspaceProps> = ({
  tours: rawTours,
  tourApplications,
  activeOption,
  onApplyTour,
  onSanctionTour,
  onApproveTour,
  onSubmitSettlement,
}) => {
  // Gracefully handle either prop name
  const tours = tourApplications || rawTours || [];

  const [activeTab, setActiveTab] = useState<'my_tours' | 'subordinate' | 'sanctions' | 'settlement'>('my_tours');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedTourForOrder, setSelectedTourForOrder] = useState<TourApplication | null>(null);
  const [settlementTour, setSettlementTour] = useState<TourApplication | null>(null);

  // Form State for Apply Tour
  const [destination, setDestination] = useState('Satish Dhawan Space Centre (SDSC-SHAR), Sriharikota, Andhra Pradesh');
  const [purpose, setPurpose] = useState('On-site statutory safety audit, telemetry flight readiness review, and payload integration verification for Private Launch Vehicle PSLV-C62 commercial mission.');
  const [startDate, setStartDate] = useState('2026-09-18');
  const [endDate, setEndDate] = useState('2026-09-21');
  const [travelMode, setTravelMode] = useState<TourApplication['travelMode']>('Air (Economy)');
  const [estimatedCost, setEstimatedCost] = useState(38500);
  const [advanceRequested, setAdvanceRequested] = useState(30000);

  // Settlement Form State
  const [airFare, setAirFare] = useState<number>(18500);
  const [dailyAllowance, setDailyAllowance] = useState<number>(4500);
  const [hotelLodging, setHotelLodging] = useState<number>(8200);
  const [localConveyance, setLocalConveyance] = useState<number>(2400);

  // Sync with SubNavDrawer
  useEffect(() => {
    if (activeOption === 'tour_apply' || activeOption === 'apply_tour') {
      setIsApplyModalOpen(true);
    } else if (activeOption === 'tour_sanctions') {
      setActiveTab('sanctions');
    } else if (activeOption === 'tour_settlement') {
      setActiveTab('settlement');
    } else if (activeOption === 'tour_my' || activeOption === 'my_tours') {
      setActiveTab('my_tours');
    }
  }, [activeOption]);

  const handleSubmitTour = (e: React.FormEvent) => {
    e.preventDefault();
    const proposalNumber = `TOUR/IN-SPACE/2026/${Math.floor(100 + Math.random() * 900)}`;

    const newTour: TourApplication = {
      id: `tour-${Date.now()}`,
      proposalNo: proposalNumber,
      officerName: 'DR. RAJESH SHARMA (Self)',
      designation: 'Director (Authorisation) / Scientist G',
      department: 'Authorisation Wing, IN-SPACe Ahmedabad',
      tourNo: proposalNumber,
      destination,
      purpose,
      startDate: new Date(startDate).toLocaleDateString('en-GB'),
      endDate: new Date(endDate).toLocaleDateString('en-GB'),
      travelMode,
      estimatedCost: Number(estimatedCost),
      advanceRequested: Number(advanceRequested),
      status: 'Pending Sanction',
      approvingAuthority: 'DR. PAWAN GOENKA (Chairman, IN-SPACe)',
    };

    onApplyTour(newTour);
    setIsApplyModalOpen(false);
  };

  const handleSanction = (id: string) => {
    if (onApproveTour) onApproveTour(id);
    else if (onSanctionTour) onSanctionTour(id);
  };

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlementTour) return;

    const totalClaimed = airFare + dailyAllowance + hotelLodging + localConveyance;
    const netPayable = totalClaimed - settlementTour.advanceRequested;

    const settlementDetails = {
      airFare,
      dailyAllowance,
      hotelLodging,
      localConveyance,
      totalClaimed,
      advanceDeducted: settlementTour.advanceRequested,
      netPayable,
      submissionDate: new Date().toLocaleDateString('en-GB'),
      settledBy: 'Finance & Accounts Officer, IN-SPACe',
    };

    if (onSubmitSettlement) {
      onSubmitSettlement(settlementTour.id, settlementDetails);
    }
    setSettlementTour(null);
  };

  const myTours = tours.filter((t) => t.officerName.includes('Self') || t.officerName.includes('RAJESH SHARMA'));
  const subordinateTours = tours.filter((t) => !t.officerName.includes('Self') && !t.officerName.includes('RAJESH SHARMA'));
  const sanctionedTours = tours.filter((t) => t.status === 'Approved' || t.status === 'Sanctioned' || t.status === 'Settlement Submitted');

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] overflow-hidden select-none">
      {/* Top Banner */}
      <div className="bg-[#005ba8] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#004e90]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-md border border-white/20">
            <Plane className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight">eTour — Official Travel & TA/DA Management</h1>
              <span className="text-[10px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                eOffice v7.2.0
              </span>
              <span className="text-[10px] bg-blue-400/30 text-blue-100 px-2 py-0.5 rounded border border-blue-300/40">
                IN-SPACe Travel Portal
              </span>
            </div>
            <p className="text-xs text-blue-100 opacity-90">
              Department of Space Travel Requisitions, Advance Sanctions, GFR Air-Travel Entitlements & TA/DA Settlements.
            </p>
          </div>
        </div>

        {/* Action Button: Apply for Tour */}
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Official Tour</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-gray-200 px-4 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setActiveTab('my_tours')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_tours'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>My Tour Programs ({myTours.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subordinate')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subordinate'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Subordinate Proposals ({subordinateTours.length})</span>
            {subordinateTours.some((t) => t.status === 'Pending Sanction') && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sanctions')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sanctions'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sanction Orders ({sanctionedTours.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settlement')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settlement'
                ? 'border-[#0062b8] text-[#0062b8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>TA/DA Bill Claims & Reconciliation</span>
          </button>
        </div>
      </div>

      {/* Main Tour Grid / Register Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>
              {activeTab === 'my_tours'
                ? 'My Tour History & Authorizations'
                : activeTab === 'subordinate'
                ? 'Departmental Tour Proposals Pending Approval'
                : activeTab === 'sanctions'
                ? 'Official Department of Space Sanction Orders'
                : 'Post-Tour Reimbursement & Final TA/DA Claims'}
            </span>
            <span className="text-gray-400 font-normal text-[11px]">
              {tours.length} total requisitions on record
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200">
                <th className="px-3 py-2">Requisition & Officer</th>
                <th className="px-3 py-2">Destination & Purpose</th>
                <th className="px-3 py-2">Dates (From - To)</th>
                <th className="px-3 py-2">Travel Mode</th>
                <th className="px-3 py-2 text-right">Estimate & Advance</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(activeTab === 'my_tours'
                ? myTours
                : activeTab === 'subordinate'
                ? subordinateTours
                : activeTab === 'sanctions'
                ? sanctionedTours
                : tours
              ).map((tour) => (
                <tr key={tour.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="font-mono text-[10px] text-blue-700 font-bold">{tour.tourNo}</div>
                    <div className="font-bold text-gray-900 mt-0.5">{tour.officerName}</div>
                    <div className="text-[10px] text-gray-500">{tour.designation}</div>
                  </td>

                  <td className="px-3 py-2.5 max-w-xs">
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate">{tour.destination}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">{tour.purpose}</div>
                  </td>

                  <td className="px-3 py-2.5 text-gray-700 font-mono text-[11px] whitespace-nowrap">
                    {tour.startDate} to {tour.endDate}
                  </td>

                  <td className="px-3 py-2.5 text-gray-700">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium border border-gray-200">
                      {tour.travelMode}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-right font-mono">
                    <div className="font-bold text-gray-900">₹{tour.estimatedCost.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Adv: ₹{tour.advanceRequested.toLocaleString()}</div>
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tour.status === 'Approved' || tour.status === 'Sanctioned'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : tour.status === 'Settlement Submitted'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {tour.status}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Sanction Order for approved tours */}
                      {(tour.status === 'Approved' || tour.status === 'Sanctioned' || tour.status === 'Settlement Submitted') && (
                        <button
                          onClick={() => setSelectedTourForOrder(tour)}
                          className="px-2 py-1 bg-white hover:bg-blue-50 text-[#0062b8] border border-blue-300 rounded text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          title="View formal Government Sanction Order"
                        >
                          View Order
                        </button>
                      )}

                      {/* Sanction button for subordinate pending tours */}
                      {tour.status === 'Pending Sanction' && (
                        <button
                          onClick={() => handleSanction(tour.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Sanction Tour</span>
                        </button>
                      )}

                      {/* Submit TA/DA claim button for completed tours */}
                      {tour.status === 'Approved' && tour.officerName.includes('Self') && (
                        <button
                          onClick={() => setSettlementTour(tour)}
                          className="px-2 py-1 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded text-[10px] font-bold cursor-pointer shadow-2xs"
                          title="Submit Travel Allowance & Daily Allowance Bill"
                        >
                          Submit TA/DA
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
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="bg-[#005ba8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Official Tour Requisition (eTour Portal)</h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitTour} className="p-5 space-y-4 text-xs text-gray-700">
              <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">DR. RAJESH SHARMA</div>
                  <div className="text-[11px] text-gray-600">Director (Authorisation) / Scientist G • IN-SPACe</div>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-[#0062b8] rounded text-[10px] font-bold font-mono">
                  Level 14 Pay Matrix
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Destination Station / Space Installation *</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. SDSC-SHAR Sriharikota / ISRO HQ Bengaluru / VSSC Thiruvananthapuram..."
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Official Purpose of Tour *</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Specify statutory safety clearance, technical review, or ministry delegation..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tour Departure Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tour Return Date *</label>
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
                  <option value="Air (Economy)">Air (Economy - Air India / Balmer Lawrie / Ashoka Travels per GFR)</option>
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
                  <span className="text-[10px] text-gray-500">Admissible up to 80% per TA Rules</span>
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
                  <span>Submit Tour Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Government Sanction Order Modal */}
      {selectedTourForOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
            <div className="bg-[#005ba8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Government of India — Official Tour Sanction Order</h3>
              </div>
              <button
                onClick={() => setSelectedTourForOrder(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-4 text-xs font-serif text-gray-800 leading-relaxed">
              <div className="text-center border-b pb-4 border-gray-300">
                <p className="font-bold text-sm tracking-wide text-gray-900 uppercase">
                  Indian National Space Promotion and Authorisation Centre (IN-SPACe)
                </p>
                <p className="text-[11px] text-gray-600 font-sans">
                  Department of Space, Government of India
                </p>
                <p className="text-[10px] text-gray-500 font-sans">
                  Headquarters: IN-SPACe Bhavan, Bopal, Ahmedabad - 380058
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-[#0062b8] font-bold text-xs font-sans rounded border border-blue-200">
                  OFFICIAL TOUR SANCTION ORDER
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  Order No: {selectedTourForOrder.officeOrderNo || 'IN-SPACE/TOUR-ORD/2026/118'} • Sanction Reference: {selectedTourForOrder.sanctionOrderNo || 'DOS/IN-SPACE/SO-2026/042'}
                </p>
              </div>

              <div className="space-y-3">
                <p>
                  1. Sanction of the Competent Authority is hereby accorded for the official deputation / tour of <strong>{selectedTourForOrder.officerName}</strong>, {selectedTourForOrder.designation}, {selectedTourForOrder.department}, to <strong>{selectedTourForOrder.destination}</strong> for the period from <strong>{selectedTourForOrder.startDate}</strong> to <strong>{selectedTourForOrder.endDate}</strong>.
                </p>

                <p>
                  2. <strong>Purpose of Tour:</strong> <em>&quot;{selectedTourForOrder.purpose}&quot;</em>.
                </p>

                <p>
                  3. <strong>Entitlement of Travel Mode:</strong> The officer is permitted to travel by <strong>{selectedTourForOrder.travelMode}</strong> in compliance with Department of Expenditure / GFR OM on booking through authorized travel agencies.
                </p>

                <p>
                  4. <strong>Financial Sanction & Advance:</strong> Administrative and financial sanction is accorded for estimated expenditure of <strong>₹{selectedTourForOrder.estimatedCost.toLocaleString()}/-</strong>. A travel advance of <strong>₹{selectedTourForOrder.advanceRequested.toLocaleString()}/-</strong> is hereby sanctioned and debited to:
                </p>

                <div className="bg-gray-50 p-3 rounded border border-gray-200 font-sans text-[11px] space-y-1">
                  <div><strong>Major Head:</strong> 3425 — Other Scientific Research</div>
                  <div><strong>Sub-Major Head:</strong> 00 — Space Technology Promotion & Authorisation</div>
                  <div><strong>Detailed Head:</strong> 00.800.91 — Traveling Expenses (Domestic)</div>
                </div>

                <p className="text-[11px] text-gray-600 font-sans italic">
                  5. The officer shall submit the final adjustment bill within 15 days of return from tour, failing which interest as per GFR shall be levied on unspent advance.
                </p>
              </div>

              {/* Digital Signature Authentication Stamp */}
              <div className="border-t border-gray-300 pt-5 flex items-center justify-between font-sans">
                <div>
                  <div className="text-[10px] text-gray-500">Order Sanction Date:</div>
                  <div className="font-mono text-xs font-bold text-gray-800">
                    {selectedTourForOrder.sanctionedDate || '01/09/2026'}
                  </div>
                </div>

                <div className="text-right border border-emerald-500/50 bg-emerald-50/60 p-3 rounded">
                  <div className="flex items-center justify-end gap-1 text-emerald-800 font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digitally Signed & Certified</span>
                  </div>
                  <div className="text-[10px] text-gray-700 font-bold mt-0.5">
                    {selectedTourForOrder.approvingAuthority || 'DR. PAWAN GOENKA, Chairman, IN-SPACe'}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    Department of Space, Government of India
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={() => {
                  alert(`Printing official tour sanction order for ${selectedTourForOrder.officerName}`);
                }}
                className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Order</span>
              </button>

              <button
                onClick={() => setSelectedTourForOrder(null)}
                className="px-4 py-1 bg-[#0062b8] hover:bg-[#005199] text-white rounded text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TA/DA Bill Settlement Modal */}
      {settlementTour && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#005ba8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">TA/DA Travel Adjustment & Reimbursement Claim</h3>
              </div>
              <button
                onClick={() => setSettlementTour(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSettlementSubmit} className="p-5 space-y-4 text-xs text-gray-700">
              <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200">
                <div className="font-bold text-gray-900">{settlementTour.tourNo} — {settlementTour.destination}</div>
                <div className="text-[11px] text-gray-600 font-mono">
                  Advance Drawn: ₹{settlementTour.advanceRequested.toLocaleString()} • Period: {settlementTour.startDate} to {settlementTour.endDate}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Actual Air Fare (₹)</label>
                  <input
                    type="number"
                    value={airFare}
                    onChange={(e) => setAirFare(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Hotel Lodging Charges (₹)</label>
                  <input
                    type="number"
                    value={hotelLodging}
                    onChange={(e) => setHotelLodging(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Daily Allowance Per Diem (₹)</label>
                  <input
                    type="number"
                    value={dailyAllowance}
                    onChange={(e) => setDailyAllowance(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Local Conveyance / Taxi (₹)</label>
                  <input
                    type="number"
                    value={localConveyance}
                    onChange={(e) => setLocalConveyance(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Settlement Summary Calculation */}
              <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Total Expenses Claimed:</span>
                  <span className="font-bold text-gray-900">₹{(airFare + dailyAllowance + hotelLodging + localConveyance).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Less: Advance Drawn:</span>
                  <span className="text-amber-700">- ₹{settlementTour.advanceRequested.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-1.5 flex justify-between font-bold text-sm">
                  <span>Net Payable to Officer:</span>
                  <span className="text-emerald-700">₹{(airFare + dailyAllowance + hotelLodging + localConveyance - settlementTour.advanceRequested).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettlementTour(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#ea7e00] hover:bg-[#d86f00] text-white rounded font-bold cursor-pointer shadow-xs"
                >
                  Submit TA/DA Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
