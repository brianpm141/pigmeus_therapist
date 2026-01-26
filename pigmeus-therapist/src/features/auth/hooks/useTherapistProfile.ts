import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/core/firebase/firebaseConfig';
import { TherapistProfile } from '@/types/users';

export const useTherapistProfile = () => {
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    
    if (!user) {
      setLoading(false);
      return;
    }

    // Referencia al documento con el ID del terapeuta
    const docRef = doc(db, "therapists", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        // Mapeo directo a la interfaz TherapistProfile
        setProfile(docSnap.data() as TherapistProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error en onSnapshot Perfil:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { profile, loading };
};