// Domain model matching backend UserResponse
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface UpdateUserDto {
  firstname?: string;
  lastname?: string;
  phone?: string;
}
