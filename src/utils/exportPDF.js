export const exportToPDF = (data, type = "families", campProfile = null) => {
  // حفظ البيانات في التخزين المؤقت لتمريرها لصفحة الطباعة
  localStorage.setItem("kareem_camp_print_data", JSON.stringify(data));
  localStorage.setItem("kareem_camp_print_type", type);
  if (campProfile) {
    localStorage.setItem("kareem_camp_print_profile", JSON.stringify(campProfile));
  } else {
    localStorage.removeItem("kareem_camp_print_profile");
  }
  // فتح صفحة الطباعة في نافذة جديدة تابعة لموقع التطبيق لتجنب مشاكل المتصفح الأمنية
  window.open("/print", "_blank");
};
