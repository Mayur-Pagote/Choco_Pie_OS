"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { useOsStore } from "@/store/os-store";

function WifiIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? "text-[#1897e6]" : "text-[#9aa2ad]"}`} aria-hidden="true">
      <path
        d="M3.5 9.5C8.8 5.6 15.2 5.6 20.5 9.5M6.5 12.7c3.6-2.7 7.4-2.7 11 0M9.8 16c1.3-1 3.1-1 4.4 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path d="M12 19h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.8" />
    </svg>
  );
}

function BluetoothIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? "text-[#1897e6]" : "text-[#9aa2ad]"}`} aria-hidden="true">
      <path
        d="M12 4v16l5-4.5-5-3.5 5-3.5L12 4zm0 8L7 8m5 4-5 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#1897e6]" aria-hidden="true">
      <path d="M9 4v16M15 6v12" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
      <path d="M9 8h6M9 16h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${muted ? "text-[#9aa2ad]" : "text-[#1897e6]"}`} aria-hidden="true">
      <path d="M4 14h4l4 4V6l-4 4H4z" fill="currentColor" />
      {muted ? (
        <path d="M15 9l4 6M19 9l-4 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      ) : (
        <path
          d="M15 9.5a4 4 0 0 1 0 5M17.4 7.1a7.2 7.2 0 0 1 0 9.8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

function ConnectIcon({ mode }: { mode: "ethernet" | "wifi" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#1897e6]" aria-hidden="true">
      {mode === "ethernet" ? (
        <path d="M12 3l6 10H6L12 3zm-5 15h10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      ) : (
        <path d="M5 12c4.5-4 9.5-4 14 0M8 15c2.7-2.2 5.3-2.2 8 0M11.4 18c.5-.4.7-.4 1.2 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      )}
    </svg>
  );
}

function SpinnerIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? "text-[#a8a8a8]" : "text-[#c7ccd3]"}`} aria-hidden="true">
      <path
        d="M12 4a8 8 0 1 1-5.7 2.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.9"
      />
      <path d="M6.3 3.8H10v3.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#1897e6]" aria-hidden="true">
      {theme === "light" ? (
        <>
          <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 3.3v2.1M12 18.6v2.1M3.3 12h2.1M18.6 12h2.1M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      ) : (
        <path
          d="M15.8 3.9a7.8 7.8 0 1 0 4.3 13.7 8.5 8.5 0 0 1-7.7-13.7 8 8 0 0 0 3.4 0Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

function TrayButton({
  label,
  onClick,
  rounded,
  children,
}: {
  label: string;
  onClick: () => void;
  rounded: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`desktop-panel-button flex h-8 w-8 items-center justify-center ${
        rounded ? "rounded-full" : "rounded-sm"
      }`}
    >
      {children}
    </button>
  );
}

export function SystemTray() {
  const pushNotification = useOsStore((state) => state.pushNotification);
  const desktopTheme = useOsStore((state) => state.desktopTheme);
  const desktopBehavior = useOsStore((state) => state.desktopBehavior);
  const toggleDesktopTheme = useOsStore((state) => state.toggleDesktopTheme);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [muted, setMuted] = useState(false);
  const [networkMode, setNetworkMode] = useState<"ethernet" | "wifi">("ethernet");
  const [updatesActive, setUpdatesActive] = useState(true);
  const [layoutIndex, setLayoutIndex] = useState(0);

  const layouts = ["EN", "US", "DEV"];

  return (
    <div className="flex items-center gap-1">
      <TrayButton
        label="Theme"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const nextTheme = desktopTheme === "dark" ? "light" : "dark";
          toggleDesktopTheme();
          pushNotification("Theme", `${nextTheme === "dark" ? "Dark" : "Light"} mode enabled.`);
        }}
      >
        <ThemeIcon theme={desktopTheme} />
      </TrayButton>

      <TrayButton
        label="Network mode"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const next = networkMode === "ethernet" ? "wifi" : "ethernet";
          setNetworkMode(next);
          pushNotification("Network", `Primary network switched to ${next}.`);
        }}
      >
        <ConnectIcon mode={networkMode} />
      </TrayButton>

      <TrayButton
        label="Software updates"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const next = !updatesActive;
          setUpdatesActive(next);
          pushNotification(
            "Software Updater",
            next ? "Background update checks enabled." : "Background update checks paused.",
          );
        }}
      >
        <SpinnerIcon active={updatesActive} />
      </TrayButton>

      <TrayButton
        label="Bluetooth"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const next = !bluetoothEnabled;
          setBluetoothEnabled(next);
          pushNotification("Bluetooth", next ? "Bluetooth enabled." : "Bluetooth disabled.");
        }}
      >
        <BluetoothIcon active={bluetoothEnabled} />
      </TrayButton>

      <TrayButton
        label="Keyboard layout"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const next = (layoutIndex + 1) % layouts.length;
          setLayoutIndex(next);
          pushNotification("Keyboard Layout", `Active layout: ${layouts[next]}.`);
        }}
      >
        <div className="relative">
          <KeyboardIcon />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#4a5b70]">
            {layouts[layoutIndex]}
          </span>
        </div>
      </TrayButton>

      <TrayButton
        label="Volume"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const next = !muted;
          setMuted(next);
          pushNotification("Volume", next ? "Audio muted." : "Audio restored.");
        }}
      >
        <VolumeIcon muted={muted} />
      </TrayButton>

      <TrayButton
        label="Wi-Fi"
        rounded={desktopBehavior.roundedPanelControls}
        onClick={() => {
          const next = !wifiEnabled;
          setWifiEnabled(next);
          pushNotification("Wi-Fi", next ? "Wi-Fi connected to ChocoNet." : "Wi-Fi disconnected.");
        }}
      >
        <WifiIcon active={wifiEnabled} />
      </TrayButton>
    </div>
  );
}
