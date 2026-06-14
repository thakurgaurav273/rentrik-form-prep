import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "main" | "section" | "article";
}

export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-5xl px-4 sm:px-6 ${className}`}>
      {children}
    </Tag>
  );
}
