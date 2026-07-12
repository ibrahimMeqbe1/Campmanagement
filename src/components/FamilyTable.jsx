import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaUserFriends, FaMapMarkerAlt, FaPhoneAlt, FaIdCard } from "react-icons/fa";

const FamilyTable = ({ families, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // فلترة العائلات بناءً على كلمة البحث (الاسم أو رقم الهاتف أو الهوية أو مكان السكن)
  const filteredFamilies = families.filter((family) => {
    const term = searchTerm.toLowerCase();
    return (
      family.name.toLowerCase().includes(term) ||
      family.phone.includes(term) ||
      family.idNumber.includes(term) ||
      family.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="table-section">
      {/* شريط البحث */}
      <div className="search-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="ابحث باسم رب الأسرة، رقم الهاتف، رقم الهوية أو مكان السكن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-count">
          نتائج البحث: <strong>{filteredFamilies.length}</strong> عائلة
        </div>
      </div>

      {/* جدول العائلات التفاعلي */}
      <div className="table-responsive">
        {filteredFamilies.length > 0 ? (
          <table className="family-table">
            <thead>
              <tr>
                <th style={{ width: "2%" }}>رقم</th>
                <th style={{ width: "13%" }}>اسم رب الأسرة</th>
                <th style={{ width: "8%" }}>هوية رب الأسرة</th>
                <th style={{ width: "8%" }}>تاريخ ميلاد رب الأسرة</th>
                <th style={{ width: "6%" }} className="text-center">الحالة</th>
                <th style={{ width: "13%" }}>اسم الزوجة</th>
                <th style={{ width: "8%" }}>رقم هوية الزوجة</th>
                <th style={{ width: "8%" }}>تاريخ ميلاد الزوجة</th>
                <th style={{ width: "9%" }}>رقم الهاتف</th>
                <th style={{ width: "4%" }} className="text-center">الأفراد</th>
                <th style={{ width: "8%" }}>مكان السكن</th>
                <th style={{ width: "13%" }}>ملاحظات</th>
                <th style={{ width: "5%" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((family, index) => {
                const isMarried = family.status === "متزوج";
                
                // تحديد شارة الحالة الاجتماعية
                let statusBg = "#e2e8f0";
                let statusColor = "#334155";
                if (family.status === "متزوج") { statusBg = "#d1e7dd"; statusColor = "#0f5132"; }
                else if (family.status === "أرملة") { statusBg = "#f8d7da"; statusColor = "#842029"; }
                else if (family.status === "يتيم") { statusBg = "#fff3cd"; statusColor = "#664d03"; }
                else if (family.status === "مطلق") { statusBg = "#f3e5f5"; statusColor = "#4a148c"; }

                return (
                  <tr key={family.id} className="table-row">
                    <td className="text-center" style={{ fontWeight: "bold" }}>{index + 1}</td>
                    
                    {/* اسم رب الأسرة */}
                    <td style={{ fontWeight: "600", color: "var(--primary-dark)" }}>{family.name}</td>

                    {/* هوية رب الأسرة */}
                    <td>
                      <div className="icon-text">
                        <FaIdCard className="td-icon muted" />
                        <span>{family.idNumber}</span>
                      </div>
                    </td>

                    {/* تاريخ ميلاد رب الأسرة */}
                    <td>{family.dob || <span className="text-muted">-</span>}</td>

                    {/* الحالة الاجتماعية */}
                    <td className="text-center">
                      <span style={{
                        background: statusBg,
                        color: statusColor,
                        padding: "3px 9px",
                        borderRadius: "50px",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        display: "inline-block"
                      }}>
                        {family.status || "أعزب"}
                      </span>
                    </td>

                    {/* اسم الزوجة */}
                    <td style={{ fontWeight: "600", color: "#b89647" }}>
                      {isMarried ? (family.wifeName || <span className="text-muted">-</span>) : <span className="text-muted">-</span>}
                    </td>

                    {/* رقم هوية الزوجة */}
                    <td>
                      {isMarried && family.wifeId ? (
                        <div className="icon-text">
                          <FaIdCard className="td-icon muted" style={{ color: "#b89647" }} />
                          <span>{family.wifeId}</span>
                        </div>
                      ) : <span className="text-muted">-</span>}
                    </td>

                    {/* تاريخ ميلاد الزوجة */}
                    <td>
                      {isMarried ? (family.wifeDob || <span className="text-muted">-</span>) : <span className="text-muted">-</span>}
                    </td>

                    {/* الهاتف */}
                    <td>
                      <div className="icon-text">
                        <FaPhoneAlt className="td-icon muted" />
                        <span className="ltr-span">{family.phone}</span>
                      </div>
                    </td>

                    {/* عدد الأفراد */}
                    <td className="text-center">
                      <strong className="members-badge">{family.membersCount}</strong>
                    </td>

                    {/* مكان السكن */}
                    <td>
                      <div className="icon-text">
                        <FaMapMarkerAlt className="td-icon gold-icon" />
                        <span>{family.location}</span>
                      </div>
                    </td>

                    {/* ملاحظات */}
                    <td className="notes-cell" title={family.notes} style={{ wordBreak: "break-word" }}>
                      {family.notes || <span className="no-notes">-</span>}
                    </td>

                    {/* الإجراءات */}
                    <td>
                      <div className="actions-cell">
                        <button
                          onClick={() => onEdit(family)}
                          className="btn-action edit"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDelete(family.id, family.name)}
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
            <h3>لم يتم العثور على أي عائلات تطابق بحثك</h3>
            <p>حاول إدخال تفاصيل أخرى أو أضف عائلة جديدة للنظام.</p>
          </div>
        )}
      </div>

      {/* بطاقات الهاتف المحمول المحدثة */}
      <div className="mobile-cards">
        {filteredFamilies.length > 0 ? (
          filteredFamilies.map((family, index) => {
            const isMarried = family.status === "متزوج";
            return (
              <div key={family.id} className="mobile-card">
                <div className="card-header">
                  <span className="card-index">#{index + 1}</span>
                  <span className="card-location"><FaMapMarkerAlt /> {family.location}</span>
                </div>
                <div className="card-body">
                  <h3>{family.name}</h3>
                  <div className="card-detail">
                    <span className="detail-label">الحالة الاجتماعية:</span>
                    <span className="detail-val">{family.status || "أعزب"}</span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-label"><FaIdCard /> الهوية:</span>
                    <span className="detail-val">{family.idNumber}</span>
                  </div>
                  {family.dob && (
                    <div className="card-detail">
                      <span className="detail-label">تاريخ الميلاد:</span>
                      <span className="detail-val">{family.dob}</span>
                    </div>
                  )}
                  {isMarried && family.wifeName && (
                    <div style={{ margin: "8px 0", padding: "6px 10px", background: "var(--secondary-light)", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <strong style={{ color: "var(--primary-dark)" }}>الزوجة:</strong> {family.wifeName}
                      {family.wifeId && <div><strong>هوية الزوجة:</strong> {family.wifeId}</div>}
                      {family.wifeDob && <div><strong>تاريخ ميلاد الزوجة:</strong> {family.wifeDob}</div>}
                    </div>
                  )}
                  <div className="card-detail">
                    <span className="detail-label"><FaPhoneAlt /> الهاتف:</span>
                    <span className="detail-val ltr-span">{family.phone}</span>
                  </div>
                  <div className="card-detail">
                    <span className="detail-label"><FaUserFriends /> أفراد الأسرة:</span>
                    <span className="detail-val badge-val">{family.membersCount} أفراد</span>
                  </div>
                  {family.notes && (
                    <div className="card-detail notes">
                      <span className="detail-label">ملاحظات:</span>
                      <p className="detail-val">{family.notes}</p>
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  <button onClick={() => onEdit(family)} className="card-btn-action edit">
                    <FaEdit /> تعديل البيانات
                  </button>
                  <button onClick={() => onDelete(family.id, family.name)} className="card-btn-action delete">
                    <FaTrashAlt /> حذف السجل
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
    </div>
  );
};

export default FamilyTable;
