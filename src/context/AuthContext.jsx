import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../services/firebase/firebaseConfig";
import { saveUser, getUserById } from "../services/firebase/firestoreService";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
