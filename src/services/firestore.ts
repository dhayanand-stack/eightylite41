import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProjectData } from '../types';

export const getProjectData = async (code: string): Promise<ProjectData> => {
  const docRef = doc(db, 'projects', code);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as ProjectData;
  } else {
    // Create new empty project
    const newProject: ProjectData = {
      images: [],
      templates: []
    };
    await setDoc(docRef, newProject);
    return newProject;
  }
};

export const updateProjectData = async (code: string, data: ProjectData): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await setDoc(docRef, data);
};

export const updateProjectImages = async (code: string, images: string[]): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await updateDoc(docRef, { images });
};

export const updateProjectTemplates = async (code: string, templates: any[]): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await updateDoc(docRef, { templates });
};

export const deleteProject = async (code: string): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await deleteDoc(docRef);
};
