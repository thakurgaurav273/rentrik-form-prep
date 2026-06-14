"use client";

import { useEffect, useRef } from "react";

// Replace with your actual AdSense publisher ID from Google AdSense dashboard.
// Format: ca-pub-XXXXXXXXXXXXXXXX
const PUBLISHER_ID = "ca-pub-5234187071328825";

const SIZE_MAP = {
  leaderboard: { width: 728, height: 90, format: "horizontal" },
  rectangle: { width: 336, height: 280, format: "rectangle" },
  banner: { width: 320, height: 50, format: "horizontal" },
} as const;

interface AdSlotProps {
  size?: keyof typeof SIZE_MAP;
  slot?: string;
  className?: string;
}

export function AdSlot({ size = "leaderboard", slot = "XXXXXXXXXX", className = "" }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle ?? []).push({});
    } catch {
      // AdSense not loaded yet — safe to ignore
    }
  }, []);

  const { width, height, format } = SIZE_MAP[size];

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ minHeight: height, maxWidth: "100%" }}
      aria-hidden
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-layout-key="-gw-3+1f-3d+2z"
      />
    </div>
  );
}
