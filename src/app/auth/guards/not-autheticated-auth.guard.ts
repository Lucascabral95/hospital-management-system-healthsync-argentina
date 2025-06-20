import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import ServiceAuth from '../service/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(ServiceAuth);

  if (authService.IsAuthenticated() === true) {
    router.navigate(['/patients']);
    return false;
  }

  return true;
};
