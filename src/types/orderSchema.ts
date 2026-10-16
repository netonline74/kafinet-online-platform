import { z } from 'zod';
import { isValidIranianMobile, isValidIranianNationalCode } from '@/lib/validators';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const fileValidationSchema = z
  .custom<File>((file) => file instanceof File, 'Invalid file')
  .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be under 5MB')
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Only JPG, PNG, WEBP and PDF are accepted'
  );

export const orderWizardSchema = z.object({
  serviceId: z.string().min(1, 'انتخاب خدمت الزامی است'),
  fullName: z
    .string()
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ حرف باشد')
    .max(80, 'نام وارد شده طولانی است')
    .regex(/^[\u0600-\u06FF\s]+$/, 'نام و نام خانوادگی باید با حروف فارسی باشد'),
  nationalCode: z
    .string()
    .refine(isValidIranianNationalCode, 'کد ملی نامعتبر است'),
  phoneNumber: z
    .string()
    .refine(isValidIranianMobile, 'شماره موبایل نامعتبر است'),
  description: z.string().max(500, 'توضیحات نباید بیش از ۵۰۰ کاراکتر باشد').optional(),
});

export type OrderWizardInput = z.infer<typeof orderWizardSchema>;
