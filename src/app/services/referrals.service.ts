import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  constructor(private firestore: Firestore) {}

  async findById(id: string) {
    try {
      const docRef = doc(this.firestore, 'referrals', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Firebase getById error:', error);
      return null;
    }
  }

  async findReferral(code: string) {
    const ref = collection(this.firestore, 'referrals');
    const q = query(ref, where('code', '==', code));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }

  async markUsed(docId: string) {
    const ref = doc(this.firestore, `referrals/${docId}`);
    return updateDoc(ref, {
      used: true,
    });
  }
}
