// Domain model matching backend StaffResponse
export interface Staff {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  status: string;
}

export interface CreateStaffDto {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface UpdateStaffDto {
  firstname?: string;
  lastname?: string;
  status?: string;
}
