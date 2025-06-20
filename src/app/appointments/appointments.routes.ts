import { Routes } from "@angular/router";

const appointMentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/app-appointments/app-appointments.component'),
  }, {
    path: "**",
    redirectTo: '',
  }
]

export default appointMentsRoutes;
