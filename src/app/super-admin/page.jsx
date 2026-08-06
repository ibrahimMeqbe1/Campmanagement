"use client";

import React from "react";
import SuperAdmin from "../../views/SuperAdmin";
import { useApp } from "../context/AppContext";

export default function SuperAdminPage() {
  const { user, handleLogout } = useApp() || {};
  return <SuperAdmin user={user} onLogout={handleLogout} />;
}
