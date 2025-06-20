import { CreateDoctor } from "./doctor-create.interface";

export interface PatchDoctor extends CreateDoctor {
  is_active: boolean;
}
