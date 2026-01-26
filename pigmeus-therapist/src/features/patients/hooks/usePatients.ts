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


export const usePatients = (therapistId: string) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!therapistId) return;

    // Consulta: Solo pacientes de este terapeuta, ordenados por nombre
    const q = query(
      collection(db, 'patients'),
      //where('therapistId', '==', therapistId),
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
      }, 
      (err) => {
        console.error("Error fetching patients: ", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [therapistId]);

  return { patients, loading, error };
};