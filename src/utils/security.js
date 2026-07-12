import CryptoJS from "crypto-js";

// مفتاح التشفير الافتراضي
// يمكن للمستخدم تخصيصه في ملف .env تحت اسم REACT_APP_ENCRYPTION_KEY
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || "kareem-camp-secret-key-2026-secure";

/**
 * تشفير البيانات إلى نص مشفر AES
 * @param {any} data - البيانات المراد تشفيرها
 * @returns {string} النص المشفر
 */
export const encryptData = (data) => {
  try {
    if (data === null || data === undefined) return "";
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

/**
 * فك تشفير النص المشفر AES إلى البيانات الأصلية
 * @param {string} ciphertext - النص المشفر
 * @returns {any} البيانات الأصلية بعد فك التشفير
 */
export const decryptData = (ciphertext) => {
  try {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
