import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export const citizenService = {
  getCitizenReports: (userId, onData, onError) => {
    const q = query(
      collection(db, 'reports'),
      where('user_id', '==', userId),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(
      q,
      (snapshot) => onData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))),
      onError
    );
  },

  getReportDetails: async (referenceNumber) => {
    const q = query(collection(db, 'reports'), where('reference_number', '==', referenceNumber));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
    }
    return null;
  },

  getCitizenProfile: async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  },

  updateProfile: async (userId, updates) => {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updates);
  },

  getNotifications: (userId, onData, onError) => {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(
      q,
      (snapshot) => onData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))),
      onError
    );
  },

  markNotificationRead: async (notificationId) => {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { read: true });
  },

  getReportStatistics: (reports) => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === 'pending').length,
      verified: reports.filter((r) => r.status === 'verified').length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
    };
  },
};
