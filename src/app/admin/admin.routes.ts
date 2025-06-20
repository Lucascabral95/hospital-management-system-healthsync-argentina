import { Routes } from "@angular/router";
import AppAdminComponent from "./pages/app-admin/app-admin.component";

const adminRoutes: Routes = [
  {
    path: '',
    component: AppAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'doctors',
        pathMatch: 'full'
      },
      {
        path: 'doctors',
        loadComponent: () => import('../doctors/pages/app-doctors/app-doctors.component')
      },
      {
        path: 'doctors/id/:id',
        loadComponent: () => import('../doctors/pages/app-doctors/app-doctors.component')
      },
      {
        path: 'patients',
        loadComponent: () => import('../patients/pages/app-patients/app-patients.component')
      },
      {
        path: 'interments',
        loadComponent: () => import('../interment/pages/interment-app/interment-app.component')
      },
      {
        path: 'appointments',
        loadComponent: () => import('../appointments/pages/app-appointments/app-appointments.component')
      }
    ]
  }
];

export default adminRoutes;
