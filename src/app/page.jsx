"use client";

import React from "react";
import Dashboard from "../views/Dashboard";
import { useApp } from "./context/AppContext";

export default function HomePage() {
  const { families, nominations, user, campProfile } = useApp() || {};
  return <Dashboard families={families || []} nominations={nominations || []} user={user} campProfile={campProfile} />;
}
