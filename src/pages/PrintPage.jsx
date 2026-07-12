import React, { useEffect, useState } from "react";

const PrintPage = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("families");

  useEffect(() => {
    // جلب البيانات المخزنة للطباعة
    const printData = localStorage.getItem("kareem_camp_print_data");
    const printType = localStorage.getItem("kareem_camp_print_type") || "families";
    
    // تغيير عنوان التبويب ليكون احترافياً بدلاً من React App
    document.title = printType === "nominations" ? "كشف ترشيحات مخيم كريم العام" : "كشف عائلات مخيم كريم العام";

    if (printData) {
      setData(JSON.parse(printData));
    }
    setType(printType);
    
    // تشغيل نافذة الطباعة تلقائياً بعد رندر الصفحة بـ 800 مللي ثانية
    const timer = setTimeout(() => {
      window.print();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const totalCount = data.length;
  const totalMembers = data.reduce((sum, item) => sum + (parseInt(item.membersCount) || 0), 0);

  // إحصائيات الترشيحات الخاصة بالطباعة
  const disabledCount = type === "nominations" ? data.filter(n => n.hasDisabled > 0).length : 0;
  const chronicCount = type === "nominations" ? data.filter(n => n.hasChronicDisease > 0).length : 0;
  const pregnantCount = type === "nominations" ? data.filter(n => n.isLactatingOrPregnant > 0).length : 0;
  const femaleHeadedCount = type === "nominations" ? data.filter(n => n.isFemaleHeaded > 0).length : 0;

  return (
    <div className="print-page-layout" dir="rtl" style={{ padding: "20px", backgroundColor: "white", minHeight: "100vh" }}>
      {/* زر بدء الطباعة اليدوي (يظهر على الشاشة فقط ويختفي عند الطباعة) */}
      <div className="print-btn-container no-print" style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 9999 }}>
        <button 
          onClick={() => window.print()}
          style={{
            backgroundColor: "#0f5132",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "12pt",
            fontWeight: "bold",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
          }}
        >
          🖨️ بدء الطباعة / حفظ PDF
        </button>
      </div>

      {/* الترويسة الرئيسية */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px double #0f5132", paddingBottom: "15px", marginBottom: "25px" }}>
        <div className="logo-section" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img className="logo" src="/logo.jpg" alt="شعار مخيم كريم" style={{ width: "75px", height: "75px", objectFit: "contain", borderRadius: "50%", border: "2px solid #b89647" }} onError={(e) => e.target.style.display = 'none'} />
          <div className="camp-title">
            <h1 style={{ fontSize: "18pt", color: "#0f5132", margin: 0, fontWeight: 700 }}>مخيم كريم</h1>
            <p style={{ fontSize: "10pt", color: "#b89647", margin: "5px 0 0 0", fontWeight: 600 }}>مأوى آمن .. رحمة وعون .. نكمل معاً طريق الحياة</p>
          </div>
        </div>
        <div className="meta-info" style={{ textAlign: "left", fontSize: "10pt" }}>
          <p><span style={{ fontWeight: "bold", color: "#0f5132" }}>مسؤول المخيم:</span> ربيع جمال جودة جودة</p>
          <p><span style={{ fontWeight: "bold", color: "#0f5132" }}>رقم الجوال:</span> 0599099693</p>
          <p><span style={{ fontWeight: "bold", color: "#0f5132" }}>التاريخ:</span> {dateStr}</p>
          <p><span style={{ fontWeight: "bold", color: "#0f5132" }}>الموقع:</span> حي القصاصيب</p>
        </div>
      </div>

      <div className="report-title-bar" style={{ textAlign: "center", marginBottom: "20px", background: "#f4f6f4", padding: "10px", borderRadius: "6px", borderRight: "5px solid #0f5132" }}>
        <h2 style={{ margin: 0, fontSize: "14pt", color: "#0f5132" }}>
          {type === "nominations" ? "كشف ترشيحات مخيم كريم العام (كشف الترشيحات المفصل)" : "كشف عائلات مخيم كريم العام"}
        </h2>
      </div>

      {/* ملخص الإحصائيات */}
      <div className="stats-summary" style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px", background: "#fafafa", padding: "10px 15px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "9.5pt" }}>
        <div className="stats-item">
          <span style={{ fontWeight: "bold", color: "#64748b" }}>
            {type === "nominations" ? "إجمالي العائلات المرشحة:" : "إجمالي عدد العائلات:"}
          </span>
          <span style={{ fontWeight: "bold", color: "#0f5132" }}> {totalCount} عائلة</span>
        </div>
        <div style={{ color: "#cbd5e1" }}>|</div>
        <div className="stats-item">
          <span style={{ fontWeight: "bold", color: "#64748b" }}>
            {type === "nominations" ? "إجمالي الأفراد المرشحين:" : "إجمالي عدد الأفراد:"}
          </span>
          <span style={{ fontWeight: "bold", color: "#0f5132" }}> {totalMembers} فرد</span>
        </div>
        
        {type === "nominations" && (
          <>
            <div style={{ color: "#cbd5e1" }}>|</div>
            <div className="stats-item">
              <span style={{ fontWeight: "bold", color: "#64748b" }}>ذوي إعاقة:</span>
              <span style={{ fontWeight: "bold", color: "#a04000" }}> {disabledCount}</span>
            </div>
            <div style={{ color: "#cbd5e1" }}>|</div>
            <div className="stats-item">
              <span style={{ fontWeight: "bold", color: "#64748b" }}>أمراض مزمنة:</span>
              <span style={{ fontWeight: "bold", color: "#842029" }}> {chronicCount}</span>
            </div>
            <div style={{ color: "#cbd5e1" }}>|</div>
            <div className="stats-item">
              <span style={{ fontWeight: "bold", color: "#64748b" }}>حوامل/مرضعات:</span>
              <span style={{ fontWeight: "bold", color: "#0f5132" }}> {pregnantCount}</span>
            </div>
            <div style={{ color: "#cbd5e1" }}>|</div>
            <div className="stats-item">
              <span style={{ fontWeight: "bold", color: "#64748b" }}>معيل امرأة:</span>
              <span style={{ fontWeight: "bold", color: "#4a148c" }}> {femaleHeadedCount}</span>
            </div>
          </>
        )}
      </div>

      {/* جدول البيانات العريض المسطح */}
      {type === "nominations" ? (
        <table className="print-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px", direction: "rtl" }}>
          <thead>
            {/* الصف الأول من الهيدر */}
            <tr style={{ backgroundColor: "#0f5132", color: "white" }}>
              <th rowSpan="2" style={{ width: "2%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>رقم</th>
              <th rowSpan="2" style={{ width: "12%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "right", verticalAlign: "middle" }}>اسم رب الأسرة</th>
              <th rowSpan="2" style={{ width: "8%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>الهوية</th>
              <th rowSpan="2" style={{ width: "5%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>الحالة</th>
              <th rowSpan="2" style={{ width: "10%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "right", verticalAlign: "middle" }}>اسم الزوجة</th>
              <th rowSpan="2" style={{ width: "8%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>الهاتف</th>
              <th rowSpan="2" style={{ width: "3%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>الأفراد</th>
              
              {/* أعمدة الفئات العمرية */}
              <th colSpan="2" style={{ fontSize: "7pt", padding: "3px", border: "1px solid #0f5132", textAlign: "center", backgroundColor: "#1e3d59" }}>2-0</th>
              <th colSpan="2" style={{ fontSize: "7pt", padding: "3px", border: "1px solid #0f5132", textAlign: "center", backgroundColor: "#17b978" }}>5-3</th>
              <th colSpan="2" style={{ fontSize: "7pt", padding: "3px", border: "1px solid #0f5132", textAlign: "center", backgroundColor: "#f35588" }}>18-6</th>
              <th colSpan="2" style={{ fontSize: "7pt", padding: "3px", border: "1px solid #0f5132", textAlign: "center", backgroundColor: "#7b68ee" }}>60-19</th>
              <th colSpan="2" style={{ fontSize: "7pt", padding: "3px", border: "1px solid #0f5132", textAlign: "center", backgroundColor: "#ff8c00" }}>60+</th>
              
              <th rowSpan="2" style={{ width: "3%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>إعاقة</th>
              <th rowSpan="2" style={{ width: "3%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>مزمن</th>
              <th rowSpan="2" style={{ width: "3%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>حامل</th>
              <th rowSpan="2" style={{ width: "3%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>معيل</th>
              <th rowSpan="2" style={{ width: "10%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "right", verticalAlign: "middle" }}>السكن الحالي</th>
              <th rowSpan="2" style={{ width: "6%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "center", verticalAlign: "middle" }}>المحافظة</th>
              <th rowSpan="2" style={{ width: "6%", fontSize: "7.5pt", padding: "4px 3px", border: "1px solid #0f5132", textAlign: "right", verticalAlign: "middle" }}>المندوب</th>
            </tr>
            {/* الصف الثاني من الهيدر لتحديد ذكر/أنثى */}
            <tr style={{ backgroundColor: "#0f5132", color: "white" }}>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>ذ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>أ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>ذ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>أ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>ذ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>أ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>ذ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>أ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>ذ</th>
              <th style={{ fontSize: "6.5pt", padding: "2px", border: "1px solid #0f5132", textAlign: "center" }}>أ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((nom, index) => {
              const isMarried = nom.status === "متزوج";
              return (
                <tr key={nom.id} style={{ backgroundColor: index % 2 === 1 ? "#f8fafc" : "transparent" }}>
                  <td style={{ textAlign: "center", fontWeight: "bold", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.serialNo || index + 1}</td>
                  <td style={{ fontWeight: "bold", color: "#0f5132", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", whiteSpace: "nowrap" }}>{nom.name}</td>
                  <td style={{ padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", textAlign: "center" }}>{nom.idNumber}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.status || "متزوج"}</td>
                  <td style={{ color: "#b89647", fontWeight: "600", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", whiteSpace: "nowrap" }}>{isMarried ? (nom.wifeName || "-") : "-"}</td>
                  <td style={{ direction: "ltr", textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.phone || "-"}</td>
                  <td style={{ textAlign: "center", fontWeight: "bold", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.membersCount}</td>
                  
                  {/* أعمدة الفئات العمرية */}
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(30, 61, 89, 0.02)" }}>{nom.age_0_2_male || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(30, 61, 89, 0.02)" }}>{nom.age_0_2_female || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(23, 185, 120, 0.02)" }}>{nom.age_3_5_male || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(23, 185, 120, 0.02)" }}>{nom.age_3_5_female || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(243, 85, 136, 0.02)" }}>{nom.age_6_18_male || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(243, 85, 136, 0.02)" }}>{nom.age_6_18_female || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(123, 104, 238, 0.02)" }}>{nom.age_19_60_male || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(123, 104, 238, 0.02)" }}>{nom.age_19_60_female || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(255, 140, 0, 0.02)" }}>{nom.age_over_60_male || 0}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", backgroundColor: "rgba(255, 140, 0, 0.02)" }}>{nom.age_over_60_female || 0}</td>
                  
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.hasDisabled ? "✔" : "-"}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.hasChronicDisease ? "✔" : "-"}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.isLactatingOrPregnant ? "✔" : "-"}</td>
                  <td style={{ textAlign: "center", padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.isFemaleHeaded ? "✔" : "-"}</td>
                  <td style={{ padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt" }}>{nom.currentAddress || "-"}</td>
                  <td style={{ padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", textAlign: "center" }}>{nom.governorate || "شمال غزة"}</td>
                  <td style={{ padding: "4px 3px", border: "1px solid #cbd5e1", fontSize: "7pt", whiteSpace: "nowrap" }}>{nom.shelterManager || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table className="print-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px", direction: "rtl" }}>
          <thead>
            <tr style={{ backgroundColor: "#0f5132", color: "white" }}>
              <th style={{ width: "3%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>رقم</th>
              <th style={{ width: "15%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>اسم رب الأسرة</th>
              <th style={{ width: "10%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>هوية رب الأسرة</th>
              <th style={{ width: "10%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>تاريخ الميلاد</th>
              <th style={{ width: "7%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>الحالة</th>
              <th style={{ width: "15%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>اسم الزوجة</th>
              <th style={{ width: "10%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>هوية الزوجة</th>
              <th style={{ width: "10%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>ميلاد الزوجة</th>
              <th style={{ width: "10%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>رقم الهاتف</th>
              <th style={{ width: "4%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "center" }}>الأفراد</th>
              <th style={{ width: "10%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>مكان السكن</th>
              <th style={{ width: "12%", fontSize: "8.5pt", padding: "6px 8px", border: "1px solid #0f5132", textAlign: "right" }}>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((f, index) => {
              const isMarried = f.status === "متزوج";
              return (
                <tr key={f.id} style={{ backgroundColor: index % 2 === 1 ? "#f8fafc" : "transparent" }}>
                  <td style={{ textAlign: "center", fontWeight: "bold", padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{index + 1}</td>
                  <td style={{ fontWeight: "bold", color: "#0f5132", padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.name}</td>
                  <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.idNumber}</td>
                  <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.dob || "-"}</td>
                  <td style={{ textAlign: "center", padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.status || "أعزب"}</td>
                  <td style={{ color: "#b89647", fontWeight: "600", padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{isMarried ? (f.wifeName || "-") : "-"}</td>
                  <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{isMarried ? (f.wifeId || "-") : "-"}</td>
                  <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{isMarried ? (f.wifeDob || "-") : "-"}</td>
                  <td style={{ direction: "ltr", textAlign: "right", padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.phone}</td>
                  <td style={{ textAlign: "center", fontWeight: "bold", padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.membersCount}</td>
                  <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt" }}>{f.location}</td>
                  <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontSize: "8pt", wordBreak: "break-word" }}>{f.notes || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* التوقيع والختم */}
      <div className="footer" style={{ marginTop: "50px", display: "flex", justifyContent: "space-between", fontSize: "10pt" }}>
        <div>
          <p>تم استخراج الكشف إلكترونياً بواسطة نظام إدارة مخيم كريم.</p>
        </div>
        <div>
          <div className="signature-box" style={{ borderTop: "1px dashed #94a3b8", width: "200px", textAlign: "center", paddingTop: "10px", marginTop: "40px" }}>
            توقيع وختم إدارة المخيم
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
