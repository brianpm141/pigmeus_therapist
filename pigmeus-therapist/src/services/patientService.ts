import { db } from './firebase';
import { doc, collection, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Patient } from '@/types/patient';

export const savePatient = async (patientData: any) => {
  try {
    // Referencia a la colección 'patients'
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      createdAt: serverTimestamp(), 
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving patient:", error);
    throw error;
  }
};

export const updatePatient = async (id: string, data: Partial<Patient>) => {
  try {
    const patientRef = doc(db, 'patients', id);

    await updateDoc(patientRef, {
      ...data,
      updatedAt: serverTimestamp(), 
    });
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el paciente: ", error);
    throw error;
  }
};

export const deletePatient = async (id: string) => {
  try {
    const patientRef = doc(db, 'patients', id);
    await deleteDoc(patientRef);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el paciente: ", error);
    throw error;
  }
};