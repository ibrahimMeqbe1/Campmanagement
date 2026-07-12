import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isDemoMode, auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { FaUsers, FaChartPie, FaSignOutAlt, FaDatabase, FaClipboardList } from "react-icons/fa";

const Navbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isDemoMode) {
      // محاكاة تسجيل الخروج في الوضع التجريبي
      localStorage.removeItem("kareem_camp_logged_in");
      window.location.reload(); // إعادة التحميل لإلغاء حالة المستخدم في App.js
    } else {
      try {
        await signOut(auth);
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // التحقق من الصفحة النشطة لإضافة نمط مخصص
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* شعار المخيم وعنوانه */}
        <Link to="/" className="navbar-brand">
          <img src="/logo.jpg" alt="شعار مخيم كريم" className="navbar-logo" onError={(e) => e.target.style.display = 'none'} />
          <div className="navbar-titles">
            <span className="navbar-title-main">مخيم كريم</span>
            <span className="navbar-title-sub">إدارة شؤون العائلات</span>
          </div>
        </Link>

        {/* روابط التنقل (تظهر فقط إذا كان هناك مستخدم مسجل دخول) */}
        {user && (
          <div className="navbar-links">
            <Link 
              to="/" 
              className={`navbar-link ${isActive("/") ? "active" : ""}`}
            >
              <FaChartPie className="nav-icon" />
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/families" 
              className={`navbar-link ${isActive("/families") ? "active" : ""}`}
            >
              <FaUsers className="nav-icon" />
              <span>إدارة العائلات</span>
            </Link>
            <Link 
              to="/nominations" 
              className={`navbar-link ${isActive("/nominations") ? "active" : ""}`}
            >
              <FaClipboardList className="nav-icon" />
              <span>كشف الترشيحات</span>
            </Link>
          </div>
        )}

        {/* الجانب الأيسر: وضع العمل ومعلومات المستخدم وتسجيل الخروج */}
        <div className="navbar-left">
          {isDemoMode && (
            <div className="demo-badge">
              <FaDatabase className="demo-badge-icon" />
              <span>الوضع التجريبي النشط</span>
            </div>
          )}
          
          {user && (
            <div className="user-section">
              <span className="user-email">{user.username || user.email || "المشرف العام"}</span>
              <button 
                onClick={handleLogout} 
                className="btn-logout" 
                title="تسجيل الخروج"
              >
                <FaSignOutAlt className="logout-icon" />
                <span>خروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
