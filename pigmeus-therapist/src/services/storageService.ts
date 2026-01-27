import { storage } from '@/core/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export const uploadImage = async (uri: string, path: string): Promise<string> => {
  try {
    // Firebase requiere un Blob o ArrayBuffer para la subida en web/mobile
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, path);
    
    // Subida de bytes
    await uploadBytes(storageRef, blob);
    
    // Obtención de la URL para guardar en Firestore
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error crítico en StorageService:", error);
    throw error;
  }
};