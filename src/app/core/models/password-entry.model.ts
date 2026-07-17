import { Timestamp } from '@angular/fire/firestore';

export interface PasswordEntry {
  id?: string;
  web: string;
  password: string;
  email?: string;
  username?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
