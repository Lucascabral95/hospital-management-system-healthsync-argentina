export type IntermentsStatus = "PENDING" | "IN_PROGRESS" | "COMPLETE";

export interface FilterTypesInterments {
  label: string,
  status: IntermentsStatus,
}
