import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      min-width: 0;
      margin-left: 256px;
      min-height: 100vh;
      background: var(--bg);
    }
  `],
  template: `
    @if (auth.isLoggedIn()) {
      <div class="app-layout">
        <app-navbar />
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    } @else {
      <router-outlet />
    }
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
