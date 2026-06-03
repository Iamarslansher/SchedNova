import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveDocument = async (collectionName, data, id) => {
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    await setDoc(doc(db, collectionName, id), payload, { merge: true });
    return id;
  }

  const reference = await addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return reference.id;
};

export const getDocumentById = async (collectionName, id) => {
  const reference = doc(db, collectionName, id);
  const snapshot = await getDoc(reference);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const queryDocuments = async (collectionName, constraints = []) => {
  const reference = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);
  const snapshot = await getDocs(reference);
  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));
};

export const saveInstitute = async (instituteId, data) =>
  saveDocument("institutes", data, instituteId);
export const saveTeacher = async (teacherId, data) =>
  saveDocument("teachers", data, teacherId);
export const saveSubject = async (subjectId, data) =>
  saveDocument("subjects", data, subjectId);
export const saveSection = async (sectionId, data) =>
  saveDocument("sections", data, sectionId);
export const saveTimetable = async (data) => saveDocument("timetables", data);

export const saveUser = async (userId, data) =>
  saveDocument("Users", data, userId);
export const getUserById = async (id) => getDocumentById("Users", id);
export const saveRoom = async (roomId, data) =>
  saveDocument("rooms", data, roomId);
export const saveLab = async (labId, data) => saveDocument("labs", data, labId);
export const getRoom = async (id) => getDocumentById("rooms", id);
export const getLab = async (id) => getDocumentById("labs", id);
