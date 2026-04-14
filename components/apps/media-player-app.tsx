"use client";

import { useEffect, useMemo, useState } from "react";

const TRACKS = [
  { title: "Boot Theme", artist: "Choco Pie Ensemble", duration: 142, type: "Audio" },
  { title: "Mountain Sunrise", artist: "Desktop Demo Reel", duration: 188, type: "Video" },
  { title: "Terminal Jazz", artist: "Pi Lounge", duration: 224, type: "Audio" },
] as const;

export function MediaPlayerApp() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(70);

  const track = TRACKS[trackIndex];

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = window.setInterval(() => {
      setPosition((current) => {
        if (current >= track.duration) {
          setPlaying(false);
          return track.duration;
        }
        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [playing, track.duration]);

  useEffect(() => {
    setPosition(0);
    setPlaying(false);
  }, [trackIndex]);

  const progress = useMemo(() => (position / track.duration) * 100, [position, track.duration]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="system-app app-split-layout flex h-full bg-[linear-gradient(180deg,#121826,#1f2937)] text-white">
      <aside className="w-64 max-w-full border-r border-white/10 bg-black/20 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Library</div>
        <div className="mt-4 space-y-2">
          {TRACKS.map((entry, index) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => setTrackIndex(index)}
              className={`w-full rounded-lg px-3 py-3 text-left ${
                index === trackIndex ? "bg-white/14" : "hover:bg-white/8"
              }`}
            >
              <div className="text-sm font-semibold">{entry.title}</div>
              <div className="mt-1 text-xs text-white/60">
                {entry.artist} • {entry.type}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="rounded-[24px] bg-[linear-gradient(145deg,#243042,#111827)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
          <div className="text-xs uppercase tracking-[0.2em] text-white/50">{track.type}</div>
          <div className="mt-2 text-3xl font-semibold">{track.title}</div>
          <div className="mt-1 text-sm text-white/65">{track.artist}</div>

          <div className="mt-8 rounded-2xl bg-black/20 p-6">
            <div className="mb-4 flex items-center justify-between text-xs text-white/55">
              <span>{formatTime(position)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#f06e5d] to-[#d5536d]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setTrackIndex((current) => (current === 0 ? TRACKS.length - 1 : current - 1))}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                className="rounded-full border border-[#f3b8af] bg-[linear-gradient(180deg,#fff4ef,#ffe2d8)] px-5 py-2 text-sm font-semibold text-[#b75a52]"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => setTrackIndex((current) => (current + 1) % TRACKS.length)}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold"
              >
                Next
              </button>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Volume
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full"
              />
              <div className="mt-1 text-xs text-white/55">{volume}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
