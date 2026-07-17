import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PasswordEntry } from '../models/password-entry.model';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private col() {
    const uid = this.auth.currentUser!.uid;
    return collection(this.firestore, `users/${uid}/passwords`);
  }

  list(): Observable<PasswordEntry[]> {
    return collectionData(this.col(), { idField: 'id' }) as Observable<PasswordEntry[]>;
  }

  create(entry: Pick<PasswordEntry, 'web' | 'password' | 'email' | 'username'>) {
    return addDoc(this.col(), {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  update(id: string, entry: Partial<PasswordEntry>) {
    const uid = this.auth.currentUser!.uid;
    return updateDoc(doc(this.firestore, `users/${uid}/passwords/${id}`), {
      ...entry,
      updatedAt: serverTimestamp(),
    });
  }

  delete(id: string) {
    const uid = this.auth.currentUser!.uid;
    return deleteDoc(doc(this.firestore, `users/${uid}/passwords/${id}`));
  }
}
