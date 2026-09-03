import React, { useState } from 'react';
import {
  Bell,
  HelpCircle,
  Globe,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Key,
  FileText,
  BookOpen,
  Calendar,
  Navigation,
  Usb,
  ExternalLink,
} from 'lucide-react';
import { ActiveModule } from '../types';
import { InspaceLogo } from './InspaceLogo';

interface HeaderProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenDSC: () => void;
  onNotificationClick: () => void;
  onHelpClick: () => void;
  onProfileClick: () => void;
  notificationCount: number;
  onAnnouncementsClick: () => void;
  activeLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onOpenDSC,
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
        {/* Left Side: IN-SPACe White Label Brand Logo & eOffice eFile 7.2.0 */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Official IN-SPACe White-label Logo & Organization Title */}
          <InspaceLogo />

          {/* eOffice Brand & Version Tag */}
          <div className="hidden lg:flex items-center gap-2.5 border-l border-blue-400/40 pl-3">
            <div className="flex items-center gap-1 cursor-pointer opacity-95 hover:opacity-100 transition-opacity" title="National Informatics Centre - eOffice v7.2.0">
              <div className="flex items-baseline leading-none">
                <span className="text-[#fca311] font-bold text-xl tracking-tighter drop-shadow-sm font-sans">
                  e
                </span>
                <span className="font-bold text-xl text-white ml-0.5">Office</span>
              </div>
            </div>

            <div className="flex items-center gap-1 pl-2 border-l border-blue-400/30">
              <span className="text-white text-xs font-normal tracking-wide">
                eFile
              </span>
              <span className="text-[#ffd54f] font-semibold text-xs tracking-wider">
                7.2.0
              </span>
            </div>
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
                  DIRECTOR_AUTH
                </span>
                <span className="text-[10px] text-blue-100 opacity-90 truncate max-w-[170px]">
                  Authorisation Wing, IN-SPACe
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-white/80 ml-1" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-white text-gray-800 rounded shadow-xl border border-gray-200 py-1.5 text-xs z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-gray-100 bg-blue-50/60">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-gray-900">DR. RAJESH SHARMA</p>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">
                      IN-SPACe
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px] font-medium">Joint Director (Space Authorisation & Regulatory)</p>
                  <p className="text-gray-500 text-[10px]">Indian National Space Promotion and Authorisation Centre</p>
                  <p className="text-gray-400 text-[9px]">Department of Space, Government of India</p>

                  <a
                    href="https://www.inspace.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 hover:underline font-medium"
                  >
                    <span>Visit inspace.gov.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>DSC Token: Connected (Class 3 Govt)</span>
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

      {/* eOffice 7 WAW Portal Application Switcher Bar */}
      <div className="bg-[#004f96] border-t border-blue-400/20 px-3 flex items-center justify-between text-xs h-8">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* 1. eFile / Receipts (FMS) */}
          <button
            onClick={() => onSelectModule('file')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeModule === 'file' || activeModule === 'receipt' || activeModule === 'draft' || activeModule === 'dispatch' || activeModule === 'notesheet' || activeModule === 'migration'
                ? 'bg-[#00386b] text-white shadow-inner ring-1 ring-white/20'
                : 'text-blue-100 hover:bg-[#004585] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>eFile (FMS)</span>
          </button>

          {/* 2. KMS (Knowledge Management System) */}
          <button
            onClick={() => onSelectModule('kms')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeModule === 'kms'
                ? 'bg-[#00386b] text-white shadow-inner ring-1 ring-white/20'
                : 'text-blue-100 hover:bg-[#004585] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>KMS (Circulars & Rules)</span>
          </button>

          {/* 3. eLeave */}
          <button
            onClick={() => onSelectModule('eleave')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeModule === 'eleave'
                ? 'bg-[#00386b] text-white shadow-inner ring-1 ring-white/20'
                : 'text-blue-100 hover:bg-[#004585] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>eLeave</span>
            <span className="text-[9px] bg-amber-500/80 text-white px-1 rounded-full font-mono">8 CL</span>
          </button>

          {/* 4. eTour */}
          <button
            onClick={() => onSelectModule('etour')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeModule === 'etour'
                ? 'bg-[#00386b] text-white shadow-inner ring-1 ring-white/20'
                : 'text-blue-100 hover:bg-[#004585] hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-amber-300" />
            <span>eTour</span>
          </button>

          {/* 5. DSC Token Hub */}
          <button
            onClick={onOpenDSC}
            className="px-3 py-1 rounded flex items-center gap-1.5 font-bold text-blue-100 hover:bg-[#004585] hover:text-white transition-all cursor-pointer"
          >
            <Usb className="w-3.5 h-3.5 text-emerald-300" />
            <span>DSC Token Hub</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>

        {/* Right Help Desk Contact */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-blue-200">
          <span>NIC eOffice Helpdesk: <strong>1800-111-555</strong></span>
          <span className="text-blue-300/40">•</span>
          <span>Instance: <strong>Kerala State WAN (KSWAN)</strong></span>
        </div>
      </div>
    </header>
  );
};
