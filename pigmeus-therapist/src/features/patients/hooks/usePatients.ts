import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/core/firebase/firebaseConfig'; 
import { Patient } from '@/types/patient';

/**
 * Hook para obtener la lista de pacientes de un terapeuta específico.
 * @param therapistId El ID del terapeuta (obtenido de la sesión)
 */

export const usePatients = (therapistId: string | undefined) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!therapistId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, 'patients'),
      where('therapistId', '==', therapistId),
      orderBy('fullName', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const patientList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Patient[];
        
        setPatients(patientList);
        setLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error("Error al obtener pacientes: ", err);
        setError("No se pudo cargar la lista de pacientes.");
        setLoading(false);
      }
    );

    // Limpieza del listener al desmontar el componente
    return () => unsubscribe();
  }, [therapistId]);

  return { patients, loading, error };
};