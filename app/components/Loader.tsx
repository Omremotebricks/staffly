"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  label,
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`
            ${sizeClasses[size]} 
            rounded-full border-gray-100
          `}
        />
        {/* Animated spinner */}
        <div
          className={`
            ${sizeClasses[size]} 
            absolute top-0 left-0 rounded-full border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin
          `}
        />
        {/* Subtle dot in middle for XL size */}
        {size === "xl" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600/20 rounded-full" />
        )}
      </div>
      {label && (
        <p className="text-gray-500 font-medium animate-pulse text-sm">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 w-full">
      {spinner}
    </div>
  );
};

export default Loader;
