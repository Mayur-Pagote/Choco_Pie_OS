"use client";

import { useEffect, useState } from "react";

import { AppIcon } from "@/components/icons/pi-icons";

export function BootScreen({ durationMs }: { durationMs: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId = 0;

    const updateProgress = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(100, Math.round((elapsed / durationMs) * 100));

      setProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrameId = window.requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = window.requestAnimationFrame(updateProgress);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [durationMs]);

  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center bg-[radial-gradient(circle_at_top,#3b4251,#111827_60%)]">
      <div className="w-full max-w-md px-8 text-center text-white">
        <div className="mx-auto flex h-24 w-36 items-center justify-center rounded-[32px] border border-white/12 bg-white/8 px-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <AppIcon name="choco" className="h-14 w-28" />
        </div>
        <div className="mt-6 text-3xl font-semibold tracking-tight">Choco Pie OS</div>
        <div className="mt-2 text-sm text-white/68">Starting desktop session...</div>
        <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
          <span>Loading</span>
          <span>{progress}%</span>
        </div>
        <div
          className="mt-3 overflow-hidden rounded-full border border-white/10 bg-white/8"
          aria-label={`Boot progress ${progress}%`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          role="progressbar"
        >
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#cf4a74] via-[#f36b4d] to-[#f2c36b] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
