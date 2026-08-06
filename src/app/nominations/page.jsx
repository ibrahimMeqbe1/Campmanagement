"use client";

import React from "react";
import Nominations from "../../views/Nominations";
import { useApp } from "../context/AppContext";

export default function NominationsPage() {
  const { nominations, user, campProfile } = useApp() || {};
  return <Nominations nominations={nominations || []} user={user} campProfile={campProfile} />;
}
