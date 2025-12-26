import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

export const POINTS_CONFIG = {
  ATTENDANCE: 20,
  TASK_COMPLETION: 10,
  FEEDBACK: 10
};

export const addPoints = async (userEmail: string, points: number): Promise<void> => {
  try {
    const usersRef = doc(db, 'users', userEmail.toLowerCase());

    const userDoc = await getDoc(usersRef);
    if (!userDoc.exists()) {
      console.error('User not found');
      return;
    }

    await updateDoc(usersRef, {
      points: increment(points)
    });
  } catch (error) {
    console.error('Error adding points:', error);
    throw error;
  }
};

export const getUserPoints = async (userEmail: string): Promise<number> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userEmail.toLowerCase()));
    return userDoc.data()?.points || 0;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return 0;
  }
};
