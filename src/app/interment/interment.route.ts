import { Routes } from "@angular/router";
import IntermentAppComponent from "./pages/interment-app/interment-app.component";
import IntermentDetailComponent from "./pages/interment-detail/interment-detail.component";

const intermentRoutes: Routes = [
  {
    path: '',
    component: IntermentAppComponent,
  }, {
    path: 'detail',
    component: IntermentDetailComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./pages/interment-detail/interment-detail.component')
      },
    ]
  }, {
    path: "**",
    redirectTo: ''
  }
]

export default intermentRoutes;
