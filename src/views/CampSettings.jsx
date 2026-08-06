"use client";

import React, { useState, useEffect } from "react";
import { 
  FaCampground, 
  FaUser, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaImage, 
  FaSave, 
  FaTrash, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import { updateCampProfile } from "../services/campService";

const CampSettings = ({ user, campProfile, setCampProfile }) => {
  const [formData, setFormData] = useState({
    name: "",
    managerName: "",
    managerPhone: "",
    address: "",
    logoUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  // تعبئة البيانات عند فتح الصفحة
  useEffect(() => {
    if (campProfile) {
      setFormData({
        name: campProfile.name || "",
        managerName: campProfile.managerName || "",
        managerPhone: campProfile.managerPhone || "",
        address: campProfile.address || "",
        logoUrl: campProfile.logoUrl || ""
      });
      setLogoPreview(campProfile.logoUrl || "");
    }
  }, [campProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // معالجة اختيار ملف الشعار وتحويله لـ Base64
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من حجم الملف (أقل من 300 كيلوبايت لضمان الحفظ السليم في Firestore)
    if (file.size > 300 * 1024) {
      setError("حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 300 كيلوبايت.");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        logoUrl: reader.result
      }));
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // إزالة الشعار الحالي
  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logoUrl: ""
    }));
    setLogoPreview("");
  };

  // حفظ التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    if (!formData.name.trim()) {
      setError("اسم المخيم مطلوب ولا يمكن تركه فارغاً.");
      setLoading(false);
      return;
    }

    try {
      const res = await updateCampProfile(user.campId, formData);
      if (res.success) {
        setSuccess("تم تحديث إعدادات المخيم بنجاح!");
        // تحديث الحالة العامة للتطبيق
        setCampProfile(prev => ({
          ...prev,
          ...formData
        }));
      } else {
        setError(res.error || "فشل تحديث الإعدادات.");
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع أثناء حفظ الإعدادات.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="families-page-container">
      {/* الترويسة الرئيسية */}
      <header className="page-header">
        <div className="page-header-info">
          <h1>⚙️ إدارة إعدادات المخيم</h1>
          <p>تخصيص الهوية البصرية واسم المخيم، المسؤول الحالي، وأرقام التواصل التي ستظهر في الكشوفات والتقارير المطبوعة.</p>
        </div>
      </header>

      {/* المحتوى الرئيسي للنموذج */}
      <div className="settings-content-wrapper" style={{
        maxWidth: "800px",
        margin: "2rem auto",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "2rem",
        boxShadow: "var(--shadow-md)"
      }}>
        {success && (
          <div className="login-error-badge mb-4" style={{ 
            backgroundColor: "rgba(25, 135, 84, 0.1)", 
            color: "var(--success-color)", 
            borderColor: "rgba(25, 135, 84, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 15px",
            borderRadius: "var(--radius-sm)"
          }}>
            <FaCheckCircle /> {success}
          </div>
        )}

        {error && (
          <div className="login-error-badge mb-4" style={{ 
            backgroundColor: "var(--danger-light)", 
            color: "var(--danger-color)", 
            borderColor: "rgba(220, 53, 69, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 15px",
            borderRadius: "var(--radius-sm)"
          }}>
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            {/* قسم إدارة الشعار البصري */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "20px", 
              flexWrap: "wrap",
              background: "#fafafa",
              padding: "15px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ position: "relative" }}>
                <img 
                  src={logoPreview || "/logo.jpg"} 
                  alt="شعار المخيم" 
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    borderRadius: "50%",
                    border: "3px solid var(--secondary-color)",
                    backgroundColor: "white"
                  }}
                  onError={(e) => {
                    e.target.src = "/logo.jpg";
                  }}
                />
                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      backgroundColor: "var(--danger-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "var(--shadow-sm)"
                    }}
                    title="إزالة الشعار"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <h3 style={{ fontSize: "1.1rem", color: "var(--primary-dark)", marginBottom: "8px" }}>شعار المخيم الرسمي</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                  سيتم عرض الشعار في شريط التنقل العلوي للوحة التحكم وفي أعلى كشوفات الطباعة وتصدير PDF. (يفضل أن تكون الصورة دائرية أو مربعة ذات خلفية شفافة أو بيضاء).
                </p>
                <label className="btn btn-secondary" style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}>
                  <FaImage /> اختيار صورة الشعار
                  <input 
                    type="file" 
                    onChange={handleLogoChange} 
                    accept="image/*" 
                    style={{ display: "none" }} 
                  />
                </label>
              </div>
            </div>

            {/* الحقول النصية للإعدادات */}
            <div className="form-row">
              <div className="form-group col-6">
                <label htmlFor="name"><FaCampground className="form-icon" /> اسم المخيم الرسمي</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: مخيم كريم"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="managerName"><FaUser className="form-icon" /> اسم المندوب / المسؤول</label>
                <input
                  type="text"
                  id="managerName"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  placeholder="الاسم الثلاثي أو الرباعي للمسؤول"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label htmlFor="managerPhone"><FaPhoneAlt className="form-icon" /> رقم الجوال للتواصل</label>
                <input
                  type="text"
                  id="managerPhone"
                  name="managerPhone"
                  value={formData.managerPhone}
                  onChange={handleChange}
                  placeholder="مثال: 0599XXXXXX"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", textAlign: "left", direction: "ltr" }}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="address"><FaMapMarkerAlt className="form-icon" /> عنوان / موقع المخيم</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="مثال: حي القصاصيب - جباليا"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}
                />
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              marginTop: "15px",
              borderTop: "1px solid var(--border-color)",
              paddingTop: "20px"
            }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px",
                  fontSize: "1rem",
                  padding: "10px 20px"
                }}
              >
                {loading ? <FaSpinner className="spinner" /> : <FaSave />}
                <span>حفظ التعديلات والإعدادات</span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CampSettings;
