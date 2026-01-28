import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string; 
  lastName: string;
  birthDate?: Timestamp | Date;
  photoURL: string, 
}

export interface AuthState {
  user: FirebaseUser | null; 
  isLoading: boolean;
  isAuthenticated: boolean;
}