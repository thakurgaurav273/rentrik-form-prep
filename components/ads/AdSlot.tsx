interface AdSlotProps {
  className?: string;
  size?: "banner" | "rectangle" | "leaderboard";
}

// Renders nothing in MVP. Space reserved for future AdSense without CLS.
export function AdSlot(_props: AdSlotProps) {
  return null;
}
