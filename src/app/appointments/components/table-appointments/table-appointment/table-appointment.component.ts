import { Component, inject, input } from '@angular/core';
import { GetAppointmentsDto } from '../../../interfaces/get-appointments.interface';
import { DatePipe } from '@angular/common';
import ServiceAppointments from '../../../service/appointments-service.service';

@Component({
  selector: 'app-table-appointment',
  imports: [DatePipe],
  templateUrl: './table-appointment.component.html',
})
export default class TableAppointmentComponent {
  appointmentService = inject(ServiceAppointments)
  appointments = input<GetAppointmentsDto[]>()

  onUpdateStatusCompleted(id: number) {
    this.appointmentService.updateStatusCompleted(id)
  }

  onUpdateStatusInProgress(id: number) {
    this.appointmentService.updateStatusInProgress(id)
  }
}
