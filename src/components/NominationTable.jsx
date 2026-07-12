import React, { useState } from "react";
import { 
  FaEdit, FaTrashAlt, FaSearch, FaUserFriends, FaMapMarkerAlt, 
  FaPhoneAlt, FaIdCard, FaEye, FaWheelchair, FaHeartbeat, 
  FaBaby, FaFemale, FaTimes, FaMapMarkedAlt 
} from "react-icons/fa";

const NominationTable = ({ nominations, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("الكل");
  const [filterDisabled, setFilterDisabled] = useState(false);
  const [filterChronic, setFilterChronic] = useState(false);
  const [filterPregnant, setFilterPregnant] = useState(false);
  const [filterFemaleHeaded, setFilterFemaleHeaded] = useState(false);

  // حالة تفاصيل ترشيح معين
  const [detailNomination, setDetailNomination] = useState(null);

  // فلترة الترشيحات بناءً على البحث والفلاتر المتقدمة
  const filteredNominations = nominations.filter((n) => {
    const term = searchTerm.toLowerCase();
    
    const matchesSearch = 
      n.name.toLowerCase().includes(term) ||
      (n.phone && n.phone.includes(term)) ||
      (n.idNumber && n.idNumber.includes(term)) ||
      (n.currentAddress && n.currentAddress.toLowerCase().includes(term));
      
    const matchesGovernorate = 
      selectedGovernorate === "الكل" || 
      n.governorate === selectedGovernorate;
      
    const matchesDisabled = !filterDisabled || n.hasDisabled === 1;
    const matchesChronic = !filterChronic || n.hasChronicDisease === 1;
    const matchesPregnant = !filterPregnant || n.isLactatingOrPregnant === 1;
    const matchesFemaleHeaded = !filterFemaleHeaded || n.isFemaleHeaded === 1;
    
    return matchesSearch && matchesGovernorate && matchesDisabled && matchesChronic && matchesPregnant && matchesFemaleHeaded;
  });

  return (
    <div className="table-section">
      {/* شريط البحث والفلاتر */}
      <div className="filters-container" style={{
        background: "var(--surface-color)",
        border: "1px solid var(--border-color)",
        padding: "1.25rem",
        borderRadius: "var(--radius-md)",
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-sm)"
      }}>
        {/* حقل البحث والمحافظة */}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}>
          <div className="search-wrapper" style={{ flex: 2, minWidth: "250px" }}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="ابحث باسم رب الأسرة، الهوية، الهاتف، أو العنوان الحالي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div style={{ flex: 1, minWidth: "150px" }}>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "0.95rem",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                height: "100%",
                background: "white"
              }}
            >
              <option value="الكل">كل المحافظات</option>
              <option value="شمال غزة">شمال غزة</option>
              <option value="غزة">غزة</option>
              <option value="الوسطى">الوسطى</option>
              <option value="خان يونس">خان يونس</option>
              <option value="رفح">رفح</option>
            </select>
          </div>
        </div>

        {/* فلاتر الحالات الخاصة */}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-color)" }}>تصفية سريعة:</span>
          
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem", background: filterDisabled ? "rgba(160, 64, 0, 0.1)" : "#f8fafc", padding: "5px 10px", borderRadius: "50px", border: "1px solid #cbd5e1" }}>
            <input type="checkbox" checked={filterDisabled} onChange={(e) => setFilterDisabled(e.target.checked)} style={{ cursor: "pointer" }} />
            <FaWheelchair style={{ color: "#a04000" }} /> ذوي إعاقة
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem", background: filterChronic ? "rgba(132, 32, 41, 0.1)" : "#f8fafc", padding: "5px 10px", borderRadius: "50px", border: "1px solid #cbd5e1" }}>
            <input type="checkbox" checked={filterChronic} onChange={(e) => setFilterChronic(e.target.checked)} style={{ cursor: "pointer" }} />
            <FaHeartbeat style={{ color: "#842029" }} /> أمراض مزمنة
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem", background: filterPregnant ? "rgba(15, 81, 50, 0.1)" : "#f8fafc", padding: "5px 10px", borderRadius: "50px", border: "1px solid #cbd5e1" }}>
            <input type="checkbox" checked={filterPregnant} onChange={(e) => setFilterPregnant(e.target.checked)} style={{ cursor: "pointer" }} />
            <FaBaby style={{ color: "#0f5132" }} /> حامل/مرضعة
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem", background: filterFemaleHeaded ? "rgba(74, 20, 140, 0.1)" : "#f8fafc", padding: "5px 10px", borderRadius: "50px", border: "1px solid #cbd5e1" }}>
            <input type="checkbox" checked={filterFemaleHeaded} onChange={(e) => setFilterFemaleHeaded(e.target.checked)} style={{ cursor: "pointer" }} />
            <FaFemale style={{ color: "#4a148c" }} /> معيل امرأة
          </label>
        </div>

        <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "left" }}>
          نتائج التصفية: <strong>{filteredNominations.length}</strong> عائلة مرشحة
        </div>
      </div>

      {/* جدول الترشيحات التفاعلي */}
      <div className="table-responsive">
        {filteredNominations.length > 0 ? (
          <table className="family-table">
            <thead>
              {/* الصف الأول من الهيدر */}
              <tr>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>رقم</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "right" }}>اسم رب الأسرة</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>رقم الهوية</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>الجنس</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>الحالة</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>الجوال</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "right" }}>اسم الزوجة</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>إجمالي الأفراد</th>
                
                {/* أعمدة الفئات العمرية المدمجة */}
                <th colSpan="2" className="text-center" style={{ backgroundColor: "#1e3d59", color: "white", fontSize: "0.85rem" }}>2-0</th>
                <th colSpan="2" className="text-center" style={{ backgroundColor: "#17b978", color: "white", fontSize: "0.85rem" }}>5-3</th>
                <th colSpan="2" className="text-center" style={{ backgroundColor: "#f35588", color: "white", fontSize: "0.85rem" }}>18-6</th>
                <th colSpan="2" className="text-center" style={{ backgroundColor: "#7b68ee", color: "white", fontSize: "0.85rem" }}>60-19</th>
                <th colSpan="2" className="text-center" style={{ backgroundColor: "#ff8c00", color: "white", fontSize: "0.85rem" }}>أكثر من 60</th>
                
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>الحالة الصحية</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "right" }}>المحافظة</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "right" }}>السكن الحالي</th>
                <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>الإجراءات</th>
              </tr>
              {/* الصف الثاني من الهيدر لتحديد ذكر/أنثى */}
              <tr>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>ذكر</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>أنثى</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>ذكر</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>أنثى</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>ذكر</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>أنثى</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>ذكر</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>أنثى</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>ذكر</th>
                <th className="text-center" style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "4px" }}>أنثى</th>
              </tr>
            </thead>
            <tbody>
              {filteredNominations.map((nom, index) => {
                const isMarried = nom.status === "متزوج";
                
                return (
                  <tr key={nom.id} className="table-row">
                    <td className="text-center" style={{ fontWeight: "bold" }}>{nom.serialNo || index + 1}</td>
                    <td style={{ fontWeight: "600", color: "var(--primary-dark)", whiteSpace: "nowrap" }}>{nom.name}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{nom.idNumber}</td>
                    <td className="text-center">{nom.gender || "ذكر"}</td>
                    <td className="text-center">{nom.status || "متزوج"}</td>
                    <td className="ltr-span text-center">{nom.phone || "-"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{isMarried ? (nom.wifeName || "-") : "-"}</td>
                    <td className="text-center"><strong className="members-badge">{nom.membersCount}</strong></td>
                    
                    {/* تفصيل الفئات العمرية */}
                    <td className="text-center" style={{ backgroundColor: "rgba(30, 61, 89, 0.03)" }}>{nom.age_0_2_male || 0}</td>
                    <td className="text-center" style={{ backgroundColor: "rgba(30, 61, 89, 0.03)" }}>{nom.age_0_2_female || 0}</td>
                    
                    <td className="text-center" style={{ backgroundColor: "rgba(23, 185, 120, 0.03)" }}>{nom.age_3_5_male || 0}</td>
                    <td className="text-center" style={{ backgroundColor: "rgba(23, 185, 120, 0.03)" }}>{nom.age_3_5_female || 0}</td>
                    
                    <td className="text-center" style={{ backgroundColor: "rgba(243, 85, 136, 0.03)" }}>{nom.age_6_18_male || 0}</td>
                    <td className="text-center" style={{ backgroundColor: "rgba(243, 85, 136, 0.03)" }}>{nom.age_6_18_female || 0}</td>
                    
                    <td className="text-center" style={{ backgroundColor: "rgba(123, 104, 238, 0.03)" }}>{nom.age_19_60_male || 0}</td>
                    <td className="text-center" style={{ backgroundColor: "rgba(123, 104, 238, 0.03)" }}>{nom.age_19_60_female || 0}</td>
                    
                    <td className="text-center" style={{ backgroundColor: "rgba(255, 140, 0, 0.03)" }}>{nom.age_over_60_male || 0}</td>
                    <td className="text-center" style={{ backgroundColor: "rgba(255, 140, 0, 0.03)" }}>{nom.age_over_60_female || 0}</td>
                    
                    <td className="text-center">
                      <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                        {nom.hasDisabled === 1 && <FaWheelchair style={{ color: "#a04000" }} title="ذوي إعاقة" />}
                        {nom.hasChronicDisease === 1 && <FaHeartbeat style={{ color: "#842029" }} title="أمراض مزمنة" />}
                        {nom.isLactatingOrPregnant === 1 && <FaBaby style={{ color: "#0f5132" }} title="حامل/مرضعة" />}
                        {nom.isFemaleHeaded === 1 && <FaFemale style={{ color: "#4a148c" }} title="معيل امرأة" />}
                        {nom.hasDisabled !== 1 && nom.hasChronicDisease !== 1 && nom.isLactatingOrPregnant !== 1 && nom.isFemaleHeaded !== 1 && "-"}
                      </div>
                    </td>
                    <td style={{ fontWeight: "600" }}>{nom.governorate}</td>
                    <td>{nom.currentAddress}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          onClick={() => setDetailNomination(nom)}
                          className="btn-action edit"
                          style={{ backgroundColor: "rgba(13, 110, 253, 0.1)", color: "#0d6efd" }}
                          title="عرض التفاصيل الكاملة"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => onEdit(nom)}
                          className="btn-action edit"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDelete(nom.id, nom.name)}
                          className="btn-action delete"
                          title="حذف"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>لم يتم العثور على أي ترشيحات تطابق فلاتر البحث</h3>
            <p>حاول تعديل فلاتر التصفية أو أضف ترشيحاً جديداً للنظام.</p>
          </div>
        )}
      </div>

      {/* بطاقات الهاتف المحمول المحدثة */}
      <div className="mobile-cards">
        {filteredNominations.length > 0 ? (
          filteredNominations.map((nom, index) => {
            return (
              <div key={nom.id} className="mobile-card">
                <div className="card-header">
                  <span className="card-index">#{nom.serialNo || index + 1}</span>
                  <span className="card-location"><FaMapMarkerAlt /> {nom.currentAddress}</span>
                </div>
                <div className="card-body">
                  <h3>{nom.name}</h3>
                  <div className="card-detail">
                    <span className="detail-label">المحافظة:</span>
                    <span className="detail-val" style={{ fontWeight: "bold" }}>{nom.governorate}</span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-label"><FaIdCard /> الهوية:</span>
                    <span className="detail-val">{nom.idNumber}</span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-label"><FaPhoneAlt /> الهاتف:</span>
                    <span className="detail-val ltr-span">{nom.phone || "-"}</span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-label"><FaUserFriends /> أفراد الأسرة:</span>
                    <span className="detail-val badge-val">{nom.membersCount} أفراد</span>
                  </div>
                  
                  {/* حالات صحية */}
                  <div className="card-detail">
                    <span className="detail-label">تصنيفات صحية:</span>
                    <span className="detail-val">
                      <div style={{ display: "flex", gap: "8px" }}>
                        {nom.hasDisabled === 1 && <span style={{ color: "#a04000", fontWeight: "bold" }}>♿ إعاقة</span>}
                        {nom.hasChronicDisease === 1 && <span style={{ color: "#842029", fontWeight: "bold" }}>🩺 مزمن</span>}
                        {nom.isLactatingOrPregnant === 1 && <span style={{ color: "#0f5132", fontWeight: "bold" }}>👶 حامل/مرضعة</span>}
                        {nom.isFemaleHeaded === 1 && <span style={{ color: "#4a148c", fontWeight: "bold" }}>👩 معيل</span>}
                        {nom.hasDisabled !== 1 && nom.hasChronicDisease !== 1 && nom.isLactatingOrPregnant !== 1 && nom.isFemaleHeaded !== 1 && "طبيعي"}
                      </div>
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <button onClick={() => setDetailNomination(nom)} className="card-btn-action" style={{ background: "rgba(13, 110, 253, 0.08)", color: "#0d6efd" }}>
                    <FaEye /> التفاصيل
                  </button>
                  <button onClick={() => onEdit(nom)} className="card-btn-action edit">
                    <FaEdit /> تعديل
                  </button>
                  <button onClick={() => onDelete(nom.id, nom.name)} className="card-btn-action delete">
                    <FaTrashAlt /> حذف
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>لا توجد نتائج بحث مطابقة</h3>
          </div>
        )}
      </div>

      {/* نافذة تفاصيل الترشيح المنبثقة (Detail Modal) */}
      {detailNomination && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "700px", width: "95%" }}>
            <div className="modal-header" style={{ borderBottom: "2px solid var(--primary-color)" }}>
              <h2 style={{ color: "var(--primary-dark)" }}>📄 بطاقة تفاصيل الترشيح الكاملة</h2>
              <button onClick={() => setDetailNomination(null)} className="btn-close">
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "15px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* 1. القسم الرئيسي */}
                <div style={{ background: "rgba(15, 81, 50, 0.05)", padding: "15px", borderRadius: "8px", borderRight: "5px solid #0f5132" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#0f5132" }}>رب الأسرة: {detailNomination.name}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", fontSize: "0.9rem" }}>
                    <div><strong>رقم الهوية:</strong> {detailNomination.idNumber}</div>
                    <div><strong>الجنس:</strong> {detailNomination.gender}</div>
                    <div><strong>الحالة الاجتماعية:</strong> {detailNomination.status}</div>
                    <div><strong>رقم الجوال:</strong> <span className="ltr-span">{detailNomination.phone || "غير محدد"}</span></div>
                    {detailNomination.phoneAlt && <div><strong>الجوال البديل:</strong> <span className="ltr-span">{detailNomination.phoneAlt}</span></div>}
                  </div>
                </div>

                {/* 2. الزوجات والأفراد */}
                <div style={{ border: "1px solid #e2e8f0", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "var(--primary-dark)" }}>👩‍👩‍👦 الزوجات وأفراد الأسرة</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", fontSize: "0.88rem" }}>
                    {detailNomination.wifeName && (
                      <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                        <strong>الزوجة الأولى:</strong> {detailNomination.wifeName}
                        {detailNomination.wifeId && <div><strong>هوية الزوجة:</strong> {detailNomination.wifeId}</div>}
                      </div>
                    )}
                    {detailNomination.wife2Name && (
                      <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                        <strong>الزوجة الثانية:</strong> {detailNomination.wife2Name}
                        {detailNomination.wife2Id && <div><strong>هوية الزوجة 2:</strong> {detailNomination.wife2Id}</div>}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #e2e8f0" }}>
                    <strong>إجمالي عدد أفراد الأسرة:</strong> <span className="badge-members" style={{ fontSize: "0.9rem" }}>{detailNomination.membersCount} أفراد</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px", fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "6px 12px", borderRadius: "4px" }}>
                        <span>👶 <strong>أطفال (0-2):</strong></span>
                        <span>ذكور: {detailNomination.age_0_2_male || 0} | إناث: {detailNomination.age_0_2_female || 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "6px 12px", borderRadius: "4px" }}>
                        <span>🧒 <strong>أطفال (3-5):</strong></span>
                        <span>ذكور: {detailNomination.age_3_5_male || 0} | إناث: {detailNomination.age_3_5_female || 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "6px 12px", borderRadius: "4px" }}>
                        <span>🎒 <strong>أطفال (6-18):</strong></span>
                        <span>ذكور: {detailNomination.age_6_18_male || 0} | إناث: {detailNomination.age_6_18_female || 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "6px 12px", borderRadius: "4px" }}>
                        <span>🧑 <strong>بالغين (19-60):</strong></span>
                        <span>ذكور: {detailNomination.age_19_60_male || 0} | إناث: {detailNomination.age_19_60_female || 0}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "6px 12px", borderRadius: "4px" }}>
                        <span>🧓 <strong>مسنين (60+):</strong></span>
                        <span>ذكور: {detailNomination.age_over_60_male || 0} | إناث: {detailNomination.age_over_60_female || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. الحالات الصحية */}
                <div style={{ border: "1px solid #e2e8f0", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "var(--primary-dark)" }}>♿ الحالات والمحددات الخاصة</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", fontSize: "0.9rem" }}>
                    <div style={{ color: detailNomination.hasDisabled ? "#a04000" : "#94a3b8", fontWeight: detailNomination.hasDisabled ? "bold" : "normal" }}>
                      {detailNomination.hasDisabled ? "✔ ذوي إعاقة" : "✘ لا يوجد إعاقة"}
                    </div>
                    <div style={{ color: detailNomination.hasChronicDisease ? "#842029" : "#94a3b8", fontWeight: detailNomination.hasChronicDisease ? "bold" : "normal" }}>
                      {detailNomination.hasChronicDisease ? "✔ أمراض مزمنة" : "✘ لا يوجد أمراض مزمنة"}
                    </div>
                    <div style={{ color: detailNomination.isLactatingOrPregnant ? "#0f5132" : "#94a3b8", fontWeight: detailNomination.isLactatingOrPregnant ? "bold" : "normal" }}>
                      {detailNomination.isLactatingOrPregnant ? "✔ امرأة حامل أو مرضعة" : "✘ لا يوجد مرضعة/حامل"}
                    </div>
                    <div style={{ color: detailNomination.isFemaleHeaded ? "#4a148c" : "#94a3b8", fontWeight: detailNomination.isFemaleHeaded ? "bold" : "normal" }}>
                      {detailNomination.isFemaleHeaded ? "✔ الأسرة تعيلها امرأة" : "✘ لا تعيلها امرأة"}
                    </div>
                  </div>
                </div>

                {/* 4. السكن والنزوح */}
                <div style={{ border: "1px solid #e2e8f0", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "var(--primary-dark)" }}>📍 السكن والنزوح ومراكز الإيواء</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px", fontSize: "0.88rem" }}>
                    <div><strong>السكن الحالي بالتفصيل:</strong> {detailNomination.currentAddress}</div>
                    <div><strong>السكن الأصلي:</strong> {detailNomination.originalAddress || "غير محدد"}</div>
                    <div><strong>المحافظة:</strong> {detailNomination.governorate}</div>
                    <div><strong>اسم المخيم:</strong> {detailNomination.campName || "مخيم كريم"}</div>
                  </div>

                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #e2e8f0", fontSize: "0.85rem" }}>
                    <strong>معلومات مركز الإيواء:</strong>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "6px", marginTop: "6px" }}>
                      <div><strong>مدير المركز/المندوب:</strong> {detailNomination.shelterManager}</div>
                      <div><strong>رقم التواصل للمندوب:</strong> <span className="ltr-span">{detailNomination.shelterPhone || "غير محدد"}</span></div>
                      {detailNomination.shelterPhoneAlt && <div><strong>الهاتف البديل:</strong> <span className="ltr-span">{detailNomination.shelterPhoneAlt}</span></div>}
                      {detailNomination.shelterAddress && <div style={{ gridColumn: "span 2" }}><strong>عنوان مركز الإيواء بالتفصيل:</strong> {detailNomination.shelterAddress}</div>}
                      {detailNomination.shelterGps && (
                        <div style={{ gridColumn: "span 2" }}>
                          <strong>رابط موقع GPS:</strong> <a href={detailNomination.shelterGps} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-color)", textDecoration: "underline", wordBreak: "break-all" }}><FaMapMarkedAlt /> {detailNomination.shelterGps}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="modal-footer" style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
              <button onClick={() => setDetailNomination(null)} className="btn btn-secondary">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NominationTable;
