import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Importante para tiempo real
import { auth, db } from '../../core/firebase/firebaseConfig';
import { TherapistProfile } from '@/types/users';

interface AuthContextType {
  user: User | null;
  userProfile: TherapistProfile | null; // El perfil de Firestore
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<TherapistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // 1. Si hay usuario, escuchamos su documento en Firestore
        const profileRef = doc(db, 'therapists', firebaseUser.uid);
        
        unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as TherapistProfile);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error escuchando perfil:", error);
          setIsLoading(false);
        });
      } else {
        // 2. Si no hay usuario, limpiamos todo
        setUserProfile(null);
        if (unsubscribeProfile) unsubscribeProfile();
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile,
      isLoading, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);