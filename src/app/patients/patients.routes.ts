import { Routes } from "@angular/router";
import PatientDetailComponent from "./pages/patient-detail/patient-detail.component";

const patientsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/app-patients/app-patients.component'),
  }, {
    path: 'detail',
    component: PatientDetailComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./pages/patient-detail/patient-detail.component')
      },
    ]
  }, {
    path: "**",
    redirectTo: '',
  }
]

export default patientsRoutes;
