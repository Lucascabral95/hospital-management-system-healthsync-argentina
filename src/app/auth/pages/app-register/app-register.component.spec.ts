import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import AppRegisterComponent from './app-register.component';
import ServiceAuth from '../../service/auth.service';
import { of } from 'rxjs';

describe('AppRegisterComponent', () => {
  let fixture: ComponentFixture<AppRegisterComponent>;
  let component: AppRegisterComponent;

  const serviceAuthMock: any = {
    register: jasmine.createSpy('register').and.returnValue(
      of({ message: 'Registro exitoso' })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRegisterComponent, RouterTestingModule],
      providers: [{ provide: ServiceAuth, useValue: serviceAuthMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit valid form and navigate to /auth', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.myForm.setValue({
      full_name: 'John Doe',
      role: 'ADMIN',
      email: 'john@demo.com',
      password: 'Aa12345!',
    });

    component.onSubmit();
    tick(2600);

    expect(serviceAuthMock.register).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth']);
  }));
});

