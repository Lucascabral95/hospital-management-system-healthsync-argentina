import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceDoctor } from './service-doctor.service';

describe('ServiceDoctor', () => {
  let service: ServiceDoctor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceDoctor],
    });
    service = TestBed.inject(ServiceDoctor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDoctors should GET and then use cache', () => {
    const mockDoctors = { totalPage: 1, page: 1, total: 1, data: [] } as any;

    let first: any;
    service.getDoctors(1, 100, 'full_name', 'desc').subscribe((res) => (first = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/auth'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('100');
    expect(req.request.params.get('sortedBy')).toBe('full_name');
    expect(req.request.params.get('order')).toBe('desc');
    req.flush(mockDoctors);
    expect(first).toEqual(mockDoctors);

    let second: any;
    service.getDoctors(1, 100, 'full_name', 'desc').subscribe((res) => (second = res));
    expect(second).toEqual(mockDoctors);
    httpMock.expectNone((r) => r.url.endsWith('/auth'));
  });

  it('getDoctorById should GET detail', () => {
    const mockDetail = {
      id: 1,
      full_name: 'Dr Test',
      email: 'dr@test.com',
      password: '',
      role: 'DOCTOR',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      Doctor: [{ id: 1, specialty: 'Clinician', licenceNumber: 123, createdAt: new Date(), updatedAt: new Date(), authId: 1 }],
    } as any;

    let result: any;
    service.getDoctorById(1).subscribe((res) => (result = res));
    const req = httpMock.expectOne((r) => r.url.match(/\/auth\/1$/) !== null);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetail);
    expect(result).toEqual(mockDetail);
  });
});

