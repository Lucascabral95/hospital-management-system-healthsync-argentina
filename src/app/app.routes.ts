import { Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/pages/app-dashboard/app-dashboard.component';
import { IsAdmissionGuard } from './auth/guards/not-autheticated.guard';
import { authGuard } from './auth/guards/not-autheticated-auth.guard';
import PatientAppointmentComponent from './appointments/pages/patient-appointment/patient-appointment/patient-appointment.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canActivate: [authGuard],
  },
  {
    path: 'appointments/patient',
    component: PatientAppointmentComponent,
  },
  {
    path: '',
    component: AppDashboardComponent,
    canActivate: [IsAdmissionGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes'),
      },
      {
        path: 'doctors/detail',
        loadChildren: () => import('./doctors/doctors.route'),
      },
      {
        path: 'patients',
        loadChildren: () => import('./patients/patients.routes'),
      },
      {
        path: 'interments',
        loadChildren: () => import('./interment/interment.route'),
      },
      {
        path: 'appointments',
        loadChildren: () => import('./appointments/appointments.routes'),
      },
      {
        path: '',
        redirectTo: 'patients',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'patients',
      }
    ]
  }
];
