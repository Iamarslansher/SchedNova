import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

export const saveDocument = async (collectionName, data, id) => {
  // ensure ownership is attached to every document
  const resolvedUserId = data?.userId || auth?.currentUser?.uid || null;

  const base = {
    ...data,
    userId: resolvedUserId,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    await setDoc(doc(db, collectionName, id), base, { merge: true });
    return id;
  }

  const reference = await addDoc(collection(db, collectionName), {
    ...base,
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

// helper: get all documents in a collection for a specific userId
export const getDocumentsByUser = async (collectionName, userId) => {
  if (!userId) return [];
  return queryDocuments(collectionName, [where("userId", "==", userId)]);
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
