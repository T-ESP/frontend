// Domain model matching backend SupplierResponse
export interface Supplier {
  id: number;
  name_sup: string;
  email_sup: string;
  phone_sup: string;
  address_sup: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSupplierDto {
  name_sup: string;
  email_sup: string;
  phone_sup: string;
  address_sup: string;
}

export interface UpdateSupplierDto {
  name_sup?: string;
  email_sup?: string;
  phone_sup?: string;
  address_sup?: string;
}
