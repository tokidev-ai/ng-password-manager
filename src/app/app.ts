import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly user = this.auth.user;

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
