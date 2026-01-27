import { db } from '@/core/firebase/firebaseConfig';
import { 
  doc, 
  collection, 
  writeBatch, 
  updateDoc, 
  getDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { Patient } from '@/types/patient';

/**
 * Guarda paciente
 */
export const savePatient = async (therapistId: string, patientData: Omit<Patient, 'id' | 'therapistId'>) => {
  try {
    const batch = writeBatch(db);
    const patientRef = doc(collection(db, 'patients'));
    const therapistRef = doc(db, 'therapists', therapistId);

    const newPatient = {
      ...patientData,
      therapistId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(patientRef, newPatient);
    
    batch.update(therapistRef, {
      'stats.totalPatients': increment(1)
    });

    await batch.commit();
    return { success: true, id: patientRef.id };
  } catch (error) {
    console.error("Error al guardar paciente:", error);
    throw error;
  }
};

/**
 * Actualiza un paciente
 */
export const updatePatient = async (patientId: string, therapistId: string, data: Partial<Patient>) => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    const snap = await getDoc(patientRef);

    if (!snap.exists() || snap.data().therapistId !== therapistId) {
      throw new Error("No tienes permiso para editar este paciente");
    }

    await updateDoc(patientRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar:", error);
    throw error;
  }
};

/**
 * Elimina un paciente
 */
export const deletePatient = async (patientId: string, therapistId: string) => {
  try {
    const batch = writeBatch(db);
    const patientRef = doc(db, 'patients', patientId);
    const therapistRef = doc(db, 'therapists', therapistId);

    // Verificación de seguridad previa
    const snap = await getDoc(patientRef);
    if (!snap.exists() || snap.data().therapistId !== therapistId) {
      throw new Error("No autorizado");
    }

    batch.delete(patientRef);
    batch.update(therapistRef, {
      'stats.totalPatients': increment(-1)
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    throw error;
  }
};