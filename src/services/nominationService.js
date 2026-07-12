import { db, isDemoMode } from "../firebase/config";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import defaultNominations from "./nominationsDefault.json";

const initLocalStorage = () => {
  if (!localStorage.getItem("kareem_camp_nominations_v2")) {
    localStorage.setItem("kareem_camp_nominations_v2", JSON.stringify(defaultNominations));
  }
};

const demoSubscribers = new Set();

const notifyDemoSubscribers = () => {
  const nominations = getDemoNominations();
  demoSubscribers.forEach(cb => cb(nominations));
};

const getDemoNominations = () => {
  initLocalStorage();
  const data = JSON.parse(localStorage.getItem("kareem_camp_nominations_v2") || "[]");
  // Sort by serialNo
  return data.sort((a, b) => (a.serialNo || 0) - (b.serialNo || 0));
};

/**
 * الاشتراك في تحديثات الترشيحات في الوقت الفعلي
 */
export const subscribeNominations = (callback) => {
  if (isDemoMode) {
    initLocalStorage();
    demoSubscribers.add(callback);
    callback(getDemoNominations());
    return () => {
      demoSubscribers.delete(callback);
    };
  } else {
    const q = query(collection(db, "nominations"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      const nominations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : new Date().toISOString()
      }));
      callback(nominations);
    }, (error) => {
      console.error("Firestore nominations listening error, falling back to Local Storage:", error);
      initLocalStorage();
      demoSubscribers.add(callback);
      callback(getDemoNominations());
    });
  }
};

/**
 * إضافة ترشيح جديد
 */
