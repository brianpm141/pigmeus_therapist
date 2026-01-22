import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const savePatient = async (patientData: any) => {
  try {
    // Referencia a la colección 'patients'
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      createdAt: serverTimestamp(), // Marca de tiempo del servidor
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving patient:", error);
    throw error;
  }
};