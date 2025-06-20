import { Routes } from "@angular/router";
import DoctorDetailComponentComponent from "./pages/doctor-detail-component/doctor-detail-component.component";

const DoctorRoutes: Routes = [
  {
    path: '',
    component: DoctorDetailComponentComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./pages/doctor-detail-component/doctor-detail-component.component')
      },
    ]
  }
]

export default DoctorRoutes;
