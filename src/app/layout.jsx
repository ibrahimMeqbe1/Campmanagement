import React from "react";
import { AppProvider } from "./context/AppContext";
import "../App.css";
import "../index.css";
import "../views/PerformanceDashboard.css";

export const metadata = {
  title: "نظام إدارة المخيمات | المنصة المتكاملة لإدارة العائلات والترشيحات",
  description: "لوحة التحكم الرئيسية والمنصة المتكاملة لإدارة سجلات المخيمات والعائلات والترشيحات الإغاثية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <div className="app-container" dir="rtl">
          <AppProvider>
            {children}
          </AppProvider>
        </div>
      </body>
    </html>
  );
}

