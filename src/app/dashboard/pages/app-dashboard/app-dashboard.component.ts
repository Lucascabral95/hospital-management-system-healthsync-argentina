import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuOptions } from '../../../shared/interfaces/menu.interface';
import { SearchNavComponentComponent } from "../../components/search-nav/search-nav-component/search-nav-component.component";
import ServiceAuth from '../../../auth/service/auth.service';
import { JWTPayload } from '../../../admin/interfaces/jwt-payload.interface';
import { environment } from '../../../../environments/environment.development';
import ModalSearchComponentComponent from "../../../shared/components/modal-search/modal-search-component/modal-search-component.component";

const THEME_DARK_MODE = environment.themeDarkMode;
const THEME_LIGHT_MODE = environment.themeLightMode;

@Component({
  selector: 'app-app-dashboard',
  imports: [RouterOutlet, RouterOutlet, RouterLink, RouterLinkActive, SearchNavComponentComponent, ModalSearchComponentComponent],
  templateUrl: './app-dashboard.component.html',
})
export class AppDashboardComponent {
  authService = inject(ServiceAuth);
  router = inject(Router);

  isAdmin = signal<boolean>(this.authService.rolePersonal() === 'ADMIN');

  sections: MenuOptions[] = [
    { icon: 'fa-solid fa-user-tie', label: 'Admin', subLabel: 'Admin', route: '/admin' },
    { icon: 'fa-solid fa-user', label: 'Mi Perfil', subLabel: 'Mi Perfil', route: '/doctors/detail' },
    { icon: 'fa-solid fa-user-injured', label: 'Pacientes', subLabel: 'Pacientes', route: '/patients' },
    { icon: 'fas fa-bed', label: 'Internación', subLabel: 'Internación', route: '/interments' },
    { icon: 'fa-solid fa-calendar-check', label: 'Citas Médicas', subLabel: 'Citas Médicas', route: '/appointments' },
  ];

  darkMode = signal<boolean>(localStorage.getItem('darkMode') === 'true');

  isOpenSearch = signal<boolean>(false)

  constructor() {
    document.documentElement.setAttribute(
      'data-theme',
      this.darkMode() ? THEME_LIGHT_MODE : THEME_DARK_MODE
    );
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    localStorage.setItem('darkMode', this.darkMode() ? 'true' : 'false');
    document.documentElement.setAttribute('data-theme', !this.darkMode() ? THEME_DARK_MODE : THEME_LIGHT_MODE);
  }

  data = signal<JWTPayload | null>(this.authService.getLocalStorage())
  menuOpen = signal<boolean>(false);

  logout() {
    this.authService.logout();
  }

}
