import { Inject, inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import AuthService from '../../auth/service/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = inject(AuthService).getTokenJwt()

  const newReq = req.clone({
    headers: req.headers.append(`Authorization`, `Bearer ${token}`),
  });
  return next(newReq);
}
