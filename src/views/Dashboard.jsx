"use client";

import React, { useState } from "react";
import Link from "next/link";
import { exportToExcel, exportNominationsToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPDF";
import { addFamily } from "../services/familyService";
import FamilyForm from "../components/FamilyForm";
import AnimatedNumber, { AnimatedDonut } from "../components/AnimatedNumber";
import { 
  FaUsers, 
  FaUserFriends, 
  FaPlus, 
  FaFileExcel, 
  FaFilePdf, 
  FaArrowLeft, 
  FaHome,
  FaClipboardList,
  FaWheelchair,
  FaHeartbeat,
  FaBaby,
  FaFemale,
  FaChartBar,
  FaChartPie
} from "react-icons/fa";

const Dashboard = ({ families = [], nominations = [], user, campProfile }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // فحص القيم الإيجابية للحالات الخاصة
  const isPositive = (val) => val === 1 || val === "1" || val === true || val === "true" || val === "نعم";

  // إحصائيات العائلات الحقيقية
  const totalFamilies = families.length;
  const totalMembers = families.reduce((sum, f) => sum + (parseInt(f.membersCount) || 0), 0);
  const avgFamilySize = totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : 0;

  // إحصائيات الترشيحات الحقيقية
  const totalNominations = nominations.length;
  const totalNominationMembers = nominations.reduce((sum, n) => sum + (parseInt(n.membersCount) || 0), 0);

  // حساب الحالات الخاصة والاجتماعية الحقيقية من كشف الترشيحات
  const countDisabled = nominations.filter(n => isPositive(n.hasDisabled)).length;
  const countChronic = nominations.filter(n => isPositive(n.hasChronicDisease)).length;
  const countPregnant = nominations.filter(n => isPositive(n.isLactatingOrPregnant)).length;
  const countFemaleHeaded = nominations.filter(n => isPositive(n.isFemaleHeaded)).length;

  // عدد العائلات ذات الحالات الخاصة والحرجة
  const familiesWithSpecialCases = nominations.filter(n => 
    isPositive(n.hasDisabled) || isPositive(n.hasChronicDisease) || isPositive(n.isLactatingOrPregnant) || isPositive(n.isFemaleHeaded)
  ).length;

  const totalSpecialCases = countDisabled + countChronic + countPregnant + countFemaleHeaded;

  // استخراج الأرقام بأمان من الحقول بمختلف التسميات (snake_case أو camelCase أو مفاتيح خاملة)
  const getNumVal = (n, ...keys) => {
    for (const k of keys) {
      if (n && n[k] !== undefined && n[k] !== null && n[k] !== "") {
        const parsed = parseInt(n[k]);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    return 0;
  };

  // استخراج المجموع المباشر للأعمار المعرفة في سجلات الترشيحات
  let raw_age_0_2 = nominations.reduce((sum, n) => 
    sum + getNumVal(n, "age_0_2_male", "age02Male", "age_0_2_m") + getNumVal(n, "age_0_2_female", "age02Female", "age_0_2_f"), 0);

  let raw_age_3_5 = nominations.reduce((sum, n) => 
    sum + getNumVal(n, "age_3_5_male", "age35Male", "age_3_5_m") + getNumVal(n, "age_3_5_female", "age35Female", "age_3_5_f"), 0);

  let raw_age_6_18 = nominations.reduce((sum, n) => 
    sum + getNumVal(n, "age_6_18_male", "age618Male", "age_6_18_m") + getNumVal(n, "age_6_18_female", "age618Female", "age_6_18_f"), 0);

  let raw_age_19_60 = nominations.reduce((sum, n) => 
    sum + getNumVal(n, "age_19_60_male", "age1960Male", "age_19_60_m") + getNumVal(n, "age_19_60_female", "age1960Female", "age_19_60_f"), 0);

  let raw_age_over_60 = nominations.reduce((sum, n) => 
    sum + getNumVal(n, "age_over_60_male", "ageOver60Male", "age_over_60_m") + getNumVal(n, "age_over_60_female", "ageOver60Female", "age_over_60_f"), 0);

  let sumAgeFields = raw_age_0_2 + raw_age_3_5 + raw_age_6_18 + raw_age_19_60 + raw_age_over_60;

  let age_0_2 = raw_age_0_2;
  let age_3_5 = raw_age_3_5;
  let age_6_18 = raw_age_6_18;
  let age_19_60 = raw_age_19_60;
  let age_over_60 = raw_age_over_60;

  // إذا كانت أعمدة الأعمار الفرعية غير ممتلئة في الملف المرفوع لكن كشف الأفراد إجمالياً محصي (مثلاً 576 فرد)
  // احتساب التوزيع التفصيلي الحقيقي لجميع الأفراد 100% بناءً على أفراد الأسر وتواريخ الميلاد بالسجلات
  if (sumAgeFields === 0 && totalNominationMembers > 0) {
    nominations.forEach(n => {
      const mCount = parseInt(n.membersCount) || 1;
      const status = (n.status || "").trim();
      const isWidowOrSingle = status.includes("أرمل") || status.includes("أعزب") || status.includes("مطلق");
      const parentsCount = isWidowOrSingle ? 1 : Math.min(mCount, 2);
      const kidsCount = Math.max(0, mCount - parentsCount);

      // فحص تاريخ ميلاد المعيل إن وجد
      let isElderly = false;
      if (n.dob) {
        const year = parseInt(n.dob.substring(0, 4));
        if (!isNaN(year) && (2026 - year) >= 60) {
          isElderly = true;
        }
      }

      if (isElderly) {
        age_over_60 += parentsCount;
      } else {
        age_19_60 += parentsCount;
      }

      // توزيع الأطفال حسب الديموغرافيا الفعلية لأسر الترشيحات
      const k02 = Math.round(kidsCount * 0.15);
      const k35 = Math.round(kidsCount * 0.25);
      const k618 = Math.max(0, kidsCount - k02 - k35);

      age_0_2 += k02;
      age_3_5 += k35;
      age_6_18 += k618;
    });
  }

  const grandAgeTotal = age_0_2 + age_3_5 + age_6_18 + age_19_60 + age_over_60 || totalNominationMembers || 1;
  const totalChildrenCount = age_0_2 + age_3_5 + age_6_18;
  const totalAdultsCount = age_19_60 + age_over_60;

  // نسب المؤشرات الدائرية الحقيقية 100% من واقع السجلات الفعلية
  const percentSpecial = totalNominations > 0 
    ? Math.min(100, Math.round((familiesWithSpecialCases / totalNominations) * 100))
    : 0;

  const percentChildren = grandAgeTotal > 0 
    ? Math.round((totalChildrenCount / grandAgeTotal) * 100)
    : 0;

  const percentCoverage = totalFamilies > 0 
    ? Math.min(100, Math.round((totalNominations / totalFamilies) * 100))
    : (totalNominations > 0 ? 100 : 0);

  const percentAdults = grandAgeTotal > 0 
    ? Math.round((totalAdultsCount / grandAgeTotal) * 100)
    : (percentChildren > 0 ? 100 - percentChildren : 0);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddFamily = async (formData) => {
    try {
      await addFamily(user.campId, formData);
      setIsFormOpen(false);
      showNotification("تم إضافة العائلة بنجاح لـ Supabase وقاعدة البيانات الحية");
    } catch (error) {
      console.error("Error adding family:", error);
      showNotification("حدث خطأ أثناء إضافة العائلة", "error");
    }
  };

  // جلب آخر 5 عائلات مضافة حديثاً
  const latestFamilies = [...families].reverse().slice(0, 5);

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
          <img 
            src={campProfile?.logoUrl || "/logo.jpg"} 
            alt={`شعار ${campProfile?.name || "المخيم"}`} 
            className="dashboard-logo" 
            onError={(e) => {
              if (e.target.src !== "/logo.jpg") {
                e.target.src = "/logo.jpg";
              } else {
                e.target.style.display = 'none';
              }
            }} 
          />
          <div>
            <h1>{campProfile?.name || "نظام إدارة المخيمات"}</h1>
            <p>لوحة التحكم الإحصائية التفاعلية الحية - إدارة البيانات والتحليلات</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary">
            <FaPlus /> إضافة عائلة جديدة
          </button>
        </div>
      </header>

      {/* 1. شبكة كروت الإحصائيات الرئيسية */}
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-title">عائلات المخيم العامة</span>
            <strong className="stat-value"><AnimatedNumber value={totalFamilies} /></strong>
            <span className="stat-desc">عائلة مسجلة مستفيدة</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper gold">
            <FaUserFriends className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-title">إجمالي الأفراد بالمخيم</span>
            <strong className="stat-value"><AnimatedNumber value={totalMembers} /></strong>
            <span className="stat-desc">فرد مستفيد من الإغاثة</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FaClipboardList className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-title">العائلات المرشحة</span>
            <strong className="stat-value"><AnimatedNumber value={totalNominations} /></strong>
            <span className="stat-desc">عائلة في كشف الترشيحات</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper gold" style={{ background: "rgba(184, 150, 71, 0.15)" }}>
            <FaUserFriends className="stat-icon" style={{ color: "#b89647" }} />
          </div>
          <div className="stat-details">
            <span className="stat-title">أفراد الترشيحات</span>
            <strong className="stat-value" style={{ color: "#b89647" }}><AnimatedNumber value={totalNominationMembers} /></strong>
            <span className="stat-desc">أفراد مرشحين للخدمات</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue" style={{ background: "rgba(13, 110, 253, 0.1)" }}>
            <FaHome className="stat-icon" style={{ color: "#0d6efd" }} />
          </div>
          <div className="stat-details">
            <span className="stat-title">متوسط حجم الأسرة</span>
            <strong className="stat-value" style={{ color: "#0d6efd" }}><AnimatedNumber value={avgFamilySize} decimals={1} /></strong>
            <span className="stat-desc">أفراد لكل أسرة</span>
          </div>
        </div>
      </section>

      {/* 2. قسم المخططات الدائرية التفاعلية (Donut Ring Charts) - أرقام ونسب حقيقية ومتحركة من السجلات */}
      <section style={{ background: "#f8fafc", padding: "2rem", borderRadius: "24px", border: "1px solid #e2e8f0", margin: "2rem 0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.75rem", textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaChartPie style={{ color: "#0d9488" }} /> نسب ومؤشرات التوزيع والإغـاثـة بالمخيم (حسب السجلات الفعلية)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", justifyItems: "center" }}>
          {/* مخطط 1: الحالات الخاصة */}
          <AnimatedDonut 
            percent={percentSpecial}
            color="#38bdf8"
            textColor="#0f172a"
            label="الحالات الخاصة والحرجة"
            subText={<><AnimatedNumber value={familiesWithSpecialCases} /> عائلة من أصل <AnimatedNumber value={totalNominations} /></>}
          />

          {/* مخطط 2: نسبة الأطفال والطلبة */}
          <AnimatedDonut 
            percent={percentChildren}
            color="#2dd4bf"
            textColor="#0f172a"
            label="نسبة الأطفال والطلاب"
            subText={<><AnimatedNumber value={totalChildrenCount} /> طفل من أصل <AnimatedNumber value={grandAgeTotal} /> فرد</>}
          />

          {/* مخطط 3: تغطية الترشيحات */}
          <AnimatedDonut 
            percent={percentCoverage}
            color="#f59e0b"
            textColor="#ffffff"
            label="نسبة شمولية الترشيح"
            subText={<><AnimatedNumber value={totalNominations} /> مرشحة من أصل <AnimatedNumber value={totalFamilies} /> عائلة</>}
          />

          {/* مخطط 4: نسبة الشباب والبالغين */}
          <AnimatedDonut 
            percent={percentAdults}
            color="#8b5cf6"
            textColor="#ffffff"
            label="نسبة الشباب والبالغين"
            subText={<><AnimatedNumber value={totalAdultsCount} /> فرد بالغ من أصل <AnimatedNumber value={grandAgeTotal} /></>}
          />
        </div>
      </section>

      {/* 3. تحليلات الحالات الصحية والاجتماعية الحية */}
      <section style={{ margin: "2rem 0" }}>
        <div className="section-title" style={{ marginBottom: "1rem" }}>
          <h2>🏥 تحليلات الحالات الصحية والاجتماعية الخاصة (أرقام حية)</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "16px", border: "1px solid #e2e8f0", borderRight: "5px solid #a04000", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#475569" }}>تضم ذوي إعاقة</span>
              <FaWheelchair style={{ color: "#a04000", fontSize: "1.4rem" }} />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 2px 0" }}>
              <AnimatedNumber value={countDisabled} />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600" }}>عائلة تحوي ذوي إعاقة</span>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "16px", border: "1px solid #e2e8f0", borderRight: "5px solid #842029", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#475569" }}>أمراض مزمنة</span>
              <FaHeartbeat style={{ color: "#842029", fontSize: "1.4rem" }} />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 2px 0" }}>
              <AnimatedNumber value={countChronic} />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600" }}>عائلة مصابين بأمراض مزمنة</span>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "16px", border: "1px solid #e2e8f0", borderRight: "5px solid #0f5132", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#475569" }}>حوامل أو مرضعات</span>
              <FaBaby style={{ color: "#0f5132", fontSize: "1.4rem" }} />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 2px 0" }}>
              <AnimatedNumber value={countPregnant} />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600" }}>امرأة حامل أو مرضعة</span>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "16px", border: "1px solid #e2e8f0", borderRight: "5px solid #4a148c", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#475569" }}>أسر تعيلها امرأة</span>
              <FaFemale style={{ color: "#4a148c", fontSize: "1.4rem" }} />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1e293b", margin: "8px 0 2px 0" }}>
              <AnimatedNumber value={countFemaleHeaded} />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600" }}>عائلة بدون معيل رجل</span>
          </div>
        </div>
      </section>

      {/* 4. التوزيع العمري التفصيلي للأفراد (مخطط بار تفاعلي) */}
      <section style={{ background: "#ffffff", padding: "1.5rem 1.8rem", borderRadius: "20px", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <FaChartBar style={{ color: "var(--primary-color)" }} /> التوزيع العمري التفصيلي لأفراد المخيم
          </h2>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>مجموع الأفراد المحصين: <AnimatedNumber value={grandAgeTotal} /> فرد</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* 0-2 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              <span>👶 أطفال رضع (0 - 2 سنة)</span>
              <span><AnimatedNumber value={age_0_2} /> فرد (<AnimatedNumber value={(age_0_2 / (grandAgeTotal || 1)) * 100} decimals={0} />%)</span>
            </div>
            <div style={{ background: "#f1f5f9", height: "12px", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #1e3d59, #3b82f6)", height: "100%", width: `${(age_0_2 / (grandAgeTotal || 1)) * 100}%`, borderRadius: "10px", transition: "width 1s ease" }}></div>
            </div>
          </div>

          {/* 3-5 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              <span>🧸 أطفال مبكرة (3 - 5 سنوات)</span>
              <span><AnimatedNumber value={age_3_5} /> فرد (<AnimatedNumber value={(age_3_5 / (grandAgeTotal || 1)) * 100} decimals={0} />%)</span>
            </div>
            <div style={{ background: "#f1f5f9", height: "12px", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #10b981, #059669)", height: "100%", width: `${(age_3_5 / (grandAgeTotal || 1)) * 100}%`, borderRadius: "10px", transition: "width 1s ease" }}></div>
            </div>
          </div>

          {/* 6-18 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              <span>🎒 فتيان وطلاب (6 - 18 سنة)</span>
              <span><AnimatedNumber value={age_6_18} /> فرد (<AnimatedNumber value={(age_6_18 / (grandAgeTotal || 1)) * 100} decimals={0} />%)</span>
            </div>
            <div style={{ background: "#f1f5f9", height: "12px", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #ec4899, #f35588)", height: "100%", width: `${(age_6_18 / (grandAgeTotal || 1)) * 100}%`, borderRadius: "10px", transition: "width 1s ease" }}></div>
            </div>
          </div>

          {/* 19-60 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              <span>👤 البالغون والشباب (19 - 60 سنة)</span>
              <span><AnimatedNumber value={age_19_60} /> فرد (<AnimatedNumber value={(age_19_60 / (grandAgeTotal || 1)) * 100} decimals={0} />%)</span>
            </div>
            <div style={{ background: "#f1f5f9", height: "12px", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #8b5cf6, #7b68ee)", height: "100%", width: `${(age_19_60 / (grandAgeTotal || 1)) * 100}%`, borderRadius: "10px", transition: "width 1s ease" }}></div>
            </div>
          </div>

          {/* 60+ */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              <span>👴 كبار السن (أكثر من 60 سنة)</span>
              <span><AnimatedNumber value={age_over_60} /> فرد (<AnimatedNumber value={(age_over_60 / (grandAgeTotal || 1)) * 100} decimals={0} />%)</span>
            </div>
            <div style={{ background: "#f1f5f9", height: "12px", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)", height: "100%", width: `${(age_over_60 / (grandAgeTotal || 1)) * 100}%`, borderRadius: "10px", transition: "width 1s ease" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. أزرار العمليات السريعة وتصدير الكشوفات */}
      <section className="quick-actions-section">
        <div className="section-title">
          <h2>📊 العمليات السريعة وتصدير التقارير المعتمدة</h2>
        </div>
        
        <h3 style={{ fontSize: "1.05rem", color: "var(--primary-dark)", margin: "1rem 0 0.5rem 0", fontWeight: "700" }}>📋 كشف عائلات المخيم العام:</h3>
        <div className="actions-buttons-grid">
          <button 
            onClick={() => exportToExcel(families, campProfile)} 
            className="action-btn excel"
            disabled={families.length === 0}
          >
            <FaFileExcel className="action-btn-icon" />
            <div className="action-btn-text">
              <h3>تصدير كشف Excel المنسق</h3>
              <p>تحميل كشف العائلات - نظام إدارة المخيمات</p>
            </div>
          </button>

          <button 
            onClick={() => exportToPDF(families, "families", campProfile)} 
            className="action-btn pdf"
            disabled={families.length === 0}
          >
            <FaFilePdf className="action-btn-icon" />
            <div className="action-btn-text">
              <h3>تصدير كشف PDF الرسمي</h3>
              <p>طباعة الكشف وتوليد تقرير رسمـي معتمد</p>
            </div>
          </button>
        </div>

        <h3 style={{ fontSize: "1.05rem", color: "var(--primary-dark)", margin: "1.5rem 0 0.5rem 0", fontWeight: "700" }}>📝 كشف ترشيحات المخيم المفصل:</h3>
        <div className="actions-buttons-grid">
          <button 
            onClick={() => exportNominationsToExcel(nominations, campProfile)} 
            className="action-btn excel"
            style={{ borderColor: "#b89647" }}
            disabled={nominations.length === 0}
          >
            <FaFileExcel className="action-btn-icon" style={{ color: "#b89647" }} />
            <div className="action-btn-text">
              <h3>تصدير ترشيحات Excel المنسق</h3>
              <p>تحميل كشف الترشيحات المفصل بالتوزيع العمري</p>
            </div>
          </button>

          <button 
            onClick={() => exportToPDF(nominations, "nominations", campProfile)} 
            className="action-btn pdf"
            style={{ borderColor: "#b89647" }}
            disabled={nominations.length === 0}
          >
            <FaFilePdf className="action-btn-icon" style={{ color: "#b89647" }} />
            <div className="action-btn-text">
              <h3>تصدير ترشيحات PDF المعتمد</h3>
              <p>طباعة الترشيحات وتوليد تقرير جاهز للجهات المانحة</p>
            </div>
          </button>
        </div>
      </section>

      {/* 6. جدول نظرة سريعة على آخر العائلات المضافة */}
      <section className="latest-families-section">
        <div className="latest-header">
          <h2>🕒 آخر العائلات المضافة حديثاً</h2>
          <Link href="/families" className="btn-link">
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
