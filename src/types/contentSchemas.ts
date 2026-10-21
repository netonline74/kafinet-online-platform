import { z } from 'zod';

/**
 * اسکیما اعتبارسنجی Zod برای اطلاعیه‌ها
 */
export const announcementInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'عنوان اطلاعیه باید حداقل ۳ کاراکتر باشد.')
    .max(200, 'عنوان اطلاعیه نمی‌تواند بیش از ۲۰۰ کاراکتر باشد.'),
  description: z
    .string()
    .trim()
    .max(2000, 'توضیحات نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد.')
    .optional()
    .default(''),
  category: z
    .string()
    .trim()
    .min(2, 'دسته‌بندی باید حداقل ۲ کاراکتر باشد.')
    .max(50, 'دسته‌بندی حداکثر ۵۰ کاراکتر است.')
    .default('عمومی'),
  urgency_level: z
    .enum(['normal', 'warning', 'critical'])
    .default('normal'),
  deadline: z
    .string()
    .nullable()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, 'فرمت تاریخ و مهلت نامعتبر است.'),
  action_link: z
    .string()
    .trim()
    .max(300, 'لینک اقدام حداکثر ۳۰۰ کاراکتر است.')
    .optional()
    .default(''),
});

export const announcementIdSchema = z
  .string()
  .trim()
  .min(1, 'شناسه اطلاعیه الزامی است.')
  .max(64, 'شناسه نامعتبر است.');

export type AnnouncementInput = z.infer<typeof announcementInputSchema>;

/**
 * اسکیما اعتبارسنجی مقالات با Zod
 */
export const articleInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'عنوان مقاله باید حداقل ۳ کاراکتر باشد.')
    .max(250, 'عنوان مقاله نمی‌تواند بیش از ۲۵۰ کاراکتر باشد.'),
  slug: z
    .string()
    .trim()
    .min(2, 'شناسه باید حداقل ۲ کاراکتر باشد.')
    .max(120, 'شناسه نمی‌تواند بیش از ۱۲۰ کاراکتر باشد.')
    .regex(/^[a-z0-9-]+$/i, 'شناسه مقاله فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره (-) باشد.'),
  excerpt: z
    .string()
    .trim()
    .min(10, 'چکیده مقاله باید حداقل ۱۰ کاراکتر باشد.')
    .max(500, 'چکیده نمی‌تواند بیش از ۵۰۰ کاراکتر باشد.'),
  content: z
    .string()
    .trim()
    .max(50000, 'محتوای مقاله بیش از حد طولانی است.')
    .optional()
    .default(''),
  cover_image: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default(''),
  is_published: z.boolean().optional().default(true),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
