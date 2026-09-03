import React from 'react';
import { X, Bell, Check, Clock, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectReceipt: (receiptNo: number) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectReceipt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-3 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0062b8] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <h2 className="text-sm font-bold">Notifications & Alerts (62 Pending)</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Recent Activity & Workflow Dispatches</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-2 overflow-y-auto divide-y divide-gray-100 flex-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.receiptNo) {
                  onSelectReceipt(notif.receiptNo);
                  onClose();
                }
              }}
              className={`p-3 hover:bg-blue-50/70 transition-colors rounded cursor-pointer ${
                notif.unread ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                    {notif.type === 'receipt' && <FileText className="w-3.5 h-3.5" />}
                    {notif.type === 'dsc' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
                    {notif.type === 'system' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />}
                    {notif.type === 'file' && <FileText className="w-3.5 h-3.5 text-amber-700" />}
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-gray-900 leading-tight">{notif.title}</h4>
                    <p className="text-gray-600 text-[11px] mt-0.5 leading-snug">{notif.description}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>

                {notif.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#ff5722] shrink-0 mt-1"></span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <span>eOffice Central Notification Service (NIC-CNS)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
