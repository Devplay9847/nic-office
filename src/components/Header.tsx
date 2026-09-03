import React, { useState } from 'react';
import { Bell, HelpCircle, Globe, ChevronDown, User, ShieldCheck, LogOut, RefreshCw, Key } from 'lucide-react';

interface HeaderProps {
  onNotificationClick: () => void;
  onHelpClick: () => void;
  onProfileClick: () => void;
  notificationCount: number;
  onAnnouncementsClick: () => void;
  activeLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick,
  onHelpClick,
  onProfileClick,
  notificationCount,
  onAnnouncementsClick,
  activeLanguage,
  onLanguageChange,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English (en)' },
    { code: 'hi', label: 'हिन्दी (hi)' },
    { code: 'ml', label: 'മലയാളം (ml)' },
    { code: 'ta', label: 'தமிழ் (ta)' },
  ];

  return (
    <header className="relative w-full bg-[#0062b8] text-white shadow-md z-30 select-none">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between px-3 py-1.5 h-14">
        {/* Left Side: eOffice Logo & eFile 7.2.0 */}
        <div className="flex items-center gap-4">
          {/* Official eOffice Brand Logo */}
          <div className="flex items-center gap-1 cursor-pointer" title="National Informatics Centre - eOffice v7.2.0">
            <div className="flex items-baseline leading-none">
              {/* Lowercase vibrant orange 'e' */}
              <span className="text-[#fca311] font-bold text-2xl tracking-tighter drop-shadow-sm font-sans">
                e
              </span>
              {/* 'Office' with Earth Globe inside 'O' */}
              <div className="flex items-center">
                <span className="relative inline-flex items-center justify-center font-bold text-2xl text-white tracking-tight ml-0.5">
                  <span className="relative flex items-center justify-center">
                    {/* Glowing Earth icon */}
                    <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00b4d8] via-[#0077b6] to-[#90e0ef] border border-white/80 shadow-inner inline-flex items-center justify-center overflow-hidden">
                      <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3.6 9h16.8M3.6 15h16.8" />
                        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                      </svg>
                    </span>
                  </span>
                  <span className="font-bold text-2xl text-white ml-0.5">ffice</span>
                </span>
              </div>
            </div>
          </div>

          {/* Slogan pill under logo */}
          <div className="hidden sm:flex flex-col border-l border-blue-400/40 pl-3">
            <div className="text-[9px] uppercase tracking-widest text-blue-100 font-semibold leading-tight opacity-90">
              A DIGITAL WORKPLACE SOLUTION
            </div>
            <div className="text-[8px] text-blue-200 tracking-wider">
              National Informatics Centre (NIC)
            </div>
          </div>

          {/* eFile 7.2.0 text */}
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-blue-400/30">
            <span className="text-white text-base font-normal tracking-wide">
              eFile
            </span>
            <span className="text-[#ffd54f] font-semibold text-sm tracking-wider">
              7.2.0
            </span>
          </div>
        </div>

        {/* Center: Orange Pull-Down Tab / Drawer Toggle */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0">
          <button
            onClick={onAnnouncementsClick}
            title="eOffice Announcements & System Alerts"
            className="group relative bg-[#ea7e00] hover:bg-[#d86f00] text-white px-5 py-0.5 rounded-b-md shadow-md flex flex-col items-center justify-center transition-all cursor-pointer border-t-0 border border-[#b35e00]"
          >
            <div className="flex flex-col gap-0.5 py-0.5">
              <span className="w-5 h-[1.5px] bg-white/90 rounded-full group-hover:scale-x-110 transition-transform"></span>
              <span className="w-4 h-[1.5px] bg-white/90 rounded-full group-hover:scale-x-110 transition-transform"></span>
              <span className="w-3 h-[1.5px] bg-white/90 rounded-full group-hover:scale-x-110 transition-transform"></span>
            </div>
          </button>
        </div>

        {/* Right Side: Notification, Language, Help & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <button
            onClick={onNotificationClick}
            title="Pending Notifications & Alerts"
            className="relative p-1.5 text-white hover:text-blue-100 hover:bg-blue-700/40 rounded-full transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff5722] text-white text-[10px] font-bold rounded-full min-w-[19px] h-[19px] flex items-center justify-center px-1 shadow-sm border border-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Language Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="bg-white text-gray-800 hover:bg-gray-50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm text-xs font-semibold cursor-pointer border border-gray-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-gray-600" />
              <span>{activeLanguage}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded shadow-lg border border-gray-200 py-1 text-xs text-gray-800 z-50 animate-fadeIn">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between ${
                      activeLanguage === l.code ? 'font-bold text-blue-700 bg-blue-50/60' : ''
                    }`}
                  >
                    <span>{l.label}</span>
                    {activeLanguage === l.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help Icon */}
          <button
            onClick={onHelpClick}
            title="eOffice Manual & Support"
            className="text-white hover:bg-blue-700/50 rounded-full p-1 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Profile Widget */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="bg-[#004e93] hover:bg-[#004582] border border-[#1678d4] rounded px-2.5 py-1 flex items-center gap-2 cursor-pointer transition-colors shadow-inner text-left"
            >
              {/* Silhouette Avatar */}
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center overflow-hidden border border-white/60">
                <User className="w-4 h-4 text-gray-600" />
              </div>

              {/* User text stack */}
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-[#ffd54f] font-bold text-xs tracking-wider">
                  AUDITOR1
                </span>
                <span className="text-[10px] text-blue-100 opacity-90 truncate max-w-[150px]">
                  Auditor1, Finance, KSITM
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-white/80 ml-1" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-gray-800 rounded shadow-xl border border-gray-200 py-1.5 text-xs z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-gray-100 bg-blue-50/50">
                  <p className="font-bold text-sm text-gray-900">AUDITOR1</p>
                  <p className="text-gray-600 text-[11px]">Auditor1, Finance Wing</p>
                  <p className="text-gray-500 text-[10px]">Kerala State IT Mission (KSITM)</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>DSC Token: Connected (Class 3)</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onProfileClick();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span>User Profile & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      onProfileClick();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5 text-gray-500" />
                    <span>Digital Signature (DSC) Certificate</span>
                  </button>

                  <button
                    onClick={() => {
                      onProfileClick();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                    <span>Switch Role / Delegation</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      alert('Session is locked. In live deployment, this logs out of NIC single sign-on (Parichay / Jan Parichay).');
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign Out (Parichay SSO)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
