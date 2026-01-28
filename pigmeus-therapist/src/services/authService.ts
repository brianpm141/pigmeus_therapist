import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  AuthError
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore"; 
import { auth, db } from "@/core/firebase/firebaseConfig";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(password);
};

export const AuthService = {
  register: async ({ email, password, firstName, lastName , birthDate, photoURL }: RegisterCredentials) => {
    
    if (!validateEmail(email)) throw new Error("auth/invalid-email");
    if (!validatePassword(password)) throw new Error("auth/weak-password");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      await setDoc(doc(db, "therapists", uid), {
        uid,
        email,
        firstName,
        lastName,
        birthDate: birthDate,
        photoURL: photoURL || '', 
        stats: { totalPatients: 0, totalAppointments: 0 }, 
        createdAt: serverTimestamp(), 
        role: 'therapist',
      });

      return userCredential.user;
    } catch (error) {
      throw error as AuthError;
    }
  },

  login: async ({ email, password }: LoginCredentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error as AuthError;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error as AuthError;
    }
  },
  

  loginWithGoogle: async (idToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const { uid, email, displayName, photoURL } = userCredential.user;

      // Verificar si el documento del terapeuta ya existe
      const docRef = doc(db, "therapists", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Si es la primera vez que entra con Google, creamos su perfil
        const nameParts = displayName?.split(' ') || [];
        await setDoc(docRef, {
          uid,
          email,
          firstName: nameParts[0] || 'Nuevo',
          lastName: nameParts.slice(1).join(' ') || 'Terapeuta',
          photoURL: photoURL || '',
          birthDate: null,
          role: 'therapist',
          stats: { totalPatients: 0, totalAppointments: 0 },
          createdAt: serverTimestamp(),
        });
      }
      return userCredential.user;
    } catch (error) {
      console.error("Error en Google Login Service:", error);
      throw error;
    }
  }
};

export const updateTherapistProfile = async (
  uid: string, 
  data: { firstName: string; lastName: string; photoURL?: string; birthDate?: Date } 
) => {
  try {
    const therapistRef = doc(db, 'therapists', uid);
    await updateDoc(therapistRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
};