import { CreateIntermentDto } from "./create-interment.interface";

export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface UpdateIntermentByIdDto extends CreateIntermentDto { }
