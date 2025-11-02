import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import AppLoginComponent from './app-login.component';
import ServiceAuth from '../../service/auth.service';
import { of } from 'rxjs';

describe('AppLoginComponent', () => {
  let fixture: ComponentFixture<AppLoginComponent>;
  let component: AppLoginComponent;

  const serviceAuthMock: any = {
    router: undefined,
    login: jasmine.createSpy('login').and.returnValue(
      of({ message: 'Login ok', token: 'a.b.c' })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLoginComponent, RouterTestingModule],
      providers: [{ provide: ServiceAuth, useValue: serviceAuthMock }],
    }).compileComponents();

    serviceAuthMock.router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AppLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit valid form and navigate to /doctors/detail', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.myForm.setValue({ email: 'test@demo.com', password: '123456' });
    component.onSubmit();

    tick(1600);
    expect(serviceAuthMock.login).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/doctors/detail']);
  }));
});

