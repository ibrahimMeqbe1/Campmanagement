"use client";

import React, { useState, useEffect } from "react";

export const AnimatedNumber = ({ value, duration = 1200, decimals = 0, formatter }) => {
  const [current, setCurrent] = useState(0);
  const target = typeof value === "number" ? value : (parseFloat(value) || 0);

  useEffect(() => {
    if (isNaN(target) || target === 0) {
      setCurrent(0);
      return;
    }

    let startTimestamp = null;
    const startValue = 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // منحنى سلاسة يبدأ سريعاً وينتهي بنعومة فخمة (Ease-Out Cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = startValue + (target - startValue) * easeOut;
      
      setCurrent(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [target, duration]);

  if (formatter) {
    return <span>{formatter(current)}</span>;
  }

  const isFloat = decimals > 0 || (target % 1 !== 0);
  const formattedVal = isFloat 
    ? current.toFixed(decimals || 1) 
    : Math.round(current).toLocaleString("ar-EG");

  return <span>{formattedVal}</span>;
};

export const AnimatedDonut = ({ percent, color, label, subText, textColor = "#ffffff" }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const target = Math.min(100, Math.max(0, parseFloat(percent) || 0));

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1400, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = target * easeOut;

      setAnimatedPercent(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setAnimatedPercent(target);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [target]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%", maxWidth: "220px" }}>
      <div 
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: `conic-gradient(${color} 0% ${animatedPercent.toFixed(1)}%, #1e293b ${animatedPercent.toFixed(1)}% 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 20px ${color}33`,
          transition: "transform 0.3s ease"
        }}
      >
        <div 
          style={{
            width: "92px",
            height: "92px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "900",
            color: "#0f172a",
            fontFamily: "sans-serif"
          }}
        >
          <AnimatedNumber value={percent} decimals={0} />%
        </div>
      </div>
      <div 
        style={{
          width: "100%",
          backgroundColor: color,
          color: textColor,
          padding: "10px 16px",
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "0.92rem",
          textAlign: "center",
          boxShadow: `0 4px 10px ${color}40`
        }}
      >
        {label}
      </div>
      <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#64748b", background: "#ffffff", padding: "4px 12px", borderRadius: "20px", border: "1px solid #cbd5e1" }}>
        {subText}
      </span>
    </div>
  );
};

export default AnimatedNumber;
