import React, { useState } from "react";
import { Link } from "react-router-dom";
import { exportToExcel, exportNominationsToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPDF";
import { addFamily, importDefaultFamiliesToFirestore } from "../services/familyService";
import { importDefaultNominationsToFirestore } from "../services/nominationService";
import { isDemoMode } from "../firebase/config";
import FamilyForm from "../components/FamilyForm";
import { 
  FaUsers, 
  FaUserFriends, 
  FaPlus, 
  FaFileExcel, 
  FaFilePdf, 
  FaArrowLeft, 
  FaHome,
  FaClipboardList
} from "react-icons/fa";

const Dashboard = ({ families, nominations = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importingNom, setImportingNom] = useState(false);

  // إحصائيات المخيم
  const totalFamilies = families.length;
  const totalMembers = families.reduce((sum, f) => sum + (parseInt(f.membersCount) || 0), 0);
  const avgFamilySize = totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : 0;

  // إحصائيات الترشيحات
  const totalNominations = nominations.length;
  const totalNominationMembers = nominations.reduce((sum, n) => sum + (parseInt(n.membersCount) || 0), 0);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleImport = async () => {
    setImporting(true);
    showNotification("جاري استيراد 121 عائلة إلى Firestore، يرجى الانتظار...", "info");
    const res = await importDefaultFamiliesToFirestore();
    setImporting(false);
    if (res.success) {
      showNotification("تم استيراد كشف الـ 121 عائلة بنجاح إلى Firestore!");
    } else {
      showNotification("فشل الاستيراد: " + res.error, "error");
    }
  };

  const handleImportNominations = async () => {
    setImportingNom(true);
    showNotification("جاري استيراد 126 عائلة مرشحة إلى Firestore، يرجى الانتظار...", "info");
    const res = await importDefaultNominationsToFirestore();
    setImportingNom(false);
    if (res.success) {
      showNotification("تم استيراد كشف الـ 126 عائلة مرشحة بنجاح إلى Firestore!");
    } else {
      showNotification("فشل الاستيراد: " + res.error, "error");
    }
  };

  const handleAddFamily = async (formData) => {
    try {
      await addFamily(formData);
      setIsFormOpen(false);
      showNotification("تم إضافة العائلة بنجاح إلى قاعدة البيانات");
    } catch (error) {
      console.error("Error adding family:", error);
      showNotification("حدث خطأ أثناء إضافة العائلة", "error");
    }
  };

  // جلب آخر 3 عائلات مضافة لعرضها كـ Quick Overview
  const latestFamilies = [...families].reverse().slice(0, 3);

  return (
    <div className="dashboard-container">
      {/* التنبيهات المنبثقة */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* الترويسة الرئيسية للوحة التحكم */}
      <header className="dashboard-header">
        <div className="welcome-section">
          <img src="/logo.jpg" alt="شعار مخيم كريم" className="dashboard-logo" onError={(e) => e.target.style.display = 'none'} />
          <div>
            <h1>مخيم كريم العام</h1>
            <p>لوحة التحكم الرئيسية وإحصائيات النازحين</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary">
            <FaPlus /> إضافة عائلة جديدة
          </button>
        </div>
      </header>

      {/* بنر الاستيراد لقاعدة البيانات السحابية */}
      {!isDemoMode && (families.length === 0 || nominations.length === 0) && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "1rem"
        }}>
          {families.length === 0 && (
            <div style={{
              background: "var(--secondary-light)",
              border: "2px dashed var(--secondary-color)",
              padding: "1.5rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px"
            }}>
              <div>
                <h3 style={{ color: "var(--primary-dark)", margin: "0 0 5px 0" }}>☁️ تم الاتصال بـ Firebase بنجاح!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  سجل عائلات المخيم في Firestore فارغ حالياً. يمكنك استيراد كشف الـ 121 عائلة الافتراضي بالكامل بضغطة زر واحدة.
                </p>
              </div>
              <button 
                onClick={handleImport} 
                className="btn" 
                style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                disabled={importing}
              >
                {importing ? "جاري استيراد البيانات..." : "استيراد 121 عائلة الآن"}
              </button>
            </div>
          )}

          {nominations.length === 0 && (
            <div style={{
              background: "var(--secondary-light)",
              border: "2px dashed #b89647",
              padding: "1.5rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px"
            }}>
              <div>
                <h3 style={{ color: "var(--primary-dark)", margin: "0 0 5px 0" }}>📋 تم الاتصال بـ Firebase بنجاح!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  سجل الترشيحات (المرشحين الجدد) في Firestore فارغ حالياً. يمكنك استيراد كشف الـ 126 عائلة مرشحة بالكامل بضغطة زر.
                </p>
              </div>
              <button 
                onClick={handleImportNominations} 
                className="btn" 
                style={{ backgroundColor: "#b89647", color: "white" }}
                disabled={importingNom}
              >
                {importingNom ? "جاري استيراد البيانات..." : "استيراد 126 عائلة مرشحة الآن"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* كروت الإحصائيات الفخمة */}
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {/* كرت عدد العائلات */}
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-title">العائلات المسجلة بالمخيم</span>
            <strong className="stat-value">{totalFamilies}</strong>
            <span className="stat-desc">عائلة نازحة مستفيدة</span>
          </div>
        </div>

        {/* كرت عدد الأفراد */}
        <div className="stat-card">
          <div className="stat-icon-wrapper gold">
            <FaUserFriends className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-title">إجمالي أفراد المخيم</span>
            <strong className="stat-value">{totalMembers}</strong>
            <span className="stat-desc">فرد مستفيد من الإغاثة</span>
          </div>
        </div>

        {/* كرت عدد عائلات الترشيحات */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FaClipboardList className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-title">العائلات المرشحة</span>
            <strong className="stat-value">{totalNominations}</strong>
            <span className="stat-desc">عائلة في كشف الترشيحات</span>
          </div>
        </div>

        {/* كرت عدد أفراد الترشيحات */}
        <div className="stat-card">
          <div className="stat-icon-wrapper gold" style={{ background: "rgba(184, 150, 71, 0.15)" }}>
            <FaUserFriends className="stat-icon" style={{ color: "#b89647" }} />
          </div>
          <div className="stat-details">
            <span className="stat-title">إجمالي أفراد الترشيحات</span>
            <strong className="stat-value" style={{ color: "#b89647" }}>{totalNominationMembers}</strong>
            <span className="stat-desc">أفراد مرشحين للخدمات</span>
          </div>
        </div>

        {/* كرت متوسط أفراد العائلة */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue" style={{ background: "rgba(13, 110, 253, 0.1)" }}>
            <FaHome className="stat-icon" style={{ color: "#0d6efd" }} />
          </div>
          <div className="stat-details">
            <span className="stat-title">متوسط حجم العائلة</span>
            <strong className="stat-value" style={{ color: "#0d6efd" }}>{avgFamilySize}</strong>
            <span className="stat-desc">أفراد لكل أسرة</span>
          </div>
        </div>
      </section>

      {/* أزرار العمليات السريعة وتصدير الكشوفات */}
      <section className="quick-actions-section">
        <div className="section-title">
          <h2>📊 العمليات السريعة وتصدير التقارير</h2>
        </div>
        
        <h3 style={{ fontSize: "1.05rem", color: "var(--primary-dark)", margin: "1rem 0 0.5rem 0", fontWeight: "700" }}>📋 كشف عائلات المخيم العام:</h3>
        <div className="actions-buttons-grid">
          <button 
            onClick={() => exportToExcel(families)} 
            className="action-btn excel"
            disabled={families.length === 0}
          >
            <FaFileExcel className="action-btn-icon" />
            <div className="action-btn-text">
              <h3>تصدير كشف Excel</h3>
              <p>تحميل ملف كشف عائلات مخيم كريم.xlsx</p>
            </div>
          </button>

          <button 
            onClick={() => exportToPDF(families, "families")} 
            className="action-btn pdf"
            disabled={families.length === 0}
          >
            <FaFilePdf className="action-btn-icon" />
            <div className="action-btn-text">
              <h3>تصدير كشف PDF</h3>
              <p>طباعة الكشف وتوليد تقرير جاهز للتوقيع</p>
            </div>
          </button>
        </div>

        <h3 style={{ fontSize: "1.05rem", color: "var(--primary-dark)", margin: "1.5rem 0 0.5rem 0", fontWeight: "700" }}>📝 كشف ترشيحات المخيم المفصل:</h3>
        <div className="actions-buttons-grid">
          <button 
            onClick={() => exportNominationsToExcel(nominations)} 
            className="action-btn excel"
            style={{ borderColor: "#b89647" }}
            disabled={nominations.length === 0}
          >
            <FaFileExcel className="action-btn-icon" style={{ color: "#b89647" }} />
            <div className="action-btn-text">
              <h3>تصدير ترشيحات Excel</h3>
              <p>تحميل ملف كشف ترشيحات مخيم كريم.xlsx</p>
            </div>
          </button>

          <button 
            onClick={() => exportToPDF(nominations, "nominations")} 
            className="action-btn pdf"
            style={{ borderColor: "#b89647" }}
            disabled={nominations.length === 0}
          >
            <FaFilePdf className="action-btn-icon" style={{ color: "#b89647" }} />
            <div className="action-btn-text">
              <h3>تصدير ترشيحات PDF</h3>
              <p>طباعة الترشيحات وتوليد تقرير مفصل جاهز للتوقيع</p>
            </div>
          </button>
        </div>
      </section>

      {/* جدول نظرة سريعة على آخر العائلات المضافة */}
      <section className="latest-families-section">
        <div className="latest-header">
          <h2>🕒 آخر العائلات المضافة حديثاً</h2>
          <Link to="/families" className="btn-link">
            عرض وإدارة جميع العائلات <FaArrowLeft />
          </Link>
        </div>

        <div className="table-responsive shadow-sm">
          {latestFamilies.length > 0 ? (
            <table className="latest-table">
              <thead>
                <tr>
                  <th>اسم رب الأسرة</th>
                  <th>رقم الهاتف</th>
                  <th>مكان السكن</th>
                  <th>عدد الأفراد</th>
                  <th>تاريخ الإضافة</th>
                </tr>
              </thead>
              <tbody>
                {latestFamilies.map((f) => (
                  <tr key={f.id}>
                    <td><strong>{f.name}</strong></td>
                    <td>{f.phone}</td>
                    <td>{f.location}</td>
                    <td><span className="badge-members">{f.membersCount} أفراد</span></td>
                    <td className="date-td">{new Date(f.createdAt).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-latest">
              <p>لا توجد عائلات مسجلة حالياً في النظام.</p>
              <button onClick={() => setIsFormOpen(true)} className="btn btn-secondary btn-sm">
                أضف أول عائلة الآن
              </button>
            </div>
          )}
        </div>
      </section>

      {/* نموذج الإضافة */}
      <FamilyForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleAddFamily}
        family={null}
      />
    </div>
  );
};

export default Dashboard;
