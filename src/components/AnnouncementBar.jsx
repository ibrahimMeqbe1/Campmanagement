"use client";

import React, { useState, useEffect } from "react";
import { FaBullhorn, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { getAnnouncement } from "../services/campService";

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);

  const fetchAnnouncement = () => {
    getAnnouncement().then(data => {
      setAnnouncement(data);
    });
  };

  useEffect(() => {
    fetchAnnouncement();

    const handleUpdate = () => fetchAnnouncement();
    window.addEventListener("announcementUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const interval = setInterval(fetchAnnouncement, 3000);

    return () => {
      window.removeEventListener("announcementUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  if (!announcement || !announcement.isActive || !announcement.text) {
    return null;
  }

  let bgGradient = "linear-gradient(90deg, #7f1d1d, #991b1b)"; // urgent / red
  let labelBg = "#450a0a";
  let labelText = "📣 تعميم عاجل";
  let Icon = FaBullhorn;

  if (announcement.type === "warning") {
    bgGradient = "linear-gradient(90deg, #78350f, #92400e)"; // gold/amber / warning
    labelBg = "#451a03";
    labelText = "⚠️ تنبيه إداري";
    Icon = FaExclamationTriangle;
  } else if (announcement.type === "info") {
    bgGradient = "linear-gradient(90deg, #0f5132, #1e3d59)"; // deep emerald / info
    labelBg = "#062c1b";
    labelText = "🏛️ بيان رسمي";
    Icon = FaInfoCircle;
  }

  return (
    <div 
      className="announcement-bar no-print" 
      style={{
        background: bgGradient,
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        padding: "8px 20px",
        fontSize: "0.92rem",
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        overflow: "hidden",
        position: "relative",
        zIndex: 999,
        borderBottom: "1px solid rgba(255,255,255,0.15)"
      }}
    >
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: labelBg,
          color: "#ffffff",
          padding: "4px 14px",
          borderRadius: "50px",
          whiteSpace: "nowrap",
          marginLeft: "15px",
          fontSize: "0.82rem",
          fontWeight: "700",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0
        }}
      >
        <Icon style={{ fontSize: "0.85rem" }} />
        <span>{labelText}</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ffffff" }}>
          {announcement.text}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
