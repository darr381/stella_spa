import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage on mount
    const storedUser = localStorage.getItem('naturaSpaUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.phone) {
          setUser(parsed);
        }
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (name, phone) => {
    try {
      const userRef = doc(db, 'users', phone);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = { id: docSnap.id, ...docSnap.data() };
        
        setUser(userData);
        localStorage.setItem('naturaSpaUser', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, notFound: true, error: 'User account not found' };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, phone) => {
    try {
      const userRef = doc(db, 'users', phone);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        return { success: false, error: 'Handphone number already registered.' };
      }

      const newUser = { name, phone, createdAt: new Date() };
      await setDoc(userRef, newUser);
      const userData = { id: phone, ...newUser };

      setUser(userData);
      localStorage.setItem('naturaSpaUser', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('naturaSpaUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
