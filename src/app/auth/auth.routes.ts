import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/Auth.guard";

const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/app-login/app-login.component'),
    canActivate: [AuthGuard],
  }, {
    path: 'register',
    loadComponent: () => import('./pages/app-register/app-register.component'),
  }, {
    path: "**",
    redirectTo: '',
  }
]

export default authRoutes;
