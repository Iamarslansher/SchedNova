import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../services/firebase/firebaseConfig";
import {
  saveUser,
  getUserById,
  getDocumentsByUser,
} from "../services/firebase/firestoreService";
import { useDispatch } from "react-redux";
import {
  setInstitute,
  setTeachers,
  setSubjects,
  setSections,
  setRooms,
  setLabs,
  setConstraints,
  setSchedule,
} from "../store/scheduleSlice";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("userProfile");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const syncProfile = async () => {
        try {
          let profile = await getUserById(currentUser.uid);

          if (!profile) {
            profile = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || "",
              createdAt: new Date().toISOString(),
            };
            await saveUser(currentUser.uid, profile);
          }

          localStorage.setItem("userId", currentUser.uid);
          localStorage.setItem("userProfile", JSON.stringify(profile));
          // fetch user-owned collections and populate app state
          try {
            const uid = currentUser.uid;
            const [
              teachers,
              subjects,
              sections,
              rooms,
              labs,
              timetables,
              constraints,
            ] = await Promise.all([
              getDocumentsByUser("teachers", uid),
              getDocumentsByUser("subjects", uid),
              getDocumentsByUser("sections", uid),
              getDocumentsByUser("rooms", uid),
              getDocumentsByUser("labs", uid),
              getDocumentsByUser("timetables", uid),
              getDocumentsByUser("settings", uid),
            ]);

            if (teachers) dispatch(setTeachers(teachers));
            if (subjects) dispatch(setSubjects(subjects));
            if (sections) dispatch(setSections(sections));
            if (rooms) dispatch(setRooms(rooms));
            if (labs) dispatch(setLabs(labs));

            // restore most recent timetable if available
            if (timetables && timetables.length > 0) {
              // pick latest by createdAt if available
              const sorted = timetables.sort((a, b) => {
                const ta = a.createdAt?.seconds || 0;
                const tb = b.createdAt?.seconds || 0;
                return tb - ta;
              });
              const latest = sorted[0];
              if (latest?.schedule) dispatch(setSchedule(latest.schedule));
            }

            // settings/constraints stored under settings collection
            if (constraints && constraints.length > 0) {
              // use the first settings doc as constraints
              const s = constraints[0];
              if (s.constraints) dispatch(setConstraints(s.constraints));
              if (s.institute) dispatch(setInstitute(s.institute));
            }
          } catch (err) {
            console.error("Failed to fetch user data after login:", err);
          }
        } catch (error) {
          console.error("Failed to sync user profile:", error);
        } finally {
          setLoading(false);
        }
      };

      syncProfile();
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const currentUser = credential.user;

    const profile = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || "",
      createdAt: new Date().toISOString(),
    };

    await saveUser(currentUser.uid, profile);
    localStorage.setItem("userId", currentUser.uid);
    localStorage.setItem("userProfile", JSON.stringify(profile));

    return credential;
  };

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = credential.user;
    let profile = await getUserById(currentUser.uid);

    if (!profile) {
      profile = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || "",
        createdAt: new Date().toISOString(),
      };
      await saveUser(currentUser.uid, profile);
    }

    localStorage.setItem("userId", currentUser.uid);
    localStorage.setItem("userProfile", JSON.stringify(profile));

    return credential;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const currentUser = result.user;
    let profile = await getUserById(currentUser.uid);

    if (!profile) {
      profile = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || "",
        createdAt: new Date().toISOString(),
      };
      await saveUser(currentUser.uid, profile);
    }

    localStorage.setItem("userId", currentUser.uid);
    localStorage.setItem("userProfile", JSON.stringify(profile));

    return result;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfile");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
