import * as XLSX from "xlsx";

/**
 * تصدير قائمة العائلات إلى ملف Excel
 * @param {Array} families - مصفوفة العائلات المراد تصديرها
 */
export const exportToExcel = (families) => {
  // تجهيز البيانات باللغة العربية
  const formattedData = families.map((f, index) => ({
    "الرقم التسلسلي": index + 1,
    "اسم رب الأسرة": f.name,
    "رقم الهوية لرب الأسرة": f.idNumber,
    "تاريخ ميلاد رب الأسرة": f.dob || "غير محدد",
    "الحالة الاجتماعية": f.status || "أعزب",
    "اسم الزوجة": f.wifeName || "لا يوجد",
    "رقم هوية الزوجة": f.wifeId || "لا يوجد",
    "تاريخ ميلاد الزوجة": f.wifeDob || "لا يوجد",
    "رقم الهاتف": f.phone,
    "عدد الأفراد": f.membersCount,
    "مكان السكن (الخيمة/الكرفان)": f.location,
    "ملاحظات": f.notes || "لا يوجد"
  }));

  // إنشاء ورقة العمل (Worksheet) مع ترك أول 4 أسطر للعنوان والمسؤول والتاريخ
  const worksheet = XLSX.utils.json_to_sheet(formattedData, { origin: "A5" });

  // إضافة العنوان والتاريخ ومعلومات المسؤول في الأعلى
  const today = new Date();
  const dateStr = today.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  XLSX.utils.sheet_add_aoa(worksheet, [
    ["كشف عائلات مخيم كريم العام"],
    [`تاريخ التصدير: ${dateStr}`],
    ["مسؤول المخيم: ربيع جمال جودة جودة  |  جوال: 0599099693"]
  ], { origin: "A1" });

  // جعل اتجاه الورقة من اليمين إلى اليسار (RTL) لتناسب اللغة العربية
  if (!worksheet["!views"]) worksheet["!views"] = [];
  worksheet["!views"].push({ RTL: true });

  // تحديد عرض الأعمدة بشكل تلقائي ليناسب المحتوى
  const maxLengths = {};
  // إضافة طول العناوين
  if (formattedData.length > 0) {
    Object.keys(formattedData[0]).forEach(key => {
      maxLengths[key] = Math.max(key.length, 12); // الحد الأدنى 12 حرف
    });

    // حساب طول البيانات
    formattedData.forEach(row => {
      Object.keys(row).forEach(key => {
        const valStr = String(row[key] || "");
        maxLengths[key] = Math.max(maxLengths[key], valStr.length);
      });
    });

    // تعيين عرض الأعمدة في ورقة العمل
    worksheet["!cols"] = Object.keys(maxLengths).map(key => ({
      wch: maxLengths[key] + 3 // إضافة مسافة أمان
    }));
  }

  // إنشاء كتاب العمل (Workbook) وإضافة الورقة إليه
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "كشف العائلات");

  // حفظ وتنزيل الملف
  XLSX.writeFile(workbook, "كشف عائلات مخيم كريم.xlsx");
};

/**
 * تصدير قائمة الترشيحات إلى ملف Excel
 * @param {Array} nominations - مصفوفة الترشيحات المراد تصديرها
 */
