import { Component, input, output, signal } from '@angular/core';
import { SortOrderDoctor } from '../../interfaces/doctors-table.interface';
import { RouterLink } from '@angular/router';
import { ModalCrudComponentComponent } from '../modal-patch-doctor-component/modal-patch-doctor-component.component';
import ModalCreateDoctorComponent_1 from "../modal-create-doctor/modal-create-doctor/modal-create-doctor.component";
import ModalCreateProfileDoctorComponentComponent from "../modal-create-profile-doctor/modal-create-profile-doctor-component/modal-create-profile-doctor-component.component";

@Component({
  selector: 'table-doctors-component',
  imports: [RouterLink, ModalCrudComponentComponent, ModalCreateDoctorComponent_1, ModalCreateProfileDoctorComponentComponent],
  templateUrl: './table-doctors.component.html',
})
export class TableDoctorsComponent {
  columsDoctors = input.required()
  doctors = input.required()

  searchInput = output<string>()
  sortOrder = signal<SortOrderDoctor[]>(['Nombre: ascendente', 'Nombre: descendente', "Sólo activos"])

  isOpenModal = signal<boolean>(false)

  iDDoctorForUpdate = signal<number>(0)

  openModalPatch(doctorId: number) {
    this.iDDoctorForUpdate.set(doctorId)
    this.isOpenModal.set(true)
  }

  filter = output<string>()
  onChange(value: Event) {
    const val = (value.target as HTMLInputElement).value
    this.filter.emit(val)
  }

  openModalCreate = signal<boolean>(false)

  // ---  create doctor profile ---
  openModalCreateProfileDoctor = signal<boolean>(false)
  idDoctorForCreateProfile = signal<number>(0)

}
