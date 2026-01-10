"use client";

import React from "react";
import AppShell from "../components/hrms/AppShell";
import FormsManagement from "../components/FormsManagement";
import FormsList from "../components/FormsList";
import { useAuth } from "../lib/auth";

export default function FormsPage() {
  const { user } = useAuth();

  return (
    <AppShell title="Enterprise Forms">
      <div className="max-w-7xl mx-auto">
        {user?.role === "admin" ? <FormsManagement /> : <FormsList />}
      </div>
    </AppShell>
  );
}
