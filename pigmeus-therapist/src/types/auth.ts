import { User as FirebaseUser } from 'firebase/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string; 
  lastName: string;
}

export interface AuthState {
  user: FirebaseUser | null; 
  isLoading: boolean;
  isAuthenticated: boolean;
}