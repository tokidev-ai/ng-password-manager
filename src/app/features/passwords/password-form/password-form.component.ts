import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordEntry } from '../../../core/models/password-entry.model';

export interface PasswordFormData {
  entry: PasswordEntry | null;
}

@Component({
  selector: 'app-password-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PasswordFormComponent>);
  private data = inject<PasswordFormData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data.entry;
  readonly hidePassword = signal(true);

  readonly form = this.fb.nonNullable.group({
    web: [this.data.entry?.web ?? '', Validators.required],
    password: [this.data.entry?.password ?? '', Validators.required],
    email: [this.data.entry?.email ?? '', Validators.email],
    username: [this.data.entry?.username ?? ''],
  });

  togglePasswordVisibility() {
    this.hidePassword.update((v) => !v);
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();
    this.dialogRef.close({
      web: raw.web,
      password: raw.password,
      email: raw.email || undefined,
      username: raw.username || undefined,
    });
  }
}
