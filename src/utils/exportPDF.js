/**
 * تصدير قائمة العائلات أو الترشيحات إلى صفحة الطباعة المخصصة لـ PDF والورق
 * @param {Array} data - مصفوفة البيانات
 * @param {string} type - نوع البيانات (families أو nominations)
 */
export const exportToPDF = (data, type = "families") => {
  // حفظ البيانات في التخزين المؤقت لتمريرها لصفحة الطباعة
  localStorage.setItem("kareem_camp_print_data", JSON.stringify(data));
  localStorage.setItem("kareem_camp_print_type", type);
  // فتح صفحة الطباعة في نافذة جديدة تابعة لموقع التطبيق لتجنب مشاكل المتصفح الأمنية
  window.open("/print", "_blank");
};