export const exportNominationsToExcel = (nominations) => {
  // تجهيز البيانات باللغة العربية مع كافة التفاصيل
  const formattedData = nominations.map((n, index) => ({
    "الرقم التسلسلي": n.serialNo || index + 1,
    "اسم رب الأسرة رباعي": n.name,
    "رقم الهوية": n.idNumber,
    "الجنس": n.gender || "ذكر",
    "الحالة الاجتماعية": n.status || "متزوج",
    "رقم الجوال ": n.phone || "غير محدد",
    "رقم الجوال البديل": n.phoneAlt || "لا يوجد",
    " اسم الزوجة رباعي": n.wifeName || "لا يوجد",
    "رقم هوية الزوجة": n.wifeId || "لا يوجد",
    "اسم الزوجة الثانية رباعي": n.wife2Name || "لا يوجد",
    "رقم هوية الزوجة الثانية": n.wife2Id || "لا يوجد",
    "اجمالي عدد أفراد الأسرة": n.membersCount || 1,
    "عدد الافراد 2-0 (ذكور)": n.age_0_2_male || 0,
    "عدد الافراد 2-0 (إناث)": n.age_0_2_female || 0,
    "عدد الافراد 5-3 (ذكور)": n.age_3_5_male || 0,
    "عدد الافراد 5-3 (إناث)": n.age_3_5_female || 0,
    "عدد الأفراد 18-6 (ذكور)": n.age_6_18_male || 0,
    "عدد الأفراد 18-6 (إناث)": n.age_6_18_female || 0,
    "عدد الأفراد 60-19 (ذكور)": n.age_19_60_male || 0,
    "عدد الأفراد 60-19 (إناث)": n.age_19_60_female || 0,
    "عدد الأفراد اكثر من 60 (ذكور)": n.age_over_60_male || 0,
    "عدد الأفراد اكثر من 60 (إناث)": n.age_over_60_female || 0,
    "الافراد ذوي الاعاقة ( 0 / 1 )": n.hasDisabled || 0,
    "الافراد المصابين بامراض مزمنة ( 0 / 1 )": n.hasChronicDisease || 0,
    "امرأة مرضعة أو حامل ( 1 / 0 )": n.isLactatingOrPregnant || 0,
    "هل تعيل الاسرة امرأة ( 1 / 0 )": n.isFemaleHeaded || 0,
    "عنوان السكن الحالي ": n.currentAddress || "غير محدد",
    "عنوان السكن الأصلي ": n.originalAddress || "غير محدد",
    "المحافظة": n.governorate || "شمال غزة",
    "اسم المخيم ": n.campName || "مخيم كريم",
    "مدير مركز الايواء": n.shelterManager || "ربيع جمال جوده جودة",
    "رقم التواصل ": n.shelterPhone || "0599099693",
    "رقم التواصل البديل": n.shelterPhoneAlt || "لا يوجد",
    "عنوان مركز الايواء بالتفصيل": n.shelterAddress || "غير محدد",
    "احداثيات موقع مركز الايواء GPS": n.shelterGps || "غير محدد"
  }));

  // إنشاء ورقة العمل (Worksheet) مع ترك أول 4 أسطر للعنوان والمسؤول والتاريخ
  const worksheet = XLSX.utils.json_to_sheet(formattedData, { origin: "A5" });

  // إضافة العنوان والتاريخ ومعلومات المسؤول في الأعلى
  const today = new Date();
  const dateStr = today.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  XLSX.utils.sheet_add_aoa(worksheet, [
    ["كشف ترشيحات مخيم كريم العام (كشف الترشيحات المفصل)"],
    [`تاريخ التصدير: ${dateStr}`],
    ["مسؤول المخيم: ربيع جمال جودة جودة  |  جوال: 0599099693"]
  ], { origin: "A1" });

  // جعل اتجاه الورقة من اليمين إلى اليسار (RTL) لتناسب اللغة العربية
  if (!worksheet["!views"]) worksheet["!views"] = [];
  worksheet["!views"].push({ RTL: true });

  // تحديد عرض الأعمدة بشكل تلقائي ليناسب المحتوى
  const maxLengths = {};
  if (formattedData.length > 0) {
    Object.keys(formattedData[0]).forEach(key => {
      maxLengths[key] = Math.max(key.length, 12); // الحد الأدنى 12 حرف
    });

    formattedData.forEach(row => {
      Object.keys(row).forEach(key => {
        const valStr = String(row[key] || "");
        maxLengths[key] = Math.max(maxLengths[key], valStr.length);
      });
    });

    // تعيين عرض الأعمدة في ورقة العمل
    worksheet["!cols"] = Object.keys(maxLengths).map(key => ({
      wch: maxLengths[key] + 3 // إضافة مسافة أمان
    }));
  }

  // إنشاء كتاب العمل (Workbook) وإضافة الورقة إليه
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "كشف الترشيحات");

  // حفظ وتنزيل الملف
  XLSX.writeFile(workbook, "كشف ترشيحات مخيم كريم.xlsx");
};
