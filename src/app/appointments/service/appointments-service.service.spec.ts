import ServiceAppointments from './appointments-service.service';

describe('ServiceAppointments (spect)', () => {
  it('should be defined as a class', () => {
    expect(ServiceAppointments).toBeDefined();
    expect(typeof ServiceAppointments).toBe('function');
  });
});

