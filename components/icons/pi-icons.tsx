import { IconName } from "@/types/os";

type IconProps = {
  className?: string;
};

function TerminalIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="8" y="8" width="48" height="48" rx="2" fill="#1c1d20" />
      <rect x="12" y="12" width="40" height="40" rx="1" fill="#2a2d31" />
      <path d="M20 24l8 8-8 8" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <path d="M33 40h10" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function FolderIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M8 18a4 4 0 0 1 4-4h15l4 5h21a4 4 0 0 1 4 4v6H8v-11z" fill="#e9c75f" />
      <rect x="8" y="25" width="48" height="23" rx="4" fill="#d9b44f" />
      <path d="M12 28h40" fill="none" stroke="#c79d37" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

function PicoIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="10" y="12" width="44" height="40" rx="8" fill="#ff86b3" stroke="#d45c8b" strokeWidth="2" />
      <rect x="19" y="20" width="26" height="24" rx="4" fill="#ffd3e5" stroke="#e49abc" strokeWidth="1.8" />
      <path d="M28 26h8m-1 0v12m-5-12v12m-3-8c2 0 3.9-.5 5.3-1.5" fill="none" stroke="#8a2f57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <path d="M14 18h-4M14 26h-4M14 34h-4M14 42h-4M54 18h4M54 26h4M54 34h4M54 42h4" fill="none" stroke="#f4b5cf" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function BrowserIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="23" fill="none" stroke="#acb7cb" strokeWidth="4" />
      <path d="M9 32h46M32 9c7 7 10 15 10 23S39 48 32 55M32 9c-7 7-10 15-10 23s3 16 10 23" fill="none" stroke="#acb7cb" strokeWidth="3.4" />
    </svg>
  );
}

function SettingsIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="9" fill="#9ca7b8" />
      <path
        d="M32 14l4 4h6l2 6 5 3-2 6 2 6-5 3-2 6h-6l-4 4-4-4h-6l-2-6-5-3 2-6-2-6 5-3 2-6h6l4-4z"
        fill="none"
        stroke="#b9c2cf"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="32" cy="32" r="4" fill="#eef2f7" />
    </svg>
  );
}

function VsCodeIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="10" y="8" width="44" height="48" rx="12" fill="#0f172a" />
      <path d="M46 14l-18 8-10-8-8 6 12 12-12 12 8 6 10-8 18 8 4-2V16l-4-2z" fill="#2492ff" />
      <path d="M46 14l-18 18 18 18" fill="none" stroke="#8ad3ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
      <path d="M18 20l14 12-14 12" fill="none" stroke="#d7f1ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
    </svg>
  );
}

function TextEditorIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="12" y="8" width="38" height="48" rx="2" fill="#fff6dc" />
      <rect x="18" y="15" width="22" height="3" rx="1.5" fill="#d6c797" />
      <rect x="18" y="23" width="20" height="3" rx="1.5" fill="#d6c797" />
      <rect x="18" y="31" width="16" height="3" rx="1.5" fill="#d6c797" />
      <path d="M38 40l10-10 6 6-10 10-9 2 3-8z" fill="#f0b454" />
      <path d="M46 32l6 6" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
      <path d="M38 40l10-10 6 6-10 10-9 2 3-8z" fill="none" stroke="#c18f33" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function DocumentViewerIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M14 8h24l12 12v36H14z" fill="#f8fafc" />
      <path d="M38 8v14h12" fill="#dce6f4" />
      <path d="M22 28h18M22 35h18M22 42h12" fill="none" stroke="#a7b4c4" strokeLinecap="round" strokeWidth="3" />
      <circle cx="45" cy="46" r="10" fill="#dcecff" />
      <path d="M41 46h8M45 42v8" fill="none" stroke="#5b8bd8" strokeLinecap="round" strokeWidth="2.5" />
      <path d="M14 8h24l12 12v36H14z" fill="none" stroke="#b9c5d3" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function MediaPlayerIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="#f07c7c" strokeWidth="4" />
      <path d="M27 22l15 10-15 10V22z" fill="#f07c7c" />
    </svg>
  );
}

function ImageViewerIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="10" y="12" width="44" height="36" rx="4" fill="#f6fbff" stroke="#aebcca" strokeWidth="2" />
      <circle cx="23" cy="24" r="4" fill="#f4c35d" />
      <path d="M16 41l11-12 8 8 7-6 8 10H16z" fill="#80b96d" />
    </svg>
  );
}

function GameCenterIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="12" y="20" width="40" height="24" rx="12" fill="none" stroke="#8bc83a" strokeWidth="4" />
      <path d="M24 25v14M17 32h14M42 29h.01M47 35h.01" stroke="#8bc83a" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function PiSnakeIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="9" y="9" width="46" height="46" rx="11" fill="#10223d" stroke="#345780" strokeWidth="2" />
      <path
        d="M18 23h10v8h8v10h10"
        fill="none"
        stroke="#7ee081"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <circle cx="47" cy="41" r="5.2" fill="#7ee081" />
      <circle cx="47" cy="41" r="1.2" fill="#10223d" />
      <circle cx="21" cy="20" r="4.5" fill="#f97316" />
      <path
        d="M18 18h18m-2 0v13m-7-13v13m-4-9c2.4 0 4.7-.7 6.5-2"
        fill="none"
        stroke="#ffd978"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function SliceThePieIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="#fff3d9" stroke="#d9a14a" strokeWidth="2.4" />
      <path d="M32 32L32 10A22 22 0 0 1 51.1 21z" fill="#ef7a2d" />
      <path d="M32 32l19.1-11A22 22 0 0 1 50 47.8z" fill="#f5b449" />
      <path d="M32 32l18 15.8A22 22 0 0 1 24 52.5z" fill="#84bf63" />
      <path d="M32 32L24 52.5A22 22 0 0 1 11 22.4z" fill="#67b8e8" />
      <path d="M32 32 11 22.4A22 22 0 0 1 32 10z" fill="#7c6ce0" />
      <path d="M32 10v44M11 22.4l39 25.4M51.1 21 24 52.5" fill="none" stroke="#fffaf0" strokeLinecap="round" strokeWidth="2" />
      <path d="M22 20h15m-2 0v13m-7-13v13m-4-9c2.4 0 4.7-.7 6.5-2" fill="none" stroke="#4b2c18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
    </svg>
  );
}

function PiDefenderIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="23" fill="#0b1530" stroke="#244f7c" strokeWidth="2" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#335c8f" strokeDasharray="3 4" strokeWidth="1.5" />
      <path d="M32 9c8 8 11 17 10 25s-6 14-10 21" fill="none" stroke="#8be2ff" strokeLinecap="round" strokeWidth="2.3" />
      <path d="M32 9c-8 8-11 17-10 25s6 14 10 21" fill="none" stroke="#8be2ff" strokeLinecap="round" strokeOpacity="0.4" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="6.5" fill="#fbbf24" stroke="#f97316" strokeWidth="2" />
      <path
        d="M19 18h18m-3 0v14m-8-14v14m-5-9c2.2 0 4.5-.6 6.2-1.8"
        fill="none"
        stroke="#ffd978"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <circle cx="47" cy="17" r="4.5" fill="#f87171" stroke="#7f1d1d" strokeWidth="2" />
      <path d="M47 17 39 27" fill="none" stroke="#f87171" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function CalculatorIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="16" y="8" width="32" height="48" rx="4" fill="#f7fbff" stroke="#9cb0c7" strokeWidth="2" />
      <rect x="21" y="14" width="22" height="8" rx="2" fill="#d9e7f7" />
      <path d="M24 30h.01M32 30h.01M40 30h.01M24 38h.01M32 38h.01M40 38h.01M24 46h.01M32 46h8" stroke="#7b8da5" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function TaskManagerIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="10" y="14" width="44" height="36" rx="4" fill="#111827" />
      <path d="M16 34h8l4-8 6 16 5-10h9" fill="none" stroke="#74be6c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function RaspberryIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 11l9 4 7 8-2 17-14 13-14-13-2-17 7-8 9-4z" fill="#cf2d5d" />
      <path d="M24 12c0-5 4-8 8-8s8 3 8 8c-2 2-4 3-8 3s-6-1-8-3z" fill="#4b9f50" />
      <circle cx="24" cy="30" r="4" fill="#f4e6ec" />
      <circle cx="40" cy="30" r="4" fill="#f4e6ec" />
      <circle cx="32" cy="40" r="5" fill="#f4e6ec" />
    </svg>
  );
}

function RaspberryPi5Icon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 11l9 4 7 8-2 17-14 13-14-13-2-17 7-8 9-4z" fill="#cf2d5d" />
      <path d="M24 12c0-5 4-8 8-8s8 3 8 8c-2 2-4 3-8 3s-6-1-8-3z" fill="#4b9f50" />
      <circle cx="24" cy="30" r="3.7" fill="#f4e6ec" />
      <circle cx="40" cy="30" r="3.7" fill="#f4e6ec" />
      <circle cx="32" cy="40" r="4.8" fill="#f4e6ec" />
      <circle cx="48" cy="48" r="10" fill="#121d3a" stroke="#3e568a" strokeWidth="2" />
      <path d="M44 44h8m-1 0v8m-5-8v8m-2-5c1.7 0 3.3-.4 4.5-1.2" fill="none" stroke="#9cc3ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChocoPieIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <img
        src="/branding/choco-pie-logo.png"
        alt="Choco Pie logo"
        className="block h-auto w-full object-contain"
        draggable={false}
      />
    </span>
  );
}

function UsbIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="18" y="8" width="28" height="48" rx="6" fill="#4ea0ff" />
      <rect x="23" y="14" width="18" height="12" rx="2" fill="#d7ebff" />
      <path
        d="M32 28v14m0-14l-4 4m4-4l4 4m0 10h-8m8 0l-3 4m3-4l3 4"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
      <rect x="25" y="4" width="4" height="5" rx="1.5" fill="#d1d5db" />
      <rect x="35" y="4" width="4" height="5" rx="1.5" fill="#d1d5db" />
    </svg>
  );
}

function PiIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pi-icon-fill" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe39b" />
          <stop offset="100%" stopColor="#f39a3f" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill="#1a2745" />
      <circle cx="32" cy="32" r="20" fill="url(#pi-icon-fill)" opacity="0.18" />
      <path
        d="M20 22h25m-4 0v20m-10-20v20m-7-13c4 0 8-1 11-3"
        fill="none"
        stroke="#ffd982"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#2f426e" strokeWidth="2" />
    </svg>
  );
}

function PiDayIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="12" y="10" width="40" height="44" rx="8" fill="#fff7e7" stroke="#d7c59f" strokeWidth="2" />
      <rect x="12" y="10" width="40" height="12" rx="8" fill="#ef7a2d" />
      <path d="M22 8v8M42 8v8" fill="none" stroke="#f8d1b2" strokeLinecap="round" strokeWidth="3" />
      <path
        d="M22 29h21m-3 0v15m-10-15v15m-6-10c3 0 6-.8 9-2.4"
        fill="none"
        stroke="#2c3a63"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function PiArtIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M32 10c-12.2 0-22 8.8-22 19.8S19.8 50 32 50h2.5c2.5 0 4.5-2 4.5-4.5 0-1-.3-2-.9-2.8-.6-.8-.9-1.7-.9-2.7 0-2.8 2.2-5 5-5h1.8c5.5 0 10-4.5 10-10.1C54 18.7 44.2 10 32 10Z"
        fill="#f6fbff"
        stroke="#9db0c6"
        strokeWidth="2"
      />
      <circle cx="22" cy="24" r="3.2" fill="#ef7a2d" />
      <circle cx="29" cy="18" r="3" fill="#60a5fa" />
      <circle cx="38" cy="19" r="3" fill="#8b5cf6" />
      <circle cx="44" cy="27" r="3.1" fill="#22c55e" />
      <path d="M42 38l12 12" fill="none" stroke="#c98b2e" strokeLinecap="round" strokeWidth="4" />
      <path d="M39 35l6 6" fill="none" stroke="#f5d38a" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

function SymphonyIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="12" y="10" width="40" height="44" rx="10" fill="#101a36" />
      <path
        d="M26 18v20.5a6.5 6.5 0 1 1-3.4-5.7V24l18-4v16.5a6.5 6.5 0 1 1-3.4-5.7V18.8L26 21.3"
        fill="none"
        stroke="#ffd480"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="21" cy="39" r="4.6" fill="#ef7a2d" />
      <circle cx="35.6" cy="37.7" r="4.6" fill="#ef7a2d" />
      <path d="M26 24l11.2-2.5" fill="none" stroke="#ef7a2d" strokeLinecap="round" strokeWidth="2.8" />
      <rect x="12" y="10" width="40" height="44" rx="10" fill="none" stroke="#243564" strokeWidth="2" />
    </svg>
  );
}

function ExplorerIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="28" cy="28" r="16" fill="#eff6ff" stroke="#9bb0c7" strokeWidth="2.2" />
      <path
        d="M20 22h16m-3 0v12m-8-12v12m-5-8c2.5 0 5.1-.7 7-2"
        fill="none"
        stroke="#2f5fb3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M39 39l11 11" fill="none" stroke="#ef7a2d" strokeLinecap="round" strokeWidth="5" />
      <circle cx="28" cy="28" r="16" fill="none" stroke="#d5e3f4" strokeWidth="1.5" />
    </svg>
  );
}

function SimulationIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="10" y="12" width="44" height="40" rx="8" fill="#eef7ff" stroke="#a4b7ca" strokeWidth="2" />
      <path d="M18 44h28M18 20v24" fill="none" stroke="#c0cedd" strokeLinecap="round" strokeWidth="2.2" />
      <path d="M18 38l8-9 7 5 12-14" fill="none" stroke="#ef7a2d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
      <circle cx="26" cy="29" r="2.6" fill="#60a5fa" />
      <circle cx="33" cy="34" r="2.6" fill="#8b5cf6" />
      <circle cx="45" cy="20" r="2.6" fill="#22c55e" />
    </svg>
  );
}

function QuizIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M14 14h36a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H31l-10 8v-8h-7a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z" fill="#fdf7e9" stroke="#d8c6a4" strokeWidth="2" />
      <path d="M27 27a6 6 0 1 1 10.3 4.2c-1.8 1.7-3.8 2.8-3.8 5" fill="none" stroke="#2a3b63" strokeLinecap="round" strokeWidth="3.2" />
      <circle cx="33.5" cy="42" r="2.2" fill="#ef7a2d" />
    </svg>
  );
}

function MandalaIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="20" fill="#0f1736" />
      <circle cx="32" cy="32" r="5" fill="#17224d" />
      {[
        0, 45, 90, 135, 180, 225, 270, 315,
      ].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 32 32)`}>
          <path d="M32 16c4 0 7 4.2 7 8.8S36 35 32 35s-7-5.4-7-10.2S28 16 32 16Z" fill={angle % 90 === 0 ? "#ef5da8" : "#8b5cf6"} opacity="0.82" />
          <path d="M32 12c6.5 0 11 6.7 11 13.6S38.5 41 32 41 21 32.5 21 25.6 25.5 12 32 12Z" fill="none" stroke="#5ea2ff" strokeOpacity="0.3" strokeWidth="1.2" />
        </g>
      ))}
      <circle cx="32" cy="32" r="20" fill="none" stroke="#223462" strokeWidth="2" />
    </svg>
  );
}

function GalleryIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="12" y="16" width="32" height="28" rx="4" fill="#eaf4ff" stroke="#aab9ca" strokeWidth="2" />
      <rect x="20" y="12" width="32" height="28" rx="4" fill="#f8fbff" stroke="#c4d0de" strokeWidth="2" />
      <circle cx="31" cy="22" r="3.4" fill="#f4c35d" />
      <path d="M24 34l6-7 5 5 5-4 8 10H24z" fill="#7abf86" />
      <path d="M20 40h32" fill="none" stroke="#d5e0ec" strokeWidth="2" />
    </svg>
  );
}

export function AppIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  switch (name) {
    case "terminal":
      return <TerminalIcon className={className} />;
    case "files":
    case "folder":
      return <FolderIcon className={className} />;
    case "pico":
      return <PicoIcon className={className} />;
    case "browser":
      return <BrowserIcon className={className} />;
    case "settings":
      return <SettingsIcon className={className} />;
    case "vscode":
      return <VsCodeIcon className={className} />;
    case "text-editor":
      return <TextEditorIcon className={className} />;
    case "document-viewer":
      return <DocumentViewerIcon className={className} />;
    case "media-player":
      return <MediaPlayerIcon className={className} />;
    case "image-viewer":
      return <ImageViewerIcon className={className} />;
    case "game-center":
      return <GameCenterIcon className={className} />;
    case "pi-snake":
      return <PiSnakeIcon className={className} />;
    case "slice-the-pie":
      return <SliceThePieIcon className={className} />;
    case "pi-defender":
      return <PiDefenderIcon className={className} />;
    case "calculator":
      return <CalculatorIcon className={className} />;
    case "task-manager":
      return <TaskManagerIcon className={className} />;
    case "usb":
      return <UsbIcon className={className} />;
    case "pi":
      return <PiIcon className={className} />;
    case "piday":
      return <PiDayIcon className={className} />;
    case "piart":
      return <PiArtIcon className={className} />;
    case "symphony":
      return <SymphonyIcon className={className} />;
    case "explorer":
      return <ExplorerIcon className={className} />;
    case "simulation":
      return <SimulationIcon className={className} />;
    case "quiz":
      return <QuizIcon className={className} />;
    case "mandala":
      return <MandalaIcon className={className} />;
    case "gallery":
      return <GalleryIcon className={className} />;
    case "choco":
      return <ChocoPieIcon className={className} />;
    case "raspberry":
      return <RaspberryIcon className={className} />;
    case "raspberry-pi5":
      return <RaspberryPi5Icon className={className} />;
    default:
      return <RaspberryIcon className={className} />;
  }
}
