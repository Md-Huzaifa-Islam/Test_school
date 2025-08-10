"use client";

import React from "react";
import { clsx } from "clsx";

/**
 * Loading spinner component with different sizes and colors
 */
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colorClasses = {
  primary: "text-primary-600",
  secondary: "text-secondary-600",
  white: "text-white",
};

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2 border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
