import React, { useState } from "react";
import NominationTable from "../components/NominationTable";
import NominationForm from "../components/NominationForm";
import { addNomination, updateNomination, deleteNomination } from "../services/nominationService";
import { exportNominationsToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPDF";
import { FaPlus, FaFileExcel, FaFilePdf, FaExclamationTriangle, FaTimes } from "react-icons/fa";

const Nominations = ({ nominations }) => {
  // حالات النوافذ المنبثقة
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState(null); // للترشيح المحدد عند التعديل
  
  // حالات حذف ترشيح
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nominationToDelete, setNominationToDelete] = useState({ id: "", name: "" });

  // إشعار التنبيه
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // فتح النموذج للإضافة
  const handleOpenAdd = () => {
    setSelectedNomination(null);
    setIsFormOpen(true);
  };

  // فتح النموذج للتعديل
  const handleOpenEdit = (nomination) => {
    setSelectedNomination(nomination);
    setIsFormOpen(true);
  };

  // فتح تأكيد الحذف
  const handleOpenDelete = (id, name) => {
    setNominationToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  // حفظ الإضافة أو التعديل
  const handleSaveNomination = async (formData) => {
    try {
      if (selectedNomination) {
        // تعديل
        await updateNomination(selectedNomination.id, formData);
        showNotification(`تم تحديث بيانات المرشح "${formData.name}" بنجاح`);
      } else {
        // إضافة جديدة
        await addNomination(formData);
        showNotification(`تم تسجيل المرشح "${formData.name}" بنجاح`);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving nomination:", error);
      showNotification("حدث خطأ غير متوقع أثناء الحفظ. يرجى المحاولة لاحقاً.", "error");
    }
  };

  // تنفيذ الحذف النهائي
  const handleConfirmDelete = async () => {
    try {
      await deleteNomination(nominationToDelete.id);
      showNotification(`تم حذف سجل المرشح "${nominationToDelete.name}" بنجاح`);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting nomination:", error);
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

      {/* ترويسة صفحة الترشيحات */}
      <header className="page-header">
        <div className="page-header-info">
          <h1>✏️ إدارة كشف الترشيحات المفصل</h1>
          <p>قائمة كاملة بالعائلات المرشحة للمساعدات مع فلترة الحالات الصحية الخاصة والمحافظات وخيارات تصدير التقارير.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <FaPlus /> إضافة عائلة مرشحة
          </button>
          <button 
            onClick={() => exportNominationsToExcel(nominations)} 
            className="btn btn-excel"
            title="تصدير Excel"
            style={{ borderColor: "#b89647", color: "#b89647" }}
            disabled={nominations.length === 0}
          >
            <FaFileExcel /> تصدير Excel
          </button>
          <button 
            onClick={() => exportToPDF(nominations, "nominations")} 
            className="btn btn-pdf"
            title="تصدير PDF"
            style={{ borderColor: "#b89647", color: "#b89647" }}
            disabled={nominations.length === 0}
          >
            <FaFilePdf /> تصدير PDF / طباعة
          </button>
        </div>
      </header>

      {/* جدول الترشيحات والبحث والفلاتر */}
      <NominationTable 
        nominations={nominations}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* نموذج الإضافة والتعديل */}
      <NominationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveNomination}
        nomination={selectedNomination}
      />

      {/* نافذة تأكيد الحذف المنبثقة */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>تأكيد حذف ترشيح عائلة</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="btn-close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="delete-modal-body">
              <p>هل تريد حذف ترشيح عائلة <strong>"{nominationToDelete.name}"</strong>؟</p>
              <span className="delete-warning-text">تحذير: سيتم إزالة هذه العائلة من كشف الترشيحات نهائياً ولا يمكن التراجع عن هذا الإجراء لاحقاً.</span>
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

export default Nominations;
