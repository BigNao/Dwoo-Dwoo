import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Firestore users/{uid} doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Ensure the auth token is attached before Firestore security rules run.
          await user.getIdToken();
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserProfile(snap.exists() ? snap.data() : null);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register({ name, email, password }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    const profile = {
      user_id: credential.user.uid,
      display_name: name,
      email_address: email,
      registration_timestamp: serverTimestamp(),
      report_count: 0,
      role: "citizen",
    };

    await setDoc(doc(db, "users", credential.user.uid), profile);
    await signOut(auth);

    return profile;
  }

  async function login({ email, password }) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await credential.user.getIdToken();
    const snap = await getDoc(doc(db, "users", credential.user.uid));
    const profile = snap.exists() ? snap.data() : null;
    setUserProfile(profile);
    return { user: credential.user, profile };
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  const isAdmin = userProfile?.role === "admin";
  const isCitizen = userProfile?.role === "citizen";

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    isCitizen,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
