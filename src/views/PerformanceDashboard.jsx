import React, { useState } from "react";
import { 
  FaPlus, 
  FaSearch, 
  FaSlidersH, 
  FaCheckCircle, 
  FaRegClock, 
  FaHourglassHalf, 
  FaEllipsisV,
  FaRegBell,
  FaRegCommentDots,
  FaSignOutAlt,
  FaClipboardList
} from "react-icons/fa";
import "./PerformanceDashboard.css";

const PerformanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("جميع الأقسام");
  const [selectedStatus, setSelectedStatus] = useState("جميع الحالات");

  const initialData = [
    {
      id: 1,
      employeeName: "محمد خالد",
      role: "مسؤول إداري",
      evaluationTitle: "تقييم الاداء السنوي",
      evaluationDesc: "تقييم شامل للاداء",
      year: "2024",
      period: "يناير-ديسمبر",
      status: "مكتملة",
      progress: 100,
      dueDate: "31ديسمبر2024",
      dueStatus: "منتهي",
      department: "مسؤول إداري"
    },
    {
      id: 2,
      employeeName: "سارة أحمد",
      role: "موارد بشرية",
      evaluationTitle: "تقييم الاداء النصف سنوي",
      evaluationDesc: "تقييم النصف اول",
      year: "2024",
      period: "يناير-يونيو",
      status: "قيد التنفيذ",
      progress: 60,
      dueDate: "30يونيو2024",
      dueStatus: "متبقي 15يوم",
      department: "موارد بشرية"
    },
    {
      id: 3,
      employeeName: "علي حسن",
      role: "تخطيط ومتابعة",
      evaluationTitle: "تقييم الاداء السنوي",
      evaluationDesc: "تقييم شامل للاداء",
      year: "2024",
      period: "يناير-ديسمبر",
      status: "لم تبدأ",
      progress: 0,
      dueDate: "31ديسمبر2024",
      dueStatus: "متبقي 200 يوم",
      department: "تخطيط ومتابعة"
    },
    {
      id: 4,
      employeeName: "نورة حمد",
      role: "مسؤول إداري",
      evaluationTitle: "تقييم الاداء النصف سنوي",
      evaluationDesc: "تقييم النصف اول",
      year: "2024",
      period: "يناير-يونيو",
      status: "مكتملة",
      progress: 100,
      dueDate: "30يونيو2024",
      dueStatus: "منتهي",
      department: "مسؤول إداري"
    },
    {
      id: 5,
      employeeName: "ياسر محمد",
      role: "موارد بشرية",
      evaluationTitle: "تقييم الاداء السنوي",
      evaluationDesc: "تقييم شامل للاداء",
      year: "2024",
      period: "يناير-ديسمبر",
      status: "قيد التنفيذ",
      progress: 60,
      dueDate: "31ديسمبر2024",
      dueStatus: "متبقي 180 يوم",
      department: "موارد بشرية"
    },
    {
      id: 6,
      employeeName: "مهند حسن",
      role: "تخطيط ومتابعة",
      evaluationTitle: "تقييم الاداء السنوي",
      evaluationDesc: "تقييم شامل للاداء",
      year: "2024",
      period: "يناير-ديسمبر",
      status: "لم تبدأ",
      progress: 0,
      dueDate: "31ديسمبر2024",
      dueStatus: "متبقي 200 يوم",
      department: "تخطيط ومتابعة"
    }
  ];

  // فلترة البيانات بناء على شريط البحث والقوائم المنسدلة
  const filteredData = initialData.filter(item => {
    const matchesSearch = 
      item.employeeName.includes(searchTerm) || 
      item.evaluationTitle.includes(searchTerm) ||
      item.role.includes(searchTerm);
    
    const matchesDept = selectedDept === "جميع الأقسام" || item.role === selectedDept;
    
    const matchesStatus = selectedStatus === "جميع الحالات" || item.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="perf-dashboard-wrapper">
      {/* 1. الترويسة العلوية */}
      <header className="perf-topbar">
        {/* اليمين: الشعار الحكومي لوزارة الاقتصاد */}
        <div className="perf-topbar-right">
          <div className="perf-gov-logo">
            <svg className="perf-logo-img" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* رسم تعبيري مبسط وفخم لنسر فلسطين (العقاب) باللون الذهبي والبرونزي */}
              <path d="M50 15 L53 25 L58 20 L55 30 L65 25 L58 35 L62 45 L50 38 L38 45 L42 35 L35 25 L45 30 L42 20 L47 25 Z" fill="#b89647" />
              <path d="M50 38 L55 55 L75 42 L72 58 L85 52 L78 68 L88 72 L70 78 L72 85 L60 80 L58 90 L50 82 L42 90 L40 80 L28 85 L30 78 L12 72 L22 68 L15 52 L28 58 L25 42 L45 55 Z" fill="#9e7c35" />
              {/* الدرع الأوسط مع الألوان الوطنية */}
              <rect x="46" y="52" width="8" height="15" rx="4" fill="#1b1b1b" stroke="#ffffff" strokeWidth="1" />
              <path d="M46 56 H54 V59 H46 Z" fill="#ffffff" />
              <path d="M46 59 H54 V62 H46 Z" fill="#15803d" />
              <path d="M46 52 L50 56 L46 59 Z" fill="#dc2626" />
            </svg>
            <div className="perf-logo-text">
              <span className="perf-logo-title">وزارة الاقتصاد الوطني</span>
              <span className="perf-logo-sub">Ministry of National Economy</span>
            </div>
          </div>
        </div>

        {/* اليسار: الملف الشخصي والأيقونات */}
        <div className="perf-topbar-left">
          <div className="perf-topbar-icons">
            <button className="perf-topbar-btn" title="تسجيل الخروج">
              <FaSignOutAlt />
            </button>
            <button className="perf-topbar-btn" title="التنبيهات">
              <FaRegBell />
              <span className="perf-badge-dot"></span>
            </button>
            <button className="perf-topbar-btn" title="المحادثات">
              <FaRegCommentDots />
            </button>
          </div>
          <div className="perf-user-profile">
            <img 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" 
              alt="صورة المستخدم" 
              className="perf-avatar" 
            />
          </div>
        </div>
      </header>

      {/* 2. حاوية المحتوى الرئيسي */}
      <main className="perf-main-container">
        
        {/* ترويسة الصفحة والعنوان */}
        <div className="perf-header-section">
          <h1 className="perf-main-title">إدارة و متابعة تقييمات الأداء للموظفين</h1>
          <p className="perf-main-subtitle">
            استعرض تقييمات الموظفين لمتابعة مستوى الأداء، ودعم اتخاذ القرارات، وتعزيز التطوير المستمر.
          </p>
        </div>

        {/* زر "تقييم جديد" */}
        <div className="perf-btn-container">
          <button className="perf-btn-primary">
            <span className="perf-btn-plus"><FaPlus /></span>
            <span>تقييم جديد</span>
          </button>
        </div>

        {/* 3. شبكة كروت الإحصائيات الأربعة */}
        <section className="perf-stats-grid">
          
          {/* كرت إجمالي التقييمات */}
          <div className="perf-stat-card perf-card-total">
            <div className="perf-stat-info">
              <span className="perf-stat-title">إجمالي التقييمات</span>
              <strong className="perf-stat-value">120</strong>
              <span className="perf-stat-desc">هذا العام</span>
            </div>
            <div className="perf-stat-icon-wrapper">
              <FaClipboardList />
            </div>
          </div>

          {/* كرت تقييمات مكتملة */}
          <div className="perf-stat-card perf-card-completed">
            <div className="perf-stat-info">
              <span className="perf-stat-title">تقييمات مكتملة</span>
              <strong className="perf-stat-value">75</strong>
              <span className="perf-stat-desc">
                <span className="perf-stat-percentage">62.5%</span> من إجمالي التقييمات
              </span>
            </div>
            <div className="perf-stat-icon-wrapper">
              <FaCheckCircle />
            </div>
          </div>

          {/* كرت قيد التنفيذ */}
          <div className="perf-stat-card perf-card-running">
            <div className="perf-stat-info">
              <span className="perf-stat-title">قيد التنفيذ</span>
              <strong className="perf-stat-value">32</strong>
              <span className="perf-stat-desc">
                <span className="perf-stat-percentage">26.7%</span> من إجمالي التقييمات
              </span>
            </div>
            <div className="perf-stat-icon-wrapper">
              <FaRegClock />
            </div>
          </div>

          {/* كرت تقييمات لم تبدأ */}
          <div className="perf-stat-card perf-card-notstarted">
            <div className="perf-stat-info">
              <span className="perf-stat-title">تقييمات لم تبدأ</span>
              <strong className="perf-stat-value">13</strong>
              <span className="perf-stat-desc">
                <span className="perf-stat-percentage">10.8%</span> من إجمالي التقييمات
              </span>
            </div>
            <div className="perf-stat-icon-wrapper">
              <FaHourglassHalf />
            </div>
          </div>

        </section>

        {/* 4. صندوق التصفية والجدول */}
        <section className="perf-content-box">
          
          {/* شريط البحث والفلترة */}
          <div className="perf-filter-row">
            <div className="perf-filter-right">
              {/* حقل البحث المخصص */}
              <div className="perf-search-wrapper">
                <span className="perf-search-icon-right"><FaSearch /></span>
                <input 
                  type="text" 
                  className="perf-search-input" 
                  placeholder="ابحث عن موظف او تقييم"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="perf-search-icon-left"><FaSlidersH /></span>
              </div>

              {/* فلتر الأقسام */}
              <select 
                className="perf-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="جميع الأقسام">جميع الأقسام</option>
                <option value="مسؤول إداري">مسؤول إداري</option>
                <option value="موارد بشرية">موارد بشرية</option>
                <option value="تخطيط ومتابعة">تخطيط ومتابعة</option>
              </select>

              {/* فلتر الحالات */}
              <select 
                className="perf-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="جميع الحالات">جميع الحالات</option>
                <option value="مكتملة">مكتملة</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="لم تبدأ">لم تبدأ</option>
              </select>
            </div>

            {/* زر التصفية على اليسار */}
            <div className="perf-filter-left">
              <button className="perf-filter-btn">
                <span className="perf-filter-icon-part"><FaSlidersH /></span>
                <span className="perf-filter-text-part">تصفية</span>
              </button>
            </div>
          </div>

          {/* جدول الموظفين */}
          <div className="perf-table-wrapper">
            <table className="perf-table">
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th>التقييم</th>
                  <th>الفترة</th>
                  <th>الحالة</th>
                  <th>التقدم</th>
                  <th>تاريخ الاستحقاق</th>
                  <th>اجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  let statusClass = "notstarted";
                  if (row.status === "مكتملة") statusClass = "completed";
                  else if (row.status === "قيد التنفيذ") statusClass = "running";

                  let dateStatusClass = "notstarted";
                  if (row.dueStatus === "منتهي") dateStatusClass = "completed";
                  else if (row.dueStatus.includes("متبقي 15يوم")) dateStatusClass = "running";

                  return (
                    <tr key={row.id}>
                      {/* الموظف */}
                      <td>
                        <div className="perf-emp-cell">
                          <span className="perf-cell-title">{row.employeeName}</span>
                          <span className="perf-cell-subtitle">{row.role}</span>
                        </div>
                      </td>

                      {/* التقييم */}
                      <td>
                        <div className="perf-eval-cell">
                          <span className="perf-cell-title">{row.evaluationTitle}</span>
                          <span className="perf-cell-subtitle">{row.evaluationDesc}</span>
                        </div>
                      </td>

                      {/* الفترة */}
                      <td>
                        <div className="perf-period-cell">
                          <span className="perf-cell-title">{row.year}</span>
                          <span className="perf-cell-subtitle">{row.period}</span>
                        </div>
                      </td>

                      {/* الحالة */}
                      <td>
                        <span className={`perf-status-badge ${statusClass}`}>
                          {row.status}
                        </span>
                      </td>

                      {/* التقدم */}
                      <td>
                        <div className="perf-progress-wrapper">
                          <div className="perf-progress-track">
                            <div 
                              className={`perf-progress-fill ${statusClass}`} 
                              style={{ width: `${row.progress}%` }}
                            ></div>
                          </div>
                          <span className={`perf-progress-text ${statusClass}`}>
                            {row.progress}%
                          </span>
                        </div>
                      </td>

                      {/* تاريخ الاستحقاق */}
                      <td>
                        <div className="perf-date-cell">
                          <span className="perf-cell-title">{row.dueDate}</span>
                          <span className={`perf-date-status ${dateStatusClass}`}>
                            {row.dueStatus}
                          </span>
                        </div>
                      </td>

                      {/* اجراءات */}
                      <td>
                        <button className="perf-action-btn" title="خيارات الإجراءات">
                          <FaEllipsisV />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "var(--perf-text-muted)" }}>
                      لا يوجد تقييمات مطابقة لخيارات البحث المحددة.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

        {/* 5. تذييل الصفحة */}
        <footer className="perf-footer">
          <div className="perf-footer-links">
            <a href="#rules" className="perf-footer-link">التعليمات</a>
            <span className="perf-footer-divider">|</span>
            <a href="#privacy" className="perf-footer-link">سياسة الخصوصية</a>
            <span className="perf-footer-divider">|</span>
            <a href="#terms" className="perf-footer-link">الشروط و الأحكام</a>
          </div>
          <p className="perf-copyright">
            جميع الحقوق محفوظة لدى وزارة الاقتصاد الوطني ©
          </p>
        </footer>

      </main>
    </div>
  );
};

export default PerformanceDashboard;
