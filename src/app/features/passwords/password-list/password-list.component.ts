import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordEntry } from '../../../core/models/password-entry.model';
import { PasswordService } from '../../../core/services/password.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PasswordFormComponent } from '../password-form/password-form.component';

@Component({
  selector: 'app-password-list',
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatListModule],
  templateUrl: './password-list.component.html',
})
export class PasswordListComponent {
  private passwordService = inject(PasswordService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private readonly entriesSignal = toSignal(this.passwordService.list(), { initialValue: undefined });
  readonly entries = computed(() => this.entriesSignal() ?? []);
  readonly loading = computed(() => this.entriesSignal() === undefined);

  private readonly revealed = signal<Set<string>>(new Set());

  isRevealed(id: string | undefined): boolean {
    return !!id && this.revealed().has(id);
  }

  toggleReveal(id: string | undefined) {
    if (!id) return;
    const next = new Set(this.revealed());
    next.has(id) ? next.delete(id) : next.add(id);
    this.revealed.set(next);
  }

  async copyPassword(password: string) {
    await navigator.clipboard.writeText(password);
    this.snackBar.open('Password copied to clipboard', 'Dismiss', { duration: 2000 });
  }

  openCreate() {
    const ref = this.dialog.open(PasswordFormComponent, { data: { entry: null }, width: '400px' });
    ref.afterClosed().subscribe(async (value) => {
      if (!value) return;
      try {
        await this.passwordService.create(value);
        this.snackBar.open('Entry saved', 'Dismiss', { duration: 2000 });
      } catch {
        this.snackBar.open('Could not save entry. Please try again.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  openEdit(entry: PasswordEntry) {
    const ref = this.dialog.open(PasswordFormComponent, { data: { entry }, width: '400px' });
    ref.afterClosed().subscribe(async (value) => {
      if (!value || !entry.id) return;
      try {
        await this.passwordService.update(entry.id, value);
        this.snackBar.open('Entry updated', 'Dismiss', { duration: 2000 });
      } catch {
        this.snackBar.open('Could not update entry. Please try again.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  openDelete(entry: PasswordEntry) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete entry', message: `Delete the entry for "${entry.web}"? This cannot be undone.` },
    });
    ref.afterClosed().subscribe(async (confirmed) => {
      if (!confirmed || !entry.id) return;
      try {
        await this.passwordService.delete(entry.id);
        this.snackBar.open('Entry deleted', 'Dismiss', { duration: 2000 });
      } catch {
        this.snackBar.open('Could not delete entry. Please try again.', 'Dismiss', { duration: 4000 });
      }
    });
  }
}
