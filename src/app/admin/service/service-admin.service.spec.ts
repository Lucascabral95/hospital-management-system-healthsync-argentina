import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceAdminService } from './service-admin.service';

describe('ServiceAdminService', () => {
  let service: ServiceAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceAdminService],
    });
    service = TestBed.inject(ServiceAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch resources and use cache on subsequent calls', () => {
    const mockResponse = {
      totalDoctors: 1,
      totalPatients: 2,
      totalInterments: 3,
      totalAppointments: 4,
    };

    let first: any;
    service.getAllCountResource().subscribe((res) => (first = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/doctors/dashboard/resources'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    expect(first).toEqual(mockResponse);

    let second: any;
    service.getAllCountResource().subscribe((res) => (second = res));
    expect(second).toEqual(mockResponse);

    httpMock.expectNone((r) => r.url.endsWith('/doctors/dashboard/resources'));
  });
});

