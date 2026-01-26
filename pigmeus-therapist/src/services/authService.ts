import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  AuthError
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Importante
import { auth, db } from "@/core/firebase/firebaseConfig";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";

export const AuthService = {
  
  register: async ({ email, password, firstName, lastName }: RegisterCredentials) => {
    try {
      // 1. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // 2. Crear el perfil profesional en Firestore
      // Usamos doc(db, 'coleccion', id) para que el ID del documento sea el mismo UID de Auth
      await setDoc(doc(db, "therapists", uid), {
        uid,
        email,
        firstName,
        lastName,
        stats: { totalPatients: 0, totalAppointments: 0 }, // Tus contadores precalculados
        createdAt: serverTimestamp(), // Fecha de servidor para evitar errores de zona horaria
        role: 'therapist'
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
  
  // ... login con redes sociales pendiente
};