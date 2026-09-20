import { Service } from './service';

export interface OrderFormData {
  // اطلاعات سرویس
  category_id: string;
  service_id: string;
  selected_service_details?: Service | null;
  service_type: string;
  
  // اطلاعات فردی متقاضی
  full_name: string;
  national_id: string;
  phone: string;
  description: string;
  amount: number;

  // فایل‌های قدیمی (برای سازگاری کدهای قبلی)
  files: File[];
  
  // اطلاعات فرم‌ساز داینامیک (جدید)
  dynamic_texts: Record<string, string>;
  dynamic_files: Record<string, File>;
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderItem {
  id?: string;
  tracking_code?: string;
  category_id?: string;
  service_id?: string;
  service_type: string;
  full_name: string;
  national_id: string;
  phone: string;
  description: string;
  amount: number;
  file_urls?: string[];
  status: OrderStatus;
  created_at?: string;
}