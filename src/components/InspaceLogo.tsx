import React, { useState } from 'react';
import { Maximize2, ExternalLink, X, Download, Eye, Sparkles } from 'lucide-react';

interface InspaceLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'badge' | 'large';
  showSubtext?: boolean;
  showClearViewButton?: boolean;
}

export const InspaceLogo: React.FC<InspaceLogoProps> = ({
  className = '',
  variant = 'full',
  showSubtext = true,
  showClearViewButton = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [bgDark, setBgDark] = useState(false);

  // Direct vector render of the authentic IN-SPACe brandmark
  const renderVector = (sizeClass: string = 'h-8 sm:h-9 w-auto') => (
    <svg
      viewBox="0 0 580 130"
      className={`${sizeClass} select-none transition-transform`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="IN-SPACe Logo"
    >
      {/* ORBITAL ARC SWEEP */}
      <path
        d="M 215 90 C 230 106, 280 120, 360 120 C 445 120, 525 102, 545 68 C 555 52, 550 36, 528 26 C 485 10, 370 8, 275 34"
        fill="none"
        stroke="#12458D"
        strokeWidth="3.6"
        strokeLinecap="round"
      />

      {/* SATELLITE (Positioned along orbital path at top right ~ x=518, y=27) */}
      <g transform="translate(518, 27) rotate(-22)">
        {/* Solar Panels Left Wing */}
        <rect x="-25" y="-2.5" width="7" height="5" fill="#12458D" rx="0.5" />
        <rect x="-16" y="-2.5" width="7" height="5" fill="#12458D" rx="0.5" />
        <line x1="-26" y1="0" x2="-8" y2="0" stroke="#12458D" strokeWidth="1.2" />

        {/* Satellite Core Body (Coral) */}
        <ellipse cx="0" cy="0" rx="4.5" ry="6.5" fill="#CF7373" />

        {/* Solar Panels Right Wing */}
        <rect x="9" y="-2.5" width="7" height="5" fill="#12458D" rx="0.5" />
        <rect x="18" y="-2.5" width="7" height="5" fill="#12458D" rx="0.5" />
        <line x1="8" y1="0" x2="26" y2="0" stroke="#12458D" strokeWidth="1.2" />
      </g>

      {/* "IN" in Coral Rose (#CF7373) */}
      <g fill="#CF7373" id="logo-IN">
        {/* 'I' with double vertical parallel pillars */}
        <rect x="28" y="44" width="7.5" height="46" rx="0.5" />
        <rect x="40.5" y="44" width="7.5" height="46" rx="0.5" />

        {/* 'N' with vertical pillars and wide connecting diagonal */}
        <rect x="62" y="44" width="8" height="46" rx="0.5" />
        <polygon points="70,44 80,44 140,90 130,90" />
        <rect x="132" y="44" width="8" height="46" rx="0.5" />
      </g>

      {/* HYPHEN '-' in Deep Navy Blue (#12458D) */}
      <rect x="153" y="64" width="16" height="8" rx="0.5" fill="#12458D" />

      {/* "SPACe" in Deep Navy Blue & Coral Rocket Fin */}
      <g fill="#12458D" id="logo-SPACe">
        {/* 'S' - Futuristic Aerodynamic Track Shape */}
        <path
          d="M 230 44 
             L 185 44 
             C 176 44, 171 49, 171 58 
             L 171 63 
             C 171 72, 176 76, 185 76 
             L 216 76 
             L 216 82 
             C 216 85, 212 86.5, 206 86.5 
             L 172 86.5 
             L 172 90 
             L 216 90 
             C 225 90, 230 86, 230 77 
             L 230 71 
             C 230 63, 225 59, 216 59 
             L 185 59 
             L 185 52 
             C 185 48.5, 189 47.5, 195 47.5 
             L 230 47.5 
             Z"
        />

        {/* 'P' */}
        <path
          d="M 241 44 
             L 241 90 
             L 249 90 
             L 249 74 
             L 278 74 
             C 288 74, 293 68, 293 59 
             L 293 57 
             C 293 48, 288 44, 278 44 
             Z 
             M 249 50.5 
             L 276 50.5 
             C 281 50.5, 284 53, 284 58 
             L 284 60 
             C 284 65, 281 67.5, 276 67.5 
             L 249 67.5 
             Z"
        />

        {/* 'A' - Supersonic Delta Rocket Arrow (Navy Blue Main Body) */}
        <polygon points="348,14 301,90 336,90 348,68 360,90 395,90" />
        <polygon points="348,36 324,84 348,68 372,84" fill="#ffffff" />
      </g>

      {/* 'A' - Coral Secondary Delta Wing / Thrust Trail (Nested below right wing) */}
      <polygon points="348,68 366,84 382,90 366,95 348,78" fill="#CF7373" />
      <polygon points="360,84 388,90 376,96 348,78" fill="#CF7373" />

      {/* 'C' & 'e' in Deep Navy Blue */}
      <g fill="#12458D">
        {/* 'C' */}
        <path
          d="M 458 50.5 
             L 423 50.5 
             C 416 50.5, 412 54, 412 61 
             L 412 73 
             C 412 80, 416 83.5, 423 83.5 
             L 458 83.5 
             L 458 90 
             L 421 90 
             C 410 90, 403.5 84, 403.5 73 
             L 403.5 61 
             C 403.5 50, 410 44, 421 44 
             L 458 44 
             Z"
        />

        {/* 'e' (Explicit lowercase e matching exact logo) */}
        <path
          d="M 470 57 
             C 470 48, 477 44, 489 44 
             L 512 44 
             C 523 44, 529 49, 529 59 
             L 529 75 
             C 529 85, 523 90, 512 90 
             L 489 90 
             C 477 90, 470 85, 470 75 
             Z 
             M 478.5 63 
             L 520.5 63 
             L 520.5 59 
             C 520.5 53, 517.5 50.5, 511 50.5 
             L 489 50.5 
             C 482.5 50.5, 478.5 53.5, 478.5 59 
             Z 
             M 478.5 70 
             L 478.5 74 
             C 478.5 79.5, 482.5 83.5, 489 83.5 
             L 511 83.5 
             C 517.5 83.5, 520.5 80.5, 520.5 76 
             L 529 76 
             C 529 85, 523 90, 512 90 
             L 489 90 
             C 477 90, 470 85, 470 75 
             Z"
        />
      </g>
    </svg>
  );

  return (
    <>
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {/* High-contrast crisp White Container */}
        <div
          onClick={() => setModalOpen(true)}
          title="Click for Clear View / Full Vector Details of IN-SPACe Logo"
          className="group relative bg-white px-2 sm:px-3 py-1 rounded-md shadow-sm border border-white/90 flex items-center justify-center shrink-0 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
        >
          {/* Vector Emblem */}
          <div className="w-[130px] sm:w-[155px] flex items-center justify-center">
            {renderVector('h-7 sm:h-8 w-full')}
          </div>

          {/* Hover indicator for Clear View */}
          {showClearViewButton && (
            <span className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 bg-[#0062b8] text-white p-0.5 rounded-full shadow transition-opacity">
              <Maximize2 className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {/* Text Details */}
        {showSubtext && (
          <div className="flex flex-col justify-center leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm tracking-normal drop-shadow-xs">
                IN-SPACe
              </span>
              <button
                onClick={() => setModalOpen(true)}
                title="Open Clear View of IN-SPACe Logo"
                className="hidden sm:inline-flex items-center gap-1 text-[9px] bg-white/15 hover:bg-white/30 text-white px-1.5 py-0.5 rounded border border-white/30 font-medium cursor-pointer transition-colors"
              >
                <Eye className="w-2.5 h-2.5 text-yellow-300" />
                <span>Clear View</span>
              </button>
              <a
                href="https://www.inspace.gov.in"
                target="_blank"
                rel="noreferrer"
                title="Official Portal: https://www.inspace.gov.in"
                className="text-[9px] bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-white px-1.5 py-0.5 rounded border border-blue-400/40 font-mono transition-colors"
              >
                inspace.gov.in ↗
              </a>
            </div>
            <span className="text-[10px] text-blue-100 font-medium tracking-tight hidden sm:block line-clamp-1">
              Indian National Space Promotion and Authorisation Centre
            </span>
            <span className="text-[8px] text-blue-200 tracking-wider hidden md:block">
              Department of Space, Government of India
            </span>
          </div>
        )}
      </div>

      {/* CLEAR VIEW MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#0062b8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <div>
                  <h3 className="font-bold text-sm">IN-SPACe Official Logo — Clear View</h3>
                  <p className="text-[10px] text-blue-100">
                    Indian National Space Promotion and Authorisation Centre • DOS, Govt of India
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-blue-700 rounded text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Display Canvas with Background Toggle */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Official Vector Brandmark (100% Crisp Resolution)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">Canvas Background:</span>
                  <button
                    onClick={() => setBgDark(false)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                      !bgDark ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    White Canvas
                  </button>
                  <button
                    onClick={() => setBgDark(true)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                      bgDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Deep Space Navy
                  </button>
                </div>
              </div>

              {/* Large High-Res Vector Display */}
              <div
                className={`p-8 rounded-lg border flex items-center justify-center transition-colors shadow-inner ${
                  bgDark ? 'bg-[#0b1b36] border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="w-full max-w-lg py-4">
                  {renderVector('h-24 sm:h-28 w-full')}
                </div>
              </div>

              {/* Exact Casing & Visual Breakdown Specification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-md border border-slate-200">
                <div className="space-y-1.5">
                  <span className="font-bold text-gray-900 block text-[13px]">
                    Brandmark & Typography Specifications:
                  </span>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      <strong className="text-gray-800">Exact Casing:</strong>{' '}
                      <span className="font-mono font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
                        IN-SPACe
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-800">IN (Prefix):</strong> Coral Rose (
                      <code className="text-[#CF7373] font-bold">#CF7373</code>) with double vertical 'I'
                      and geometric 'N'.
                    </p>
                    <p>
                      <strong className="text-gray-800">SPAC (Base):</strong> Deep Space Navy (
                      <code className="text-[#12458D] font-bold">#12458D</code>) with Supersonic Delta Rocket 'A'.
                    </p>
                    <p>
                      <strong className="text-gray-800">e (Suffix):</strong> Explicit lowercase 'e' in Space Navy.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-gray-900 block text-[13px]">
                    Space Elements & Nodal Agency:
                  </span>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      <strong className="text-gray-800">Orbital Trajectory:</strong> Continuous elliptical arc swooping under SPACe and around lowercase 'e'.
                    </p>
                    <p>
                      <strong className="text-gray-800">Satellite Body:</strong> Coral-pink telemetry core with dual solar panel arrays.
                    </p>
                    <p>
                      <strong className="text-gray-800">Nodal Ministry:</strong> Department of Space (DOS), Government of India.
                    </p>
                    <p>
                      <strong className="text-gray-800">Headquarters:</strong> Bopal, Ahmedabad, Gujarat - 380058.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <a
                href="https://www.inspace.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-800 hover:text-blue-950 font-bold hover:underline"
              >
                <span>Visit Official Portal (inspace.gov.in)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href="/inspace_logo.svg"
                  download="inspace_logo.svg"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-800 px-3 py-1.5 rounded border border-gray-300 font-medium cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-gray-600" />
                  <span>Download SVG Asset</span>
                </a>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-[#0062b8] hover:bg-blue-700 text-white px-4 py-1.5 rounded font-semibold cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
