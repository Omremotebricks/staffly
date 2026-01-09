"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ConfirmationModal from "./ConfirmationModal";

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmationContextType {
  askConfirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined
);

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modal, setModal] = useState<
    (ConfirmationOptions & { resolve: (val: boolean) => void }) | null
  >(null);

  const askConfirm = useCallback((options: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      setModal({ ...options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    modal?.resolve(true);
    setModal(null);
  };

  const handleCancel = () => {
    modal?.resolve(false);
    setModal(null);
  };

  return (
    <ConfirmationContext.Provider value={{ askConfirm }}>
      {children}
      {modal && (
        <ConfirmationModal
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          type={modal.type}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmationProvider");
  }
  return context;
};
