// ساختار دسته‌بندی‌ها
export interface ServiceCategory {
  id: string;
  title: string;
  description: string | null;
  icon_name: string;
  display_order: number;
  created_at?: string;
}

// ساختار جدید و داینامیک مدارک (JSONB)
export interface ServiceDocument {
  id: string;
  label: string;
  type: 'file' | 'text';
  is_required: boolean;
}

// ساختار خدمات
export interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  required_documents: ServiceDocument[];
  is_active?: boolean;
  base_price: number;
  display_order: number;
  created_at?: string;
}