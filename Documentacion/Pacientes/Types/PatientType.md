# Patient Interface

**Ubicación**: `src/types/patient.ts`

## Descripción
Define la estructura de datos TypeScript para un Paciente en el sistema.

## Definición
```typescript
import { Timestamp } from 'firebase/firestore';

export interface Patient {
  // Identificador único del documento en Firestore
  id: string;
  
  // Nombre concatenado para vistas resumidas
  fullName: string;
  
  // Información demográfica básica
  personalInfo: {
    bornDate: Timestamp;    // Fecha de nacimiento (Firebase Timestamp)
    age: number;            // Edad calculada (numérica, para análisis)
    gender: string;         // 'male' | 'female' | 'other'
  };
  
  // Métricas físicas
  physicalMetrcs: {
    weight: number;         // Peso en kg
    height: number;         // Altura en metros
  };
  
  // Datos clínicos
  clinicalRecord: {
    diagnosis: string;
    treatmentPlan: string;
  };
  
  // Datos de contacto
  contact: {
    phone: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };
  
  // Información de agenda
  nextAppointment?: string; // Opcional
}
```
