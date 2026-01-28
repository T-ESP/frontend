// Domain model matching backend ProductResponse
export interface Product {
  id: number;
  name: string;
  category: string;
  reference: string;
  supplier_id: number;
  stock_quantity: number;
  buying_price: number;
  date_last_reassor: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithSupplier extends Product {
  supplier_name: string;
  supplier_email: string;
}

export interface CreateProductDto {
  name: string;
  category: string;
  reference: string;
  supplier_id: number;
  stock_quantity: number;
  buying_price: number;
}

export interface UpdateProductDto {
  name?: string;
  category?: string;
  reference?: string;
  supplier_id?: number;
  stock_quantity?: number;
  buying_price?: number;
}

export interface ProductSearchParams {
  q?: string;
  category?: string;
  supplier_id?: number;
  min_price?: number;
  max_price?: number;
  min_stock?: number;
  max_stock?: number;
  limit?: number;
  offset?: number;
}
