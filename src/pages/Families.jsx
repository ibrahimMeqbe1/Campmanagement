import React, { useState } from "react";
import FamilyTable from "../components/FamilyTable";
import FamilyForm from "../components/FamilyForm";
import { addFamily, updateFamily, deleteFamily } from "../services/familyService";
import { exportToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPDF";
import { FaPlus, FaFileExcel, FaFilePdf, FaExclamationTriangle, FaTimes } from "react-icons/fa";

const Families = ({ families }) => {
  // حالات النوافذ المنبثقة
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null); // للعائلة المحددة عند التعديل
  
  // حالات حذف عائلة
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState({ id: "", name: "" });

  // إشعار التنبيه
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // فتح النموذج للإضافة
  const handleOpenAdd = () => {
    setSelectedFamily(null);
    setIsFormOpen(true);
  };

  // فتح النموذج للتعديل
  const handleOpenEdit = (family) => {
    setSelectedFamily(family);
    setIsFormOpen(true);
  };

  // فتح تأكيد الحذف
  const handleOpenDelete = (id, name) => {
    setFamilyToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  // حفظ الإضافة أو التعديل
  const handleSaveFamily = async (formData) => {
    try {
      if (selectedFamily) {
        // تعديل
        await updateFamily(selectedFamily.id, formData);
        showNotification(`تم تحديث بيانات العائلة "${formData.name}" بنجاح`);
      } else {
        // إضافة جديدة
        await addFamily(formData);
        showNotification(`تم تسجيل العائلة "${formData.name}" بنجاح`);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving family:", error);
      showNotification("حدث خطأ غير متوقع أثناء الحفظ. يرجى المحاولة لاحقاً.", "error");
    }
  };

  // تنفيذ الحذف النهائي
  const handleConfirmDelete = async () => {
    try {
      await deleteFamily(familyToDelete.id);
      showNotification(`تم حذف سجل عائلة "${familyToDelete.name}" بنجاح`);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting family:", error);
      showNotification("حدث خطأ أثناء محاولة حذف السجل.", "error");
    }
  };

  return (
    <div className="families-page-container">
      {/* التنبيهات النصية السريعة */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* ترويسة صفحة العائلات */}
      <header className="page-header">
        <div className="page-header-info">
          <h1>إدارة سجلات العائلات</h1>
          <p>قائمة كاملة ببيانات العائلات المسجلة في مخيم كريم مع خيارات البحث والتصدير والتحديث.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <FaPlus /> إضافة عائلة
          </button>
          <button 
            onClick={() => exportToExcel(families)} 
            className="btn btn-excel"
            title="تصدير Excel"
            disabled={families.length === 0}
          >
            <FaFileExcel /> تصدير Excel
          </button>
          <button 
            onClick={() => exportToPDF(families)} 
            className="btn btn-pdf"
            title="تصدير PDF"
            disabled={families.length === 0}
          >
            <FaFilePdf /> تصدير PDF
          </button>
        </div>
      </header>

      {/* جدول العائلات والبحث */}
      <FamilyTable 
        families={families}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* نموذج الإضافة والتعديل */}
      <FamilyForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveFamily}
        family={selectedFamily}
      />

      {/* نافذة تأكيد الحذف المنبثقة */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>تأكيد حذف السجل</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="btn-close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="delete-modal-body">
              <p>هل تريد حذف عائلة <strong>"{familyToDelete.name}"</strong>؟</p>
              <span className="delete-warning-text">تحذير: سيتم حذف كافة البيانات المرتبطة بهذه العائلة نهائياً ولا يمكن التراجع عن هذا الإجراء لاحقاً.</span>
            </div>
            <div className="delete-modal-actions">
              <button 
                onClick={handleConfirmDelete} 
                className="btn-delete-confirm"
              >
                نعم، احذف السجل
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="btn-delete-cancel"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Families;