export const addNomination = async (nomData) => {
  const cleanPhone = (val) => {
    if (!val) return '';
    let str = String(val).trim();
    if (/^\d+$/.test(str)) {
      if (!str.startsWith('0') && str.length === 9) {
        str = '0' + str;
      }
    }
    return str;
  };

  const getNum = (val) => {
    const parsed = parseInt(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const newNom = {
    name: nomData.name.trim(),
    idNumber: nomData.idNumber.trim(),
    gender: nomData.gender || "ذكر",
    status: nomData.status || "متزوج",
    phone: cleanPhone(nomData.phone),
    phoneAlt: cleanPhone(nomData.phoneAlt),
    wifeName: nomData.wifeName ? nomData.wifeName.trim() : "",
    wifeId: nomData.wifeId ? nomData.wifeId.trim() : "",
    wife2Name: nomData.wife2Name ? nomData.wife2Name.trim() : "",
    wife2Id: nomData.wife2Id ? nomData.wife2Id.trim() : "",
    membersCount: getNum(nomData.membersCount) || 1,
    
    // Detailed breakdown
    age_0_2_male: getNum(nomData.age_0_2_male),
    age_0_2_female: getNum(nomData.age_0_2_female),
    age_3_5_male: getNum(nomData.age_3_5_male),
    age_3_5_female: getNum(nomData.age_3_5_female),
    age_6_18_male: getNum(nomData.age_6_18_male),
    age_6_18_female: getNum(nomData.age_6_18_female),
    age_19_60_male: getNum(nomData.age_19_60_male),
    age_19_60_female: getNum(nomData.age_19_60_female),
    age_over_60_male: getNum(nomData.age_over_60_male),
    age_over_60_female: getNum(nomData.age_over_60_female),
    
    hasDisabled: nomData.hasDisabled ? 1 : 0,
    hasChronicDisease: nomData.hasChronicDisease ? 1 : 0,
    isLactatingOrPregnant: nomData.isLactatingOrPregnant ? 1 : 0,
    isFemaleHeaded: nomData.isFemaleHeaded ? 1 : 0,
    currentAddress: nomData.currentAddress ? nomData.currentAddress.trim() : "",
    originalAddress: nomData.originalAddress ? nomData.originalAddress.trim() : "",
    governorate: nomData.governorate || "شمال غزة",
    campName: nomData.campName ? nomData.campName.trim() : "مخيم كريم",
    shelterManager: nomData.shelterManager ? nomData.shelterManager.trim() : "ربيع جمال جوده جودة",
    shelterPhone: cleanPhone(nomData.shelterPhone),
    shelterPhoneAlt: cleanPhone(nomData.shelterPhoneAlt),
    shelterAddress: nomData.shelterAddress ? nomData.shelterAddress.trim() : "",
    shelterGps: nomData.shelterGps ? nomData.shelterGps.trim() : "",
    createdAt: new Date().toISOString()
  };

  if (isDemoMode) {
    const nominations = getDemoNominations();
    const id = "demo-nom-" + Date.now();
    const maxSerial = nominations.reduce((max, n) => Math.max(max, n.serialNo || 0), 0);
    const serialNo = maxSerial + 1;
    nominations.push({ id, serialNo, ...newNom });
    localStorage.setItem("kareem_camp_nominations_v2", JSON.stringify(nominations));
    notifyDemoSubscribers();
    return id;
  } else {
    const docRef = await addDoc(collection(db, "nominations"), {
      ...newNom,
      createdAt: new Date()
    });
    return docRef.id;
  }
};

/**
 * تعديل ترشيح
 */
export const updateNomination = async (id, nomData) => {
  const cleanPhone = (val) => {
    if (!val) return '';
    let str = String(val).trim();
    if (/^\d+$/.test(str)) {
      if (!str.startsWith('0') && str.length === 9) {
        str = '0' + str;
      }
    }
    return str;
  };

  const getNum = (val) => {
    const parsed = parseInt(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const updatedNom = {
    name: nomData.name.trim(),
    idNumber: nomData.idNumber.trim(),
    gender: nomData.gender || "ذكر",
    status: nomData.status || "متزوج",
    phone: cleanPhone(nomData.phone),
    phoneAlt: cleanPhone(nomData.phoneAlt),
    wifeName: nomData.wifeName ? nomData.wifeName.trim() : "",
    wifeId: nomData.wifeId ? nomData.wifeId.trim() : "",
    wife2Name: nomData.wife2Name ? nomData.wife2Name.trim() : "",
    wife2Id: nomData.wife2Id ? nomData.wife2Id.trim() : "",
    membersCount: getNum(nomData.membersCount) || 1,
    
    // Detailed breakdown
    age_0_2_male: getNum(nomData.age_0_2_male),
    age_0_2_female: getNum(nomData.age_0_2_female),
    age_3_5_male: getNum(nomData.age_3_5_male),
    age_3_5_female: getNum(nomData.age_3_5_female),
    age_6_18_male: getNum(nomData.age_6_18_male),
    age_6_18_female: getNum(nomData.age_6_18_female),
    age_19_60_male: getNum(nomData.age_19_60_male),
    age_19_60_female: getNum(nomData.age_19_60_female),
    age_over_60_male: getNum(nomData.age_over_60_male),
    age_over_60_female: getNum(nomData.age_over_60_female),
    
    hasDisabled: nomData.hasDisabled ? 1 : 0,
    hasChronicDisease: nomData.hasChronicDisease ? 1 : 0,
    isLactatingOrPregnant: nomData.isLactatingOrPregnant ? 1 : 0,
    isFemaleHeaded: nomData.isFemaleHeaded ? 1 : 0,
    currentAddress: nomData.currentAddress ? nomData.currentAddress.trim() : "",
    originalAddress: nomData.originalAddress ? nomData.originalAddress.trim() : "",
    governorate: nomData.governorate || "شمال غزة",
    campName: nomData.campName ? nomData.campName.trim() : "مخيم كريم",
    shelterManager: nomData.shelterManager ? nomData.shelterManager.trim() : "ربيع جمال جوده جودة",
    shelterPhone: cleanPhone(nomData.shelterPhone),
    shelterPhoneAlt: cleanPhone(nomData.shelterPhoneAlt),
    shelterAddress: nomData.shelterAddress ? nomData.shelterAddress.trim() : "",
    shelterGps: nomData.shelterGps ? nomData.shelterGps.trim() : ""
  };

  if (isDemoMode) {
    const nominations = getDemoNominations();
    const index = nominations.findIndex(n => n.id === id);
    if (index !== -1) {
      nominations[index] = { ...nominations[index], ...updatedNom };
      localStorage.setItem("kareem_camp_nominations_v2", JSON.stringify(nominations));
      notifyDemoSubscribers();
    }
  } else {
    const docRef = doc(db, "nominations", id);
    await updateDoc(docRef, updatedNom);
  }
};

/**
 * حذف ترشيح
 */
export const deleteNomination = async (id) => {
  if (isDemoMode) {
    let nominations = getDemoNominations();
    nominations = nominations.filter(n => n.id !== id);
    localStorage.setItem("kareem_camp_nominations_v2", JSON.stringify(nominations));
    notifyDemoSubscribers();
  } else {
    const docRef = doc(db, "nominations", id);
    await deleteDoc(docRef);
  }
};

/**
 * استيراد الترشيحات الافتراضية بالكامل إلى Firestore
 */
export const importDefaultNominationsToFirestore = async () => {
  if (isDemoMode) return { success: false, error: "النظام يعمل حالياً في الوضع التجريبي. يرجى ربط Firebase أولاً." };
  
  try {
    console.log("Starting bulk import of default nominations to Firestore...");
    for (const nom of defaultNominations) {
      const nomData = {
        serialNo: nom.serialNo,
        name: nom.name,
        idNumber: nom.idNumber,
        gender: nom.gender,
        status: nom.status,
        phone: nom.phone,
        phoneAlt: nom.phoneAlt,
        wifeName: nom.wifeName,
        wifeId: nom.wifeId,
        wife2Name: nom.wife2Name,
        wife2Id: nom.wife2Id,
        membersCount: nom.membersCount,
        
        // Gender breakdown
        age_0_2_male: nom.age_0_2_male,
        age_0_2_female: nom.age_0_2_female,
        age_3_5_male: nom.age_3_5_male,
        age_3_5_female: nom.age_3_5_female,
        age_6_18_male: nom.age_6_18_male,
        age_6_18_female: nom.age_6_18_female,
        age_19_60_male: nom.age_19_60_male,
        age_19_60_female: nom.age_19_60_female,
        age_over_60_male: nom.age_over_60_male,
        age_over_60_female: nom.age_over_60_female,
        
        hasDisabled: nom.hasDisabled,
        hasChronicDisease: nom.hasChronicDisease,
        isLactatingOrPregnant: nom.isLactatingOrPregnant,
        isFemaleHeaded: nom.isFemaleHeaded,
        currentAddress: nom.currentAddress,
        originalAddress: nom.originalAddress,
        governorate: nom.governorate,
        campName: nom.campName,
        shelterManager: nom.shelterManager,
        shelterPhone: nom.shelterPhone,
        shelterPhoneAlt: nom.shelterPhoneAlt,
        shelterAddress: nom.shelterAddress,
        shelterGps: nom.shelterGps,
        createdAt: new Date()
      };
      await addDoc(collection(db, "nominations"), nomData);
    }
    console.log("Bulk import of nominations completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error during bulk import of nominations to Firestore:", error);
    return { success: false, error: error.message };
  }
};
