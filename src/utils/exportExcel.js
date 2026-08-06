import * as XLSX from "xlsx";

/**
 * دالة توليد وتنزيل ملف Excel منسق بالكامل بخصائص PDF (ألوان، ترويسة، حدود، تنسيق اتجاه RTL، وحفظ أرقام الهواتف والـ IDs كـ نص)
 */
const downloadStyledExcel = (filename, title, metaLines, headers, rows) => {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${title.replace(/[\/\\?*:[\]]/g, " ")}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayRightToLeft/>
                <x:Gridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Cairo', 'Segoe UI', 'Arial', sans-serif; direction: rtl; text-align: right; }
        table { border-collapse: collapse; width: 100%; direction: rtl; margin-bottom: 20px; }
        .title-cell { background-color: #047857; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; height: 50px; vertical-align: middle; border: 1px solid #047857; }
        .meta-cell { background-color: #ecfdf5; color: #065f46; font-size: 10.5pt; font-weight: bold; text-align: right; height: 32px; vertical-align: middle; padding-right: 15px; border: 1px solid #a7f3d0; }
        .th-cell { background-color: #0f172a; color: #ffffff; font-size: 11pt; font-weight: bold; text-align: center; height: 40px; vertical-align: middle; border: 1px solid #334155; white-space: nowrap; padding: 4px 10px; }
        .td-cell { border: 1px solid #cbd5e1; font-size: 10pt; height: 32px; vertical-align: middle; padding: 4px 8px; font-weight: 500; }
        .td-text { mso-number-format: "\\@"; text-align: center; }
        .td-num { text-align: center; }
        .td-right { text-align: right; }
        .even-row { background-color: #ffffff; }
        .odd-row { background-color: #f8fafc; }
      </style>
    </head>
    <body dir="rtl">
      <table>
        <tr>
          <td colspan="${headers.length}" class="title-cell">${title}</td>
        </tr>
        ${metaLines.map(line => `
          <tr>
            <td colspan="${headers.length}" class="meta-cell">${line}</td>
          </tr>
        `).join("")}
        <tr><td colspan="${headers.length}" style="height:12px;"></td></tr>
        <thead>
          <tr>
            ${headers.map(h => `<th class="th-cell">${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, rIdx) => `
            <tr class="${rIdx % 2 === 0 ? "even-row" : "odd-row"}">
              ${row.map(cell => `
                <td class="td-cell ${cell.isText ? "td-text" : cell.align === "center" ? "td-num" : "td-right"}">
                  ${cell.value !== null && cell.value !== undefined ? String(cell.value) : ""}
                </td>
              `).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * تصدير قائمة العائلات إلى ملف Excel منسق وجذاب
 */
export const exportToExcel = (families, campProfile = null) => {
  const campName = campProfile?.name || "نظام إدارة المخيمات";
  const managerName = campProfile?.managerName || "ربيع جمال جودة جودة";
  const managerPhone = campProfile?.managerPhone || "0599099693";

  const today = new Date();
  const dateStr = today.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const headers = [
    "الرقم التسلسلي",
    "اسم رب الأسرة رباعي",
    "رقم الهوية",
    "تاريخ ميلاد رب الأسرة",
    "الحالة الاجتماعية",
    "اسم الزوجة رباعي",
    "رقم هوية الزوجة",
    "تاريخ ميلاد الزوجة",
    "رقم الجوال / الهاتف",
    "عدد أفراد الأسرة",
    "مكان السكن (الخيمة/الكرفان)",
    "ملاحظات"
  ];

  const rows = families.map((f, index) => [
    { value: index + 1, align: "center" },
    { value: f.name || "", align: "right" },
    { value: f.idNumber || "", isText: true },
    { value: f.dob || "-", align: "center" },
    { value: f.status || "أعزب", align: "center" },
    { value: f.wifeName || "-", align: "right" },
    { value: f.wifeId || "-", isText: true },
    { value: f.wifeDob || "-", align: "center" },
    { value: f.phone || "", isText: true },
    { value: parseInt(f.membersCount) || 1, align: "center" },
    { value: f.location || "-", align: "right" },
    { value: f.notes || "-", align: "right" }
  ]);

  const title = `كشف عائلات ${campName} العام`;
  const metaLines = [
    `تاريخ التصدير: ${dateStr}`,
    `إجمالي العائلات: ${families.length} عائلة  |  مسؤول المخيم: ${managerName}  (جوال: ${managerPhone})`
  ];

  downloadStyledExcel(`كشف عائلات ${campName}.xls`, title, metaLines, headers, rows);
};

/**
 * تصدير قائمة الترشيحات إلى ملف Excel منسق ومفصل بالكامل
 */
export const exportNominationsToExcel = (nominations, campProfile = null) => {
  const campName = campProfile?.name || "نظام إدارة المخيمات";
  const managerName = campProfile?.managerName || "ربيع جمال جوده جودة";
  const managerPhone = campProfile?.managerPhone || "0599099693";

  const today = new Date();
  const dateStr = today.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const headers = [
    "الرقم",
    "اسم رب الأسرة رباعي",
    "رقم الهوية",
    "الجنس",
    "الحالة الاجتماعية",
    "رقم الجوال",
    "رقم الجوال البديل",
    "اسم الزوجة الأولى رباعي",
    "رقم هوية الزوجة الأولى",
    "اسم الزوجة الثانية رباعي",
    "رقم هوية الزوجة الثانية",
    "إجمالي عدد أفراد الأسرة",
    "0-2 ذكور",
    "0-2 إناث",
    "3-5 ذكور",
    "3-5 إناث",
    "6-18 ذكور",
    "6-18 إناث",
    "19-60 ذكور",
    "19-60 إناث",
    "60+ ذكور",
    "60+ إناث",
    "ذوي إعاقة",
    "أمراض مزمنة",
    "حامل/مرضعة",
    "معيل امرأة",
    "عنوان السكن الحالي",
    "عنوان السكن الأصلي",
    "المحافظة",
    "اسم المخيم",
    "مدير مركز الإيواء",
    "رقم تواصل المدير",
    "رقم التواص المعيل البديل",
    "عنوان مركز الإيواء بالتفصيل",
    "إحداثيات GPS"
  ];

  const rows = nominations.map((n, index) => [
    { value: n.serialNo || index + 1, align: "center" },
    { value: n.name || "", align: "right" },
    { value: n.idNumber || "", isText: true },
    { value: n.gender || "ذكر", align: "center" },
    { value: n.status || "متزوج", align: "center" },
    { value: n.phone || "", isText: true },
    { value: n.phoneAlt || "-", isText: true },
    { value: n.wifeName || "-", align: "right" },
    { value: n.wifeId || "-", isText: true },
    { value: n.wife2Name || "-", align: "right" },
    { value: n.wife2Id || "-", isText: true },
    { value: parseInt(n.membersCount) || 1, align: "center" },
    { value: parseInt(n.age_0_2_male) || 0, align: "center" },
    { value: parseInt(n.age_0_2_female) || 0, align: "center" },
    { value: parseInt(n.age_3_5_male) || 0, align: "center" },
    { value: parseInt(n.age_3_5_female) || 0, align: "center" },
    { value: parseInt(n.age_6_18_male) || 0, align: "center" },
    { value: parseInt(n.age_6_18_female) || 0, align: "center" },
    { value: parseInt(n.age_19_60_male) || 0, align: "center" },
    { value: parseInt(n.age_19_60_female) || 0, align: "center" },
    { value: parseInt(n.age_over_60_male) || 0, align: "center" },
    { value: parseInt(n.age_over_60_female) || 0, align: "center" },
    { value: n.hasDisabled ? "1" : "0", align: "center" },
    { value: n.hasChronicDisease ? "1" : "0", align: "center" },
    { value: n.isLactatingOrPregnant ? "1" : "0", align: "center" },
    { value: n.isFemaleHeaded ? "1" : "0", align: "center" },
    { value: n.currentAddress || "-", align: "right" },
    { value: n.originalAddress || "-", align: "right" },
    { value: n.governorate || "شمال غزة", align: "center" },
    { value: n.campName || campName, align: "right" },
    { value: n.shelterManager || managerName, align: "right" },
    { value: n.shelterPhone || "-", isText: true },
    { value: n.shelterPhoneAlt || "-", isText: true },
    { value: n.shelterAddress || "-", align: "right" },
    { value: n.shelterGps || "-", align: "right" }
  ]);

  const title = `كشف ترشيحات ${campName} العام (المفصل)`;
  const metaLines = [
    `تاريخ التصدير: ${dateStr}`,
    `إجمالي الترشيحات: ${nominations.length} عائلة مرشحة  |  مسؤول المخيم: ${managerName}  (جوال: ${managerPhone})`
  ];

  downloadStyledExcel(`كشف ترشيحات ${campName}.xls`, title, metaLines, headers, rows);
};
