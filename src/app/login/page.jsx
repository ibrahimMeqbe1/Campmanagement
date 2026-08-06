"use client";

import React from "react";
import Login from "../../views/Login";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const { setUser } = useApp() || {};
  return <Login setUser={setUser} />;
}
