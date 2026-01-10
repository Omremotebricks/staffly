"use client";

import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-4xl",
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div
          className={`relative transform overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] text-left shadow-2xl transition-all duration-300 sm:my-8 w-full ${maxWidth} ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 border-b border-[var(--color-border)] bg-[var(--color-bg-main)]/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
