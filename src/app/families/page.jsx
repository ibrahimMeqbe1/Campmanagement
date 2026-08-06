"use client";

import React from "react";
import Families from "../../views/Families";
import { useApp } from "../context/AppContext";

export default function FamiliesPage() {
  const { families, user, campProfile } = useApp() || {};
  return <Families families={families || []} user={user} campProfile={campProfile} />;
}
