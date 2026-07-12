import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isDemoMode, auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { subscribeFamilies } from "./services/familyService";
import { subscribeNominations } from "./services/nominationService";

// استيراد المكونات والصفحات
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Families from "./pages/Families";
import Nominations from "./pages/Nominations";
import Login from "./pages/Login";
import PrintPage from "./pages/PrintPage";
import DeveloperModal from "./components/DeveloperModal";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [families, setFamilies] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);

  // مراقبة حالة المصادقة (تسجيل الدخول)
  useEffect(() => {
    let unsubscribeAuth;

    if (isDemoMode) {
      // التحقق من الجلسة في الوضع التجريبي عبر LocalStorage
      const savedUser = localStorage.getItem("kareem_camp_logged_in");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    } else {
      // التحقق الفعلي عبر Firebase Authentication
      unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // جلب بيانات العائلات والترشيحات والاشتراك في التحديثات الفورية بعد تسجيل الدخول
  useEffect(() => {
    let unsubscribeFamilies;
    let unsubscribeNominations;

    if (user) {
      unsubscribeFamilies = subscribeFamilies((data) => {
        setFamilies(data);
      });
      unsubscribeNominations = subscribeNominations((data) => {
        setNominations(data);
      });
    } else {
      setFamilies([]);
      setNominations([]);
    }

    return () => {
      if (unsubscribeFamilies) unsubscribeFamilies();
      if (unsubscribeNominations) unsubscribeNominations();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>جاري تحميل البيانات وتأمين الاتصال...</p>
      </div>
    );
  }

  // مكون حماية المسارات (شرط تسجيل الدخول)
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return (
      <>
        <Navbar user={user} />
        <main className="main-content-layout">
          {children}
        </main>
        <footer className="app-footer no-print">
          <p>© {new Date().getFullYear()} مخيم كريم - كافة الحقوق محفوظة</p>
          <p>
            تم تطوير الموقع بواسطة
            <button onClick={() => setShowDeveloperModal(true)} className="developer-link-btn">
              Eng: Ibrahim Meqbel
            </button>
          </p>
        </footer>
      </>
    );
  };

  return (
    <Router>
      <div className="app-container" dir="rtl">
        <Routes>
          {/* مسار تسجيل الدخول */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} 
          />

          {/* مسار لوحة التحكم الرئيسي */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard families={families} nominations={nominations} />
              </ProtectedRoute>
            } 
          />

          {/* مسار إدارة العائلات */}
          <Route 
            path="/families" 
            element={
              <ProtectedRoute>
                <Families families={families} />
              </ProtectedRoute>
            } 
          />

          {/* مسار إدارة الترشيحات */}
          <Route 
            path="/nominations" 
            element={
              <ProtectedRoute>
                <Nominations nominations={nominations} />
              </ProtectedRoute>
            } 
          />

          {/* مسار الطباعة المخصص */}
          <Route path="/print" element={<PrintPage />} />

          {/* إعادة توجيه أي مسار خاطئ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {showDeveloperModal && (
          <DeveloperModal onClose={() => setShowDeveloperModal(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
