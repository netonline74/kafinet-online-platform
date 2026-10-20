// src/config/services-config.ts
import { 
  Building2, 
  Receipt, 
  Calculator, 
  FileCheck2, 
  CalendarClock, 
  Scale, 
  Car, 
  Home, 
  ShieldCheck, 
  Briefcase, 
  Coins, 
  BadgeCheck, 
  MapPin, 
  Mail, 
  HeartHandshake, 
  FileLock2, 
  Wallet, 
  BookUser, 
  GraduationCap, 
  Landmark 
} from 'lucide-react';

export interface ServiceFieldOption {
  label: string;
  value: string;
  hint?: string;
}

export interface ServiceField {
  id: string;
  name: string;
  label: string;
  type: 
    | 'text' 
    | 'number' 
    | 'currency' 
    | 'national_id' 
    | 'mobile' 
    | 'postal_code' 
    | 'company_id' 
    | 'date' 
    | 'select' 
    | 'textarea' 
    | 'file' 
    | 'otp' 
    | 'plate' 
    | 'checkbox' 
    | 'radio' 
    | 'switch';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: ServiceFieldOption[];
  step?: number;
  accept?: string;
  defaultValue?: any;
  validationRule?: 'national_code' | 'mobile' | 'postal_code' | 'company_id' | 'currency' | 'file' | 'text' | 'number';
}

export interface ServiceStep {
  stepNumber: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface ServicePricingItem {
  serviceName: string;
  fee: string;
  duration: string;
  note?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ServiceConfig {
  slug: string;
  title: string;
  categoryId: 'real-estate' | 'tax' | 'business' | 'vehicle' | 'judicial' | 'banking' | 'education' | string;
  category: 'املاک و مسکن' | 'مالیات و دارایی' | 'کسب‌وکار و شرکت‌ها' | 'خودرو و راهور' | 'قضایی و هویتی' | 'بانکی و حمایتی' | 'آموزش و پژوهش';
  iconName: string;
  badgeText: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number; // تومان
  formattedPrice: string;
  duration: string;
  guaranteeText: string;
  formType: 
    | 'multistep-khodnevis' 
    | 'b2b-moadian' 
    | 'tax-article100' 
    | 'mojavez-portal' 
    | 'plate-booking' 
    | 'traffic-fines' 
    | 'amlak-maskan' 
    | 'enamad-pkg' 
    | 'standard';
  steps?: ServiceStep[];
  pricingTable: ServicePricingItem[];
  fields: ServiceField[];
  customModule?: {
    type: 'khodnevis' | 'moadian' | 'tax-calc' | 'mojavez' | 'plate' | 'traffic' | 'maskan' | 'enamad';
    extraSettings?: Record<string, any>;
  };
  faqs: ServiceFAQ[];
  seo: ServiceSEO;
}

export const servicesConfig: ServiceConfig[] = [
  // ۱. سامانه خودنویس املاک (رهگیری اجاره)
  {
    slug: 'khodnevis-rent',
    title: 'سامانه خودنویس املاک (رهگیری قرارداد اجاره)',
    categoryId: 'real-estate',
    category: 'املاک و مسکن',
    iconName: 'Building2',
    badgeText: 'صدور کد رهگیری رایگان کشوری',
    shortDescription: 'ثبت رسمی قراردادهای اجاره مسکونی و تجاری در سامانه یکپارچه خودنویس با دریافت آنی کد رهگیری و هولوگرام دولتی.',
    fullDescription: 'سامانه خودنویس املاک زیر نظر وزارت راه و شهرسازی جهت ثبت قراردادهای اجاره بین موجر و مستاجر بدون نیاز به پرداخت کمیسیون‌های سنگین طراحی شده است. کارشناسان ما قرارداد شما را با تاییدیه ثبتی و ارسال کد OTP به طرفین، ثبت و رسید رسمی ممهور به QR-Code را تحویل می‌دهند.',
    basePrice: 190000,
    formattedPrice: '۱۹۰,۰۰۰ تومان',
    duration: 'کمتر از ۲ ساعت کاری',
    guaranteeText: 'تضمین صدور کد رهگیری ۱۶ رقمی معتبر جهت وام ودیعه مسکن و تعویض پلاک',
    formType: 'multistep-khodnevis',
    steps: [
      { stepNumber: 1, title: 'مشخصات طرفین', description: 'ثبت اطلاعات هویتی و شماره تماس موجر و مستاجر' },
      { stepNumber: 2, title: 'مشخصات ملک', description: 'کد پستی، شناسه برق و مشخصات مساحتی' },
      { stepNumber: 3, title: 'شرایط مالی اجاره', description: 'تعیین ودیعه، اجاره‌بها، تاریخ تحویل و تخلیه' },
      { stepNumber: 4, title: 'بارگذاری مدارک', description: 'سند مالکیت، بنچاق و تصاویر کارت ملی' },
      { stepNumber: 5, title: 'تایید نهایی و پیامک', description: 'تایید کد اعتبارسنجی ارسالی از سامانه خودنویس' },
    ],
    pricingTable: [
      { serviceName: 'ثبت قرارداد مسکونی تک واحدی', fee: '۱۹۰,۰۰۰ تومان', duration: '۲ ساعت' },
      { serviceName: 'ثبت قرارداد تجاری / اداری', fee: '۲۹۰,۰۰۰ تومان', duration: '۴ ساعت' },
      { serviceName: 'تمدید قرارداد سال قبل', fee: '۱۵۰,۰۰۰ تومان', duration: '۱ ساعت' },
    ],
    fields: [
      // Step 1: طرفین
      { id: 'landlord_name', name: 'landlord_name', label: 'نام و نام خانوادگی موجر (مالک)', type: 'text', placeholder: 'مثال: رضا محمدی', required: true, step: 1 },
      { id: 'landlord_national_id', name: 'landlord_national_id', label: 'کد ملی موجر', type: 'national_id', placeholder: '۱۰ رقم بدون خط تیره', required: true, step: 1, validationRule: 'national_code' },
      { id: 'landlord_phone', name: 'landlord_phone', label: 'شماره همراه موجر (بنام شخص)', type: 'mobile', placeholder: '۰۹۱۲۳۴۵۶۷۸۹', required: true, step: 1, validationRule: 'mobile' },
      { id: 'tenant_name', name: 'tenant_name', label: 'نام و نام خانوادگی مستاجر', type: 'text', placeholder: 'مثال: علی احمدی', required: true, step: 1 },
      { id: 'tenant_national_id', name: 'tenant_national_id', label: 'کد ملی مستاجر', type: 'national_id', placeholder: '۱۰ رقم بدون خط تیره', required: true, step: 1, validationRule: 'national_code' },
      { id: 'tenant_phone', name: 'tenant_phone', label: 'شماره همراه مستاجر (بنام شخص)', type: 'mobile', placeholder: '۰۹۳۵۱۲۳۴۵۶۷', required: true, step: 1, validationRule: 'mobile' },
      { id: 'current_address', name: 'current_address', label: 'نشانی فعلی محل سکونت طرفین', type: 'textarea', placeholder: 'استان، شهر، خیابان، پلاک، واحد...', required: true, step: 1 },
      
      // Step 2: ملک
      { id: 'postal_code', name: 'postal_code', label: 'کد پستی ۱۰ رقمی ملک مورد اجاره', type: 'postal_code', placeholder: '۱۰ رقم بدون خط تیره', required: true, step: 2, validationRule: 'postal_code' },
      { id: 'electricity_bill_id', name: 'electricity_bill_id', label: 'شناسه قبض برق ملک', type: 'text', placeholder: '۱۳ رقم شناسه قبض', required: true, step: 2 },
      { id: 'registry_plate', name: 'registry_plate', label: 'پلاک ثبتی ملک (اصلی و فرعی)', type: 'text', placeholder: 'مثال: ۱۲۳ فرعی از ۴۵۶ اصلی', required: true, step: 2 },
      { id: 'property_area', name: 'property_area', label: 'متراژ دقیق ملک (مترمربع)', type: 'number', placeholder: 'مثال: ۸۵', required: true, step: 2 },
      { id: 'build_year', name: 'build_year', label: 'سال ساخت بنا', type: 'number', placeholder: 'مثال: ۱۳۹۸', required: true, step: 2 },
      
      // Step 3: مالی
      { id: 'deposit_amount', name: 'deposit_amount', label: 'مبلغ قرض‌الحسنه / ودیعه (تومان)', type: 'currency', placeholder: 'مثال: ۲۰۰,۰۰۰,۰۰۰', required: true, step: 3, validationRule: 'currency' },
      { id: 'monthly_rent', name: 'monthly_rent', label: 'مبلغ اجاره‌بهای ماهانه (تومان)', type: 'currency', placeholder: 'مثال: ۵,۰۰۰,۰۰۰', required: true, step: 3, validationRule: 'currency' },
      { id: 'delivery_date', name: 'delivery_date', label: 'تاریخ تحویل مورد اجاره', type: 'date', required: true, step: 3 },
      { id: 'eviction_date', name: 'eviction_date', label: 'تاریخ پایان قرارداد و تخلیه', type: 'date', required: true, step: 3 },

      // Step 4: اسناد
      { id: 'title_deed_file', name: 'title_deed_file', label: 'تصویر سند مالکیت، بنچاق یا برگه واگذاری عمران', type: 'file', required: true, step: 4, accept: '.jpg,.jpeg,.png,.pdf', validationRule: 'file' },
      { id: 'landlord_id_file', name: 'landlord_id_file', label: 'تصویر کارت ملی موجر', type: 'file', required: true, step: 4, accept: '.jpg,.jpeg,.png,.pdf', validationRule: 'file' },
      { id: 'tenant_id_file', name: 'tenant_id_file', label: 'تصویر کارت ملی مستاجر', type: 'file', required: true, step: 4, accept: '.jpg,.jpeg,.png,.pdf', validationRule: 'file' },

      // Step 5: OTP
      { id: 'khodnevis_otp', name: 'khodnevis_otp', label: 'کد تایید پیامک‌شده خودنویس (۵ رقمی)', type: 'otp', placeholder: '۱۲۳۴۵', required: true, step: 5 },
    ],
    customModule: {
      type: 'khodnevis',
    },
    faqs: [
      { question: 'آیا کد رهگیری خودنویس برای دریافت وام ودیعه مسکن معتبر است؟', answer: 'بله، کد رهگیری صادر شده دارای کد QR رسمی وزارت راه و شهرسازی بوده و در تمامی بانک‌ها، تعویض پلاک و مدارس کل کشور دارای اعتبار رسمی است.' },
      { question: 'آیا ثبت نام حتماً نیازمند سیم‌کارت به نام طرفین است؟', answer: 'بله، طبق پروتکل امنیتی شاهکار، کد تایید OTP به شماره همراهی که با کدملی شخص مطابقت داشته باشد ارسال می‌شود.' },
      { question: 'آیا برای املاک بدون سند تک‌برگ (وکالتی یا تعاونی) نیز می‌توان ثبت کرد؟', answer: 'بله، با بارگذاری بنچاق، قرارداد اولیه شرکت عمران یا سلسله وکالتنامه‌ها می‌توان قرارداد را ثبت کرد.' },
    ],
    seo: {
      metaTitle: 'سامانه خودنویس املاک | ثبت آنلاین قرارداد اجاره و دریافت کد رهگیری',
      metaDescription: 'ثبت اینترنتی قرارداد اجاره در سامانه خودنویس بدون کمیسیون و دریافت آنی کد رهگیری ۱۶ رقمی معتبر با هولوگرام دولتی.',
      keywords: ['سامانه خودنویس', 'ثبت قرارداد اجاره', 'کد رهگیری رایگان', 'وام ودیعه مسکن', 'استعلام اجاره نامه'],
    },
  },

  // ۲. سامانه مودیان و ارسال صورتحساب
  {
    slug: 'moadian-system',
    title: 'سامانه مودیان و ارسال فاکتور الکترونیکی',
    categoryId: 'tax',
    category: 'مالیات و دارایی',
    iconName: 'Receipt',
    badgeText: 'ویژه اشخاص حقیقی و حقوقی (B2B)',
    shortDescription: 'اتصال سریع به کارپوشه سامانه مودیان، استخراج کلید اختصاصی CSR، توکن امضای دیجیتال و ارسال گروهی صورتحساب‌های فروش.',
    fullDescription: 'بر اساس قانون پایانه‌های فروشگاهی و سامانه مودیان، تمامی صاحبان مشاغل و شرکت‌ها موظف به صدور فاکتور الکترونیک و ارسال آن به کارپوشه مالیاتی هستند. با این پلتفرم می‌توانید بدون نیاز به خرید نرم‌افزارهای گران‌قیمت حسابداری، صورتحساب‌های خود را با فایل اکسل ارسال و شناسه یکتای مالیاتی دریافت کنید.',
    basePrice: 350000,
    formattedPrice: '۳۵۰,۰۰۰ تومان',
    duration: 'همان روز کاری',
    guaranteeText: 'پوشش کامل خطاهای کارپوشه با گارانتی پذیرش قطعی صورتحساب‌ها',
    formType: 'b2b-moadian',
    pricingTable: [
      { serviceName: 'صدور کلیدهای CSR و امضای دیجیتال', fee: '۲۵۰,۰۰۰ تومان', duration: '۲ ساعت' },
      { serviceName: 'بسته ارسال تا ۵۰ صورتحساب در ماه', fee: '۳۵۰,۰۰۰ تومان', duration: 'آنی' },
      { serviceName: 'بسته ارسال نامحدود صورتحساب ماهانه', fee: '۸۵۰,۰۰۰ تومان', duration: 'ماهانه' },
    ],
    fields: [
      { id: 'company_name', name: 'company_name', label: 'نام واحد صنفی / شرکت / فروشگاه', type: 'text', placeholder: 'مثال: شرکت تجارت گستر پارس', required: true },
      { id: 'economic_code', name: 'economic_code', label: 'شناسه ملی یا کد اقتصادی ۱۲ رقمی', type: 'company_id', placeholder: '۱۲ رقم کد اقتصادی جدید یا ۱۱ رقم شناسه ملی', required: true, validationRule: 'company_id' },
      { id: 'contact_person_mobile', name: 'contact_person_mobile', label: 'شماره همراه مدیرعامل / مدیر مالی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { 
        id: 'csr_status', 
        name: 'csr_status', 
        label: 'وضعیت کلید اختصاصی (CSR) و توکن امضای دیجیتال', 
        type: 'select', 
        required: true,
        options: [
          { label: 'دارم (فایل کلید را دارم)', value: 'have_csr', hint: 'بارگذاری فایل Private Key' },
          { label: 'ندارم و نیاز به صدور فوری دارم', value: 'need_csr', hint: 'توسط کارشناسان ما تولید می‌شود' },
          { label: 'توکن سخت‌افزاری دارم و تبدیل به کلید نرم‌افزاری می‌خواهم', value: 'hardware_token', hint: 'استخراج کلید جهت وب' },
        ] 
      },
      { id: 'invoice_excel_file', name: 'invoice_excel_file', label: 'آپلود فایل اکسل صورتحساب‌ها (فرمت استاندارد)', type: 'file', accept: '.xlsx,.xls,.csv', required: false, validationRule: 'file', helperText: 'فایل حاوی ستون‌های: شناسه کالا، شرح، مبلغ، ارزش افزوده' },
    ],
    customModule: {
      type: 'moadian',
      extraSettings: {
        pricePerInvoice: 3000,
        baseSetupFee: 200000,
      },
    },
    faqs: [
      { question: 'آیا برای ارسال به سامانه مودیان نیاز به خرید نرم‌افزار حسابداری گران است؟', answer: 'خیر، پلتفرم ما به صورت مستقیم فایل اکسل صورتحساب‌های شما را اعتبارسنجی کرده و پس از امضای دیجیتال رمزنگاری‌شده، به کارپوشه مالیاتی ارسال می‌کند.' },
      { question: 'مهلت ارسال صورتحساب به سامانه مودیان چقدر است؟', answer: 'طبق آخرین دستورالعمل سازمان امور مالیاتی، مودیان حداکثر تا ۲۱ روز کاری پس از تاریخ صدور فاکتور مهلت ارسال دارند.' },
    ],
    seo: {
      metaTitle: 'ارسال صورتحساب به سامانه مودیان | صدور کلید CSR و امضای دیجیتال',
      metaDescription: 'سامانه ارسال فاکتور الکترونیک به کارپوشه سامانه مودیان با اکسل، صدور کلید CSR، شناسه یکتای مالیاتی و پیش‌نمایش جدول فاکتورها.',
      keywords: ['سامانه مودیان', 'ارسال صورتحساب الکترونیکی', 'کلید CSR', 'کارپوشه مالیاتی', 'فاکتور الکترونیک'],
    },
  },

  // ۳. اظهارنامه تبصره ۱۰۰ مشاغل
  {
    slug: 'tax-article-100',
    title: 'مالیات مقطوع تبصره ماده ۱۰۰ و اظهارنامه عملکرد',
    categoryId: 'tax',
    category: 'مالیات و دارایی',
    iconName: 'Calculator',
    badgeText: 'محاسبه هوشمند بدون جریمه',
    shortDescription: 'محاسبه تخمین مالیات مقطوع سالانه، اعمال ضرایب سود مصوب اینتاکد، ارسال فرم تبصره ۱۰۰ و صدور قبوض پرداخت اقساطی.',
    fullDescription: 'فرم تبصره ماده ۱۰۰ بهترین و کم‌ریسک‌ترین شیوه تسویه مالیات بر درآمد مشاغل انفرادی و مشارکتی است. با وارد کردن اطلاعات و گردش دستگاه پوز خود، مالیات تخمینی را آنلاین مشاهده کرده و با تایید رمز یکبار مصرف درگاه my.tax.gov.ir، پرونده را تسویه فرمایید.',
    basePrice: 280000,
    formattedPrice: '۲۸۰,۰۰۰ تومان',
    duration: 'کمتر از ۱ ساعت',
    guaranteeText: 'تضمین برخورداری از سقف معافیت پایه و تقسیط قبوض در حداکثر اقساط قانونی',
    formType: 'tax-article100',
    pricingTable: [
      { serviceName: 'ثبت فرم تبصره ۱۰۰ (بدون بدهی قبلی)', fee: '۲۸۰,۰۰۰ تومان', duration: '۱ ساعت' },
      { serviceName: 'اظهارنامه انفرادی عادی گروه سوم', fee: '۳۸۰,۰۰۰ تومان', duration: '۲ ساعت' },
      { serviceName: 'پرونده‌های مشارکتی چند شریک', fee: '۴۸۰,۰۰۰ تومان', duration: '۳ ساعت' },
    ],
    fields: [
      { id: 'national_id', name: 'national_id', label: 'کد ملی صاحب پروانه / کسب‌وکار', type: 'national_id', placeholder: '۱۰ رقم بدون فاصله', required: true, validationRule: 'national_code' },
      { id: 'tax_mobile', name: 'tax_mobile', label: 'شماره همراه متصل به پرونده مالیاتی', type: 'mobile', placeholder: '۰۹۱۲۳۴۵۶۷۸۹', required: true, validationRule: 'mobile' },
      { id: 'isic_code', name: 'isic_code', label: 'اینتاکد یا کد رسته صنفی (ISIC)', type: 'text', placeholder: 'مثال: ۵۲۳۸۴۰۱ (یا عنوان دقیق صنف)', required: true },
      { id: 'pos_turnover', name: 'pos_turnover', label: 'مجموع واریزی دستگاه پوز و درگاه بانکی در سال (تومان)', type: 'currency', placeholder: 'مثال: ۱,۲۰۰,۰۰۰,۰۰۰', required: true, validationRule: 'currency' },
      { id: 'profit_ratio', name: 'profit_ratio', label: 'ضریب سود مصوب صنف (درصد)', type: 'number', placeholder: 'مثال: ۱۲', required: false, defaultValue: 12 },
      { id: 'tax_portal_otp', name: 'tax_portal_otp', label: 'رمز یکبار مصرف دریافتی از درگاه my.tax.gov.ir', type: 'otp', placeholder: '۶ رقم', required: false },
    ],
    customModule: {
      type: 'tax-calc',
      extraSettings: {
        basicExemption: 144000000, // سقف معافیت پایه سالانه
        maxArticle100Turnover: 18000000000, // سقف مجاز تبصره ۱۰۰
      },
    },
    faqs: [
      { question: 'سقف فروش مجاز برای استفاده از تبصره ماده ۱۰۰ چقدر است؟', answer: 'سقف فروش برای سال مالیاتی اخیر ۱۸ میلیارد تومان (۱۵۰ برابر معافیت سالانه ماده ۸۴) است. در صورت فراتر رفتن، مودی باید اظهارنامه عادی ثبت کند.' },
      { question: 'آیا امکان تقسیط مالیات تبصره ۱۰۰ وجود دارد؟', answer: 'بله، سازمان امور مالیاتی امکان تقسیط تا ۱۰ قسط ماهانه بدون کارمزد را فراهم نموده که در سیستم ما به طور خودکار اعمال می‌شود.' },
    ],
    seo: {
      metaTitle: 'اظهارنامه تبصره ۱۰۰ مشاغل | محاسبه آنلاین مالیات مقطوع و ثبت در my.tax.gov.ir',
      metaDescription: 'محاسبه آنلاین و ثبت فرم تبصره ماده ۱۰۰ مالیات مشاغل، اعمال ضرایب سود اینتاکد، تقسیط قبوض مالیاتی و پشتیبانی کامل.',
      keywords: ['تبصره ۱۰۰', 'اظهارنامه مالیاتی', 'مالیات مشاغل', 'سایت مای تکس', 'محاسبه مالیات پوز'],
    },
  },

  // ۴. درگاه ملی مجوزها (Mojavez.ir)
  {
    slug: 'mojavez-national-portal',
    title: 'پروانه کسب الکترونیک در درگاه ملی مجوزها',
    categoryId: 'business',
    category: 'کسب‌وکار و شرکت‌ها',
    iconName: 'FileCheck2',
    badgeText: 'شناسه یکتا (QR-Code) رسمی',
    shortDescription: 'اخذ، تمدید و تبدیل پروانه‌های کسب کاغذی به شناسه یکتا الکترونیک در درگاه ملی مجوزهای کشور (Mojavez.ir).',
    fullDescription: 'بر اساس قوانین کشوری، تمامی پروانه‌های کسب قدیمی کاغذی باید به مجوز الکترونیکی دارای شناسه یکتا تبدیل شوند. همچنین متقاضیان تاسیس کسب‌وکار جدید می‌توانند از طریق این ماژول، بدون نیاز به مراجعه حضوری به اتحادیه‌ها، مجوز فعالیت صنفی خود را دریافت دارند.',
    basePrice: 320000,
    formattedPrice: '۳۲۰,۰۰۰ تومان',
    duration: '۳ تا ۷ روز کاری',
    guaranteeText: 'پایش مستمر تا زمان صدور نهایی شناسه یکتا از پایگاه اطلاعات قوانین',
    formType: 'mojavez-portal',
    pricingTable: [
      { serviceName: 'تبدیل پروانه کاغذی به شناسه یکتا الکترونیک', fee: '۱۸۰,۰۰۰ تومان', duration: '۲۴ ساعت' },
      { serviceName: 'ثبت‌نام پروانه کسب جدید (محور)', fee: '۳۲۰,۰۰۰ تومان', duration: '۳ تا ۵ روز' },
      { serviceName: 'ثبت‌نام پروانه‌های ثبت‌محور و تخصصی', fee: '۴۵۰,۰۰۰ تومان', duration: '۷ روز' },
    ],
    fields: [
      { id: 'applicant_national_id', name: 'applicant_national_id', label: 'کد ملی متقاضی پروانه', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'applicant_mobile', name: 'applicant_mobile', label: 'شماره همراه به نام متقاضی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { 
        id: 'main_guild_category', 
        name: 'main_guild_category', 
        label: 'رسته صنفی اصلی', 
        type: 'select', 
        required: true,
        options: [
          { label: 'تولیدی و خدمات فنی', value: 'production_technical' },
          { label: 'توزیعی و خدماتی', value: 'distribution_service' },
          { label: 'فناوری اطلاعات و کسب‌وکار مجازی', value: 'it_virtual' },
          { label: 'صنایع دستی و گردشگری', value: 'handicraft_tourism' },
          { label: 'کشاورزی و صنایع غذایی', value: 'agriculture_food' },
        ]
      },
      { id: 'specific_job_title', name: 'specific_job_title', label: 'عنوان دقیق شغل مد نظر', type: 'text', placeholder: 'مثال: تعمیرات موبایل، خواربارفروشی...', required: true },
      { id: 'commercial_postal_code', name: 'commercial_postal_code', label: 'کد پستی ۱۰ رقمی محل کسب / کارگاه', type: 'postal_code', placeholder: '۱۰ رقم بدون خط تیره', required: true, validationRule: 'postal_code' },
      { id: 'clearance_certificate_file', name: 'clearance_certificate_file', label: 'گواهی عدم سوء پیشینه یا کد پیگیری آن', type: 'file', required: false, validationRule: 'file' },
      { id: 'military_service_file', name: 'military_service_file', label: 'کارت پایان خدمت یا معافیت (ویژه آقایان)', type: 'file', required: false, validationRule: 'file' },
      { id: 'technical_skill_file', name: 'technical_skill_file', label: 'مدرک فنی‌وحرفه‌ای یا تحصیلی مرتبط (اختیاری)', type: 'file', required: false, validationRule: 'file' },
    ],
    customModule: {
      type: 'mojavez',
    },
    faqs: [
      { question: 'آیا برای کسب‌وکارهای خانگی هم درگاه ملی مجوز می‌دهد؟', answer: 'بله، بیش از ۵۰۰ شغل خانگی در درگاه ملی مجوزها به صورت ثبت‌محور و آنی دارای مجوز می‌شوند.' },
      { question: 'شناسه یکتا چه مزیتی نسبت به پروانه کاغذی دارد؟', answer: 'شناسه یکتا در تمام سامانه‌های دولتی، بانکی و مالیاتی به صورت برخط استعلام می‌شود و نیازی به ارائه‌ی فیزیکی برگه نیست.' },
    ],
    seo: {
      metaTitle: 'درگاه ملی مجوزها Mojavez.ir | صدور آنلاین پروانه کسب و شناسه یکتا',
      metaDescription: 'ثبت‌نام پروانه کسب الکترونیک در درگاه ملی مجوزها mojavez.ir، تبدیل مجوز کاغذی به شناسه یکتا و پیگیری لحظه‌ای پرونده.',
      keywords: ['درگاه ملی مجوزها', 'پروانه کسب الکترونیک', 'شناسه یکتا', 'مجوز کسب و کار', 'mojavez.ir'],
    },
  },

  // ۵. نوبت‌دهی تعویض پلاک و معاینه فنی
  {
    slug: 'plate-transfer-booking',
    title: 'نوبت‌دهی تعویض پلاک و معاینه فنی خودرو',
    categoryId: 'vehicle',
    category: 'خودرو و راهور',
    iconName: 'CalendarClock',
    badgeText: 'سامانه نوبت‌دهی راهور نوپا',
    shortDescription: 'رزرو سریع نوبت در مراکز تعویض پلاک سراسر کشور با تقویم تعاملی و فعال‌سازی ربات پایشگر ظرفیت‌های تکمیل‌شده.',
    fullDescription: 'مراکز تعویض پلاک خودرو و موتورسیکلت در کلان‌شهرها معمولاً در دقایق اولیه بازگشایی تکمیل ظرفیت می‌شوند. این سیستم با رابط کاربری اختصاصی، نوبت شما را در مرکز و ساعت مورد نظرتان رزرو کرده و در صورت پر بودن، با سامانه پایشگر لغو نوبت‌ها، در نخستین کنسلی نوبت را ثبت می‌کند.',
    basePrice: 95000,
    formattedPrice: '۹۵,۰۰۰ تومان',
    duration: 'رزرو آنی / پایشگر تا موفقیت',
    guaranteeText: 'ارسال پیامک تاییدیه رسمی راهور با بارکد ورود به مرکز',
    formType: 'plate-booking',
    pricingTable: [
      { serviceName: 'رزرو نوبت استاندارد روزهای باز', fee: '۹۵,۰۰۰ تومان', duration: 'آنی' },
      { serviceName: 'رزرو اضطراری با ربات پایشگر (ظرفیت تکمیل)', fee: '۱۸۰,۰۰۰ تومان', duration: 'حداکثر ۲۴ ساعت' },
      { serviceName: 'نوبت‌دهی معاینه فنی مکانیزه', fee: '۷۰,۰۰۰ تومان', duration: 'آنی' },
    ],
    fields: [
      { 
        id: 'province', 
        name: 'province', 
        label: 'استان مورد نظر', 
        type: 'select', 
        required: true,
        options: [
          { label: 'تهران', value: 'tehran' },
          { label: 'البرز (کرج)', value: 'alborz' },
          { label: 'اصفهان', value: 'isfahan' },
          { label: 'فارس (شیراز)', value: 'fars' },
          { label: 'خراسان رضوی (مشهد)', value: 'khorasan_razavi' },
          { label: 'آذربایجان شرقی (تبریز)', value: 'east_azerbaijan' },
          { label: 'خوزستان (اهواز)', value: 'khuzestan' },
          { label: 'مازندران (ساری)', value: 'mazandaran' },
        ]
      },
      { id: 'city_center', name: 'city_center', label: 'مرکز تعویض پلاک انتخابی', type: 'text', placeholder: 'مثال: مرکز میثم، خاوران، اتحاد، چیتگر...', required: true },
      { 
        id: 'vehicle_type', 
        name: 'vehicle_type', 
        label: 'نوع وسیله نقلیه', 
        type: 'select', 
        required: true,
        options: [
          { label: 'خودرو سواری شخصی', value: 'car_personal' },
          { label: 'تاکسی / عمومی', value: 'taxi' },
          { label: 'وانت و کامیونت', value: 'pickup' },
          { label: 'موتورسیکلت', value: 'motorcycle' },
        ]
      },
      { id: 'plate_number', name: 'plate_number', label: 'شماره پلاک انتظامی خودرو', type: 'plate', required: true },
      { id: 'owner_national_id', name: 'owner_national_id', label: 'کد ملی خریدار / مالک جدید', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'owner_mobile', name: 'owner_mobile', label: 'شماره همراه خریدار', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'booking_date', name: 'booking_date', label: 'تاریخ انتخابی برای مراجعه', type: 'date', required: true },
      { id: 'emergency_bot_active', name: 'emergency_bot_active', label: 'فعال‌سازی ربات پایشگر ظرفیت (در صورت پر بودن ظرفیت)', type: 'switch', defaultValue: true },
    ],
    customModule: {
      type: 'plate',
    },
    faqs: [
      { question: 'در صورت تکمیل ظرفیت، ربات پایشگر چگونه کار می‌کند؟', answer: 'ربات هر ۵ ثانیه سرور راهور را بررسی کرده و به محض انصراف هر کاربر، سریعاً نوبت را برای اطلاعات شما رزرو و پیامک تایید ارسال می‌نماید.' },
      { question: 'چه مدارکی باید در روز مراجعه به همراه داشته باشیم؟', answer: 'اصل سند مالکیت، کارت خودرو، برگه سبز، معاینه فنی، بیمه شخص ثالث، تسویه عوارض شهرداری و مدارک احراز سکونت خریدار.' },
    ],
    seo: {
      metaTitle: 'نوبت دهی تعویض پلاک خودرو و موتور | رزرو آنی و ربات پایشگر نوبت پر شده',
      metaDescription: 'رزرو اینترنتی نوبت مراکز تعویض پلاک کل کشور، تقویم تعاملی روزهای باز، رزرو خودکار با پایشگر کنسلی و تاییدیه پیامکی.',
      keywords: ['نوبت دهی تعویض پلاک', 'سایت نوبس', 'تعویض پلاک میثم', 'تعویض پلاک اتحاد', 'رزرو نوبت خودرو'],
    },
  },

  // ۶. خدمات قضایی ثنا
  {
    slug: 'sana-judicial-services',
    title: 'خدمات قضایی سامانه ثنا (ابلاغیه و احراز هویت)',
    categoryId: 'judicial',
    category: 'قضایی و هویتی',
    iconName: 'Scale',
    badgeText: 'درگاه رسمی عدل ایران (ADLIRAN)',
    shortDescription: 'مشاهده و چاپ ابلاغیه‌های الکترونیکی، ثبت‌نام اولیه ثنا با احراز هویت تصویری، بازیابی رمز عبور فراموش‌شده و دریافت گواهی.',
    fullDescription: 'سامانه ثنا دروازه رسمی مشاهده تمام اوراق قضایی، دادخواست‌ها، آرای دادگاه‌ها و احضاریه‌های مراجع قانونی است. عدم مشاهده به موقع ابلاغیه‌ها می‌تواند به صدور حکم غیابی منجر شود. کارشناسان ما به صورت محرمانه ابلاغیه‌های شما را بررسی و فایل PDF مهر شده را ارسال می‌نمایند.',
    basePrice: 85000,
    formattedPrice: '۸۵,۰۰۰ تومان',
    duration: 'کمتر از ۲۰ دقیقه',
    guaranteeText: 'حفظ ۱۰۰٪ محرمانگی اطلاعات قضایی و عدم دسترسی افراد غیرمجاز',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'مشاهده و چاپ آخرین ابلاغیه جدید', fee: '۸۵,۰۰۰ تومان', duration: '۱۵ دقیقه' },
      { serviceName: 'ثبت‌نام جدید و احراز هویت تصویری ثنا', fee: '۱۶۰,۰۰۰ تومان', duration: '۳۰ دقیقه' },
      { serviceName: 'بازیابی شماره همراه و کلمه عبور ثنا', fee: '۱۲۰,۰۰۰ تومان', duration: '۲۰ دقیقه' },
    ],
    fields: [
      { 
        id: 'sana_service_mode', 
        name: 'sana_service_mode', 
        label: 'نوع درخواست قضایی', 
        type: 'select', 
        required: true,
        options: [
          { label: 'مشاهده و دریافت ابلاغیه جدید با کد پیگیری', value: 'view_eblaghiye' },
          { label: 'ثبت‌نام کامل ثنا برای بار اول', value: 'new_registration' },
          { label: 'بازیابی کلمه عبور فراموش‌شده ثنا', value: 'reset_password' },
          { label: 'چاپ گواهی ثبت‌نام و اطلاعات هویتی ثنا', value: 'print_certificate' },
        ]
      },
      { id: 'national_id', name: 'national_id', label: 'کد ملی متقاضی', type: 'national_id', placeholder: '۱۰ رقم بدون فاصله', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه متصل به ثنا', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'sana_password', name: 'sana_password', label: 'رمز شخصی ثنا (در صورت داشتن)', type: 'text', placeholder: 'رمز شخصی ۶ رقمی (اختیاری)', required: false },
      { id: 'sana_otp', name: 'sana_otp', label: 'رمز موقت ارسالی عدل‌ایران', type: 'otp', placeholder: 'کد پیامک‌شده', required: false },
    ],
    faqs: [
      { question: 'آیا باز شدن ابلاغیه در سیستم به معنی ابلاغ واقعی است؟', answer: 'بله، طبق قانون آیین دادرسی الکترونیکی، رویت ابلاغیه در سامانه ثنا به منزله ابلاغ قانونی محسوب شده و مهلت‌های تجدیدنظرخواهی از این تاریخ محاسبه می‌شود.' },
      { question: 'در صورت فراموشی رمز شخصی چه باید کرد؟', answer: 'با انتخاب گزینه بازیابی کلمه عبور و تایید پیامک ارسالی، رمز جدید در کمتر از چند دقیقه صادر می‌گردد.' },
    ],
    seo: {
      metaTitle: 'سامانه ثنا ابلاغیه الکترونیکی | مشاهده ابلاغیه قضایی و بازیابی رمز ثنا',
      metaDescription: 'دریافت سریع ابلاغیه قضایی سامانه ثنا، ثبت نام ثنا با احراز هویت تصویری، چاپ اوراق دادرسی و بازیابی فوری رمز شخصی.',
      keywords: ['سامانه ثنا', 'ابلاغیه الکترونیکی', 'عدل ایران', 'رمز ثنا', 'مشاهده ابلاغیه دادگاه'],
    },
  },

  // ۷. استعلام جامع خلافی و عوارض خودرو
  {
    slug: 'traffic-fines-inquiry',
    title: 'استعلام جامع خلافی و عوارض خودرو',
    categoryId: 'vehicle',
    category: 'خودرو و راهور',
    iconName: 'Car',
    badgeText: 'تسویه آنی و بدون واسطه',
    shortDescription: 'داشبورد تجمیع و تسویه جریمه‌های راهور، عوارض آزادراهی کشور، طرح ترافیک، مالیات نقل و انتقال و پارک حاشیه‌ای.',
    fullDescription: 'استعلام صفر تا صد دیون خودرو به صورت یکپارچه با پلاک هوشمند ایران. شما می‌توانید لیست ریز جرایم شامل تصویر دوربین، محل دقیق تخلف و مهلت پرداخت را مشاهده کرده و هر مورد را به صورت تکی یا تجمیعی تسویه فرمایید.',
    basePrice: 50000,
    formattedPrice: '۵۰,۰۰۰ تومان',
    duration: 'لحظه‌ای و آنی',
    guaranteeText: 'حذف آنی بدهی از سیستم پلیس راهور ناجا در کمتر از ۱۰ دقیقه',
    formType: 'traffic-fines',
    pricingTable: [
      { serviceName: 'استعلام ریز خلافی تصویری با پلاک و بارکد', fee: '۵۰,۰۰۰ تومان', duration: 'آنی' },
      { serviceName: 'استعلام و تسویه عوارض آزادراهی کشوری', fee: '۳۰,۰۰۰ تومان', duration: 'آنی' },
      { serviceName: 'استعلام مالیات نقل و انتقال خودرو برای تعویض پلاک', fee: '۶۰,۰۰۰ تومان', duration: 'آنی' },
    ],
    fields: [
      { id: 'plate_number', name: 'plate_number', label: 'شماره پلاک خودرو', type: 'plate', required: true },
      { id: 'owner_national_id', name: 'owner_national_id', label: 'کد ملی مالک خودرو', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'owner_mobile', name: 'owner_mobile', label: 'شماره موبایل مالک پلاک', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'inquiry_types', name: 'inquiry_types', label: 'موارد استعلامی مورد نظر', type: 'select', required: true, options: [
        { label: 'کلیه دیون (خلافی، آزادراهی، طرح ترافیک و مالیات)', value: 'all' },
        { label: 'فقط خلافی راهور (پلیس +۱۰)', value: 'fines_only' },
        { label: 'فقط عوارض آزادراهی و بزرگراهی', value: 'tolls_only' },
        { label: 'فقط مالیات نقل و انتقال جهت تعویض پلاک', value: 'transfer_tax' },
      ]},
      { id: 'barcode_id', name: 'barcode_id', label: 'بارکد ۸ یا ۹ رقمی کارت خودرو (اختیاری جهت خلافی با جزئیات)', type: 'text', placeholder: 'مثال: 123456789', required: false },
    ],
    customModule: {
      type: 'traffic',
    },
    faqs: [
      { question: 'آیا جریمه‌های پرداخت‌شده بلافاصله از سیستم راهور پاک می‌شوند؟', answer: 'بله، با اتصال وب‌سرویس مستقیم به شاپرک و راهور، تسویه حساب ظرف چند دقیقه در سرورهای پلیس ثبت می‌شود.' },
      { question: 'آیا برای تعویض پلاک پرداخت عوارض آزادراهی هم الزامی است؟', answer: 'بله، طبق مصوبه جدید، در زمان تعویض پلاک علاوه بر خلافی، کلیه عوارض آزادراهی و مالیات نقل و انتقال باید صفر شده باشد.' },
    ],
    seo: {
      metaTitle: 'استعلام خلافی خودرو با پلاک | پرداخت عوارض آزادراهی و طرح ترافیک',
      metaDescription: 'استعلام آنلاین و آنی خلافی خودرو، نمایش تصاویر دوربین راهور، تسویه بدهی آزادراهی و مالیات تعویض پلاک با تاییدیه پلیس.',
      keywords: ['استعلام خلافی', 'خلافی خودرو با پلاک', 'عوارض آزادراهی', 'پرداخت جریمه راهور', 'طرح ترافیک'],
    },
  },

  // ۸. سامانه ملی املاک و اسکان
  {
    slug: 'amlak-maskan-registry',
    title: 'سامانه ملی املاک و اسکان کشور',
    categoryId: 'real-estate',
    category: 'املاک و مسکن',
    iconName: 'Home',
    badgeText: 'جلوگیری از قطع یارانه و مالیات خانه خالی',
    shortDescription: 'ثبت و خودکارسازی سکونتگاه اصلی، املاک ملکی، مستاجران و اعضای خانوار جهت دریافت برگه تاییدیه و جلوگیری از جرایم مالیاتی.',
    fullDescription: 'عدم ثبت اقامتگاه در سامانه املاک و اسکان کشور، بر اساس قانون مشمول قطع یارانه‌های معیشتی، عدم صدور دسته‌چک و وضع مالیات سنگین خانه‌های خالی می‌شود. فرم هوشمند ما با اعتبارسنجی دقیق کد پستی و شناسه کنتورها، پرونده شما را بدون خطای سیستمی ثبت و رسید معتبر صادر می‌کند.',
    basePrice: 140000,
    formattedPrice: '۱۴۰,۰۰۰ تومان',
    duration: 'کمتر از ۱ ساعت',
    guaranteeText: 'صدور رسید الکترونیکی نهایی ممهور به بارکد استعلام کشوری',
    formType: 'amlak-maskan',
    pricingTable: [
      { serviceName: 'ثبت سکونتگاه انفرادی / خانوار عادی', fee: '۱۴۰,۰۰۰ تومان', duration: '۱ ساعت' },
      { serviceName: 'ثبت اقامتگاه به همراه املاک فرعی مالکین', fee: '۲۲۰,۰۰۰ تومان', duration: '۲ ساعت' },
    ],
    fields: [
      { 
        id: 'residence_type', 
        name: 'residence_type', 
        label: 'وضعیت سکونت در ملک', 
        type: 'select', 
        required: true,
        options: [
          { label: 'مالک و ساکن در ملک هستم', value: 'owner_resident' },
          { label: 'مستاجر هستم (سکونت با اجاره‌نامه)', value: 'tenant' },
          { label: 'مالک هستم اما ملک در اجاره شخص دیگری است', value: 'landlord_rented' },
          { label: 'ملک در اختیار اقوام / رایگان است', value: 'free_relative' },
        ]
      },
      { id: 'head_national_id', name: 'head_national_id', label: 'کد ملی سرپرست خانوار', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'head_mobile', name: 'head_mobile', label: 'شماره همراه سرپرست (به نام شخص)', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'postal_code', name: 'postal_code', label: 'کد پستی ۱۰ رقمی اقامتگاه', type: 'postal_code', placeholder: '۱۰ رقم بدون خط تیره', required: true, validationRule: 'postal_code' },
      { id: 'electricity_bill_id', name: 'electricity_bill_id', label: 'شناسه قبض برق ملک', type: 'text', placeholder: '۱۳ رقم شناسه برق', required: true },
      { id: 'gas_meter_id', name: 'gas_meter_id', label: 'شناسه کنتور یا شماره اشتراک گاز', type: 'text', placeholder: 'شماره اشتراک روی قبض گاز', required: false },
      { id: 'family_members_count', name: 'family_members_count', label: 'تعداد اعضای تحت تکفل ساکن در ملک', type: 'number', placeholder: 'مثال: ۳', required: true },
      { id: 'family_members_data', name: 'family_members_data', label: 'مشخصات اعضای خانوار (کد ملی و تاریخ تولد همسر و فرزندان)', type: 'textarea', placeholder: 'نام، کد ملی، نسبت و سال تولد اعضا...', required: false },
      { id: 'lease_or_deed_file', name: 'lease_or_deed_file', label: 'تصویر اجاره‌نامه با کد رهگیری یا سند تک‌برگ ملک', type: 'file', required: true, validationRule: 'file' },
    ],
    customModule: {
      type: 'maskan',
    },
    faqs: [
      { question: 'آیا مستاجرین هم باید در سامانه املاک و اسکان ثبت‌نام کنند؟', answer: 'بله، طبق قانون ثبت سکونتگاه برای همه ساکنین چه مالک و چه مستاجر الزامی بوده و عدم ثبت آن مانع دریافت خدمات اداری می‌شود.' },
      { question: 'پیامک اخطار مالیات خانه خالی برایم آمده، چه کنم؟', answer: 'کافیست وضعیت ملک خود را در سامانه به عنوان محل سکونت اصلی یا دارای مستاجر ثبت کنید تا جریمه مالیاتی لغو گردد.' },
    ],
    seo: {
      metaTitle: 'سامانه ملی املاک و اسکان | ثبت نشانی اقامتگاه و رفع مالیات خانه خالی',
      metaDescription: 'ثبت نام سریع در سامانه ملی املاک و اسکان، ثبت کد پستی و شناسه قبض برق، ثبت اعضای خانواده و دریافت گواهی سکونت.',
      keywords: ['سامانه املاک و اسکان', 'ثبت نشانی مسکن', 'مالیات خانه خالی', 'کد پستی اقامتگاه', 'یارانه مسکن'],
    },
  },

  // ۹. پکیج اینماد و درگاه پرداخت اینترنتی
  {
    slug: 'enamad-payment-gateway',
    title: 'پکیج اخذ اینماد ستاره‌دار و درگاه پرداخت شاپرک',
    categoryId: 'business',
    category: 'کسب‌وکار و شرکت‌ها',
    iconName: 'ShieldCheck',
    badgeText: 'پکیج راه‌اندازی فروشگاه آنلاین',
    shortDescription: 'دریافت نماد اعتماد الکترونیکی (اینماد)، تایید صلاحیت فنی دامنه، اتصال به درگاه‌های پرداخت زرین‌پال، پی‌پینگ و به‌پرداخت.',
    fullDescription: 'راه‌اندازی فروشگاه آنلاین بدون داشتن نماد اعتماد الکترونیکی و درگاه پرداخت غیرممکن است. ما پرونده کسب‌وکار اینترنتی شما را تشکیل داده، اعتبارسنجی فنی دامنه و متادیتا را انجام داده و کد درگاه پرداخت فعال و آماده تراکنش را به شما تحویل می‌دهیم.',
    basePrice: 420000,
    formattedPrice: '۴۲۰,۰۰۰ تومان',
    duration: '۲ تا ۴ روز کاری',
    guaranteeText: 'پشتیبانی فنی کامل تا تست تراکنش موفق اول روی وب‌سایت',
    formType: 'enamad-pkg',
    pricingTable: [
      { serviceName: 'اخذ اینماد تک‌ستاره و درگاه پرداخت واسط', fee: '۴۲۰,۰۰۰ تومان', duration: '۲ روز' },
      { serviceName: 'اینماد دوستاره و اتصال به درگاه مستقیم PSP شاپرک', fee: '۷۵۰,۰۰۰ تومان', duration: '۴ روز' },
    ],
    fields: [
      { id: 'website_domain', name: 'website_domain', label: 'آدرس دامنه وب‌سایت (Domain)', type: 'text', placeholder: 'مثال: myshop.ir', required: true },
      { id: 'business_title', name: 'business_title', label: 'نام تجاری و برند فروشگاه آنلاین', type: 'text', placeholder: 'مثال: دیجی مارکت', required: true },
      { id: 'domain_email', name: 'domain_email', label: 'ایمیل اختصاصی دامنه یا ایمیل عمومی فعال', type: 'text', placeholder: 'info@myshop.ir', required: true },
      { id: 'owner_national_id', name: 'owner_national_id', label: 'کد ملی صاحب امتیاز دامنه', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'owner_mobile', name: 'owner_mobile', label: 'شماره همراه مالک دامنه (به نام شخص)', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'store_postal_code', name: 'store_postal_code', label: 'کد پستی محل فعالیت / انبار فروشگاه', type: 'postal_code', placeholder: '۱۰ رقم', required: true, validationRule: 'postal_code' },
      { 
        id: 'gateway_preference', 
        name: 'gateway_preference', 
        label: 'درگاه پرداخت پیشنهادی', 
        type: 'select', 
        required: true,
        options: [
          { label: 'زرین‌پال (تاییدیه سریع و بدون نیاز به مالیات پیچیده)', value: 'zarinpal' },
          { label: 'پی‌پینگ (PayPing)', value: 'payping' },
          { label: 'درگاه مستقیم شاپرک (به‌پرداخت ملت / سداد ملی)', value: 'direct_psp' },
        ]
      },
      { id: 'verification_method', name: 'verification_method', label: 'روش تایید صلاحیت فنی دامنه', type: 'select', required: true, options: [
        { label: 'دسترسی DNS یا قرار دادن فایل متنی در هاست توسط ما', value: 'dns_or_file' },
        { label: 'تایید با ایمیل اختصاصی دامنه (info@yourdomain)', value: 'email' },
      ]},
    ],
    customModule: {
      type: 'enamad',
    },
    faqs: [
      { question: 'آیا برای اینماد نیاز به داشتن پروانه کسب حضوری است؟', answer: 'خیر، برای اکثر رسته‌های فروش آنلاین، داشتن اینماد و پرونده مالیاتی به تنهایی برای دریافت درگاه پرداخت اینترنتی کفایت می‌کند.' },
      { question: 'تفاوت اینماد تک‌ستاره با دوستاره چیست؟', answer: 'اینماد دوستاره نیازمند داشتن گواهی امنیتی SSL فعال روی دامنه و احراز سطح بالاتری از امنیت تراکنش‌ها می‌باشد.' },
    ],
    seo: {
      metaTitle: 'اخذ اینماد و درگاه پرداخت اینترنتی | پکیج راه‌اندازی فروشگاه آنلاین',
      metaDescription: 'دریافت نماد اعتماد الکترونیکی اینماد، اتصال سریع به درگاه پرداخت زرین‌پال و شاپرک با تاییدیه فنی دامنه و پرونده مالیاتی.',
      keywords: ['اخذ اینماد', 'درگاه پرداخت اینترنتی', 'زرین پال', 'نماد اعتماد الکترونیکی', 'درگاه شاپرک'],
    },
  },

  // ۱۰. ثبت تغییرات شرکت‌ها و پلمب دفاتر
  {
    slug: 'company-registration-seal',
    title: 'پلمب دفاتر تجاری و ثبت تغییرات شرکت‌ها',
    categoryId: 'business',
    category: 'کسب‌وکار و شرکت‌ها',
    iconName: 'Briefcase',
    badgeText: 'سامانه ثبت شرکت‌ها و مالکیت معنوی',
    shortDescription: 'پلمب دفاتر قانونی مالیاتی سال جدید، تنظیم صورتجلسات تغییرات هیئت مدیره، آدرس و افزایش سرمایه.',
    fullDescription: 'تمامی شرکت‌ها و اشخاص حقوقی موظفند پیش از شروع سال مالی نسبت به پلمب دفاتر روزنامه و کل اقدام نمایند. همچنین هرگونه تغییرات اعضای هیئت مدیره، حق امضا و اساسنامه نیازمند ثبت صورتجلسه قانونی و آگهی در روزنامه رسمی کشور است.',
    basePrice: 290000,
    formattedPrice: '۲۹۰,۰۰۰ تومان',
    duration: '۲ تا ۵ روز کاری',
    guaranteeText: 'تحویل بارکد پستی پلمب و پیش‌نویس قانونی صورتجلسات',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'درخواست پلمب دفاتر تجاری ۵۰ و ۱۰۰ برگ', fee: '۲۹۰,۰۰۰ تومان', duration: '۲۴ ساعت' },
      { serviceName: 'تنظیم و ثبت صورتجلسه تغییرات شرکت', fee: '۶۵۰,۰۰۰ تومان', duration: '۴ روز' },
    ],
    fields: [
      { id: 'company_legal_name', name: 'company_legal_name', label: 'نام کامل ثبتی شرکت / موسسه', type: 'text', placeholder: 'مثال: شرکت پیشگامان ارتباطات نوین', required: true },
      { id: 'national_company_id', name: 'national_company_id', label: 'شناسه ملی شرکت (۱۱ رقمی)', type: 'company_id', placeholder: '۱۱ رقم شناسه ملی', required: true, validationRule: 'company_id' },
      { id: 'registration_number', name: 'registration_number', label: 'شماره ثبت شرکت', type: 'text', placeholder: 'مثال: ۵۸۴۲۱۰', required: true },
      { id: 'fiscal_year', name: 'fiscal_year', label: 'سال مالی مورد تقاضای پلمب', type: 'select', required: true, options: [
        { label: 'سال مالی ۱۴۰۴ (پیش‌رو)', value: '1404' },
        { label: 'سال مالی ۱۴۰۳ (جاری)', value: '1403' },
      ]},
      { id: 'ceo_national_id', name: 'ceo_national_id', label: 'کد ملی مدیرعامل', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'ceo_phone', name: 'ceo_phone', label: 'شماره همراه مدیرعامل', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'company_postal_code', name: 'company_postal_code', label: 'کد پستی محل اقامت قانونی شرکت', type: 'postal_code', placeholder: '۱۰ رقم', required: true, validationRule: 'postal_code' },
    ],
    faqs: [
      { question: 'تا چه زمانی برای پلمب دفاتر سال مالی جدید مهلت هست؟', answer: 'پلمب دفاتر هر سال باید حداکثر تا ۲۹ اسفند ماه سال قبل از آن انجام شود تا دفاتر در اداره ثبت مهر و موم شوند.' },
    ],
    seo: {
      metaTitle: 'پلمب دفاتر تجاری و ثبت تغییرات شرکت | سامانه ثبت شرکت‌ها',
      metaDescription: 'ثبت اینترنتی درخواست پلمب دفاتر قانونی سال مالی جدید، تنظیم صورتجلسه تغییرات شرکت‌ها و ارسال مدارک به اداره پست.',
      keywords: ['پلمب دفاتر', 'ثبت شرکتها', 'پلمب دفاتر تجاری', 'روزنامه رسمی', 'تغییرات شرکت'],
    },
  },

  // ۱۱. پایش و ثبت‌نام وام‌های بانکی (ازدواج/فرزند)
  {
    slug: 'bank-loans-monitoring',
    title: 'پایش و ثبت‌نام وام‌های قرض‌الحسنه بانکی (ازدواج و فرزند)',
    categoryId: 'banking',
    category: 'بانکی و حمایتی',
    iconName: 'Coins',
    badgeText: 'ربات پایش سهمیه شعب بانک مرکزی',
    shortDescription: 'پایش مستمر و لحظه‌ای ظرفیت بانک‌های دولتی جهت ثبت‌نام و تعیین شعبه قطعی وام ازدواج و تسهیلات فرزندآوری.',
    fullDescription: 'سهمیه وام‌های قرض‌الحسنه ازدواج و فرزندآوری در سامانه بانک مرکزی به صورت بسیار محدود در ساعات غیرمشخصی باز می‌شود. سیستم پایشگر اختصاصی ما با پایش ۲۴ ساعته وب‌سرویس بانک‌ها، به محض تخصیص سهمیه شعبه شهر شما، نام‌نویسی را کامل و کد رهگیری ۱۰ رقمی را تحویل می‌دهد.',
    basePrice: 220000,
    formattedPrice: '۲۲۰,۰۰۰ تومان',
    duration: 'پایش تا موفقیت (معمولاً ۱ تا ۳ روز)',
    guaranteeText: 'تضمین رزرو شعبه در بانک انتخابی با کد رهگیری رسمی بانک مرکزی',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'پایش و ثبت‌نام وام قرض‌الحسنه ازدواج', fee: '۲۲۰,۰۰۰ تومان', duration: 'پایش ۲۴ ساعته' },
      { serviceName: 'ثبت‌نام تسهیلات قرض‌الحسنه فرزندآوری', fee: '۱۹۰,۰۰۰ تومان', duration: 'پایش ۲۴ ساعته' },
    ],
    fields: [
      { 
        id: 'loan_category', 
        name: 'loan_category', 
        label: 'نوع تسهیلات بانکی', 
        type: 'select', 
        required: true,
        options: [
          { label: 'وام قرض‌الحسنه ازدواج', value: 'marriage_loan' },
          { label: 'وام فرزندآوری', value: 'child_loan' },
        ]
      },
      { id: 'applicant_national_id', name: 'applicant_national_id', label: 'کد ملی متقاضی', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'applicant_phone', name: 'applicant_phone', label: 'شماره همراه متقاضی (بنام شخص)', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'marriage_or_birth_date', name: 'marriage_or_birth_date', label: 'تاریخ عقد یا تاریخ تولد فرزند', type: 'date', required: true },
      { id: 'marriage_contract_number', name: 'marriage_contract_number', label: 'شماره سریال عقدنامه یا شناسنامه فرزند', type: 'text', placeholder: 'مثال: ۵۸۴۲۱', required: true },
      { 
        id: 'preferred_bank', 
        name: 'preferred_bank', 
        label: 'بانک‌های عامل اولویت‌دار', 
        type: 'select', 
        required: true,
        options: [
          { label: 'بانک ملی ایران', value: 'melli' },
          { label: 'بانک ملت', value: 'mellat' },
          { label: 'بانک صادرات', value: 'saderat' },
          { label: 'بانک تجارت', value: 'tejarat' },
          { label: 'بانک رفاه کارگران', value: 'refah' },
          { label: 'بانک سپه', value: 'sepah' },
          { label: 'هر بانکی که زودتر ظرفیت باز کرد', value: 'any' },
        ]
      },
      { id: 'province_city', name: 'province_city', label: 'استان و شهر محل دریافت تسهیلات', type: 'text', placeholder: 'مثال: استان تهران، شهر تهران', required: true },
    ],
    faqs: [
      { question: 'وام ازدواج تا چند سال پس از تاریخ عقد قابل دریافت است؟', answer: 'متقاضیانی که تاریخ عقد آنها از ۱ فروردین ۱۳۹۹ به بعد باشد تا پایان ۲۴ ماه پس از عقد می‌توانند وام را دریافت نمایند.' },
    ],
    seo: {
      metaTitle: 'ثبت نام وام ازدواج و فرزندآوری | ربات تعیین شعبه بانک مرکزی',
      metaDescription: 'پایش و ثبت‌نام وام ازدواج و فرزندآوری در سامانه بانک مرکزی ve.cbi.ir، رزرو سریع شعبه در بانک ملی، ملت، صادرات و تجارت.',
      keywords: ['وام ازدواج', 'ثبت نام وام ازدواج', 'وام فرزندآوری', 'تعیین شعبه وام', 'بانک مرکزی'],
    },
  },

  // ۱۲. ثبت برند و علامت تجاری
  {
    slug: 'trademark-brand-registration',
    title: 'استعلام و ثبت برند، علامت تجاری و لوگو',
    categoryId: 'business',
    category: 'کسب‌وکار و شرکت‌ها',
    iconName: 'BadgeCheck',
    badgeText: 'مالکیت معنوی و انحصار نام تجاری',
    shortDescription: 'استعلام تشابه نام برند پیش از ثبت، تشکیل پرونده در مرکز مالکیت معنوی، تدوین اظهارنامه و آگهی نوبت اول.',
    fullDescription: 'ثبت نام تجاری برند مانع از سوء استفاده رقبا و کپی‌برداری از محصولات شما می‌شود. با استعلام پیشرفته در سامانه مالکیت معنوی، احتمال رد برند را به حداقل رسانده و اظهارنامه شما را با تعیین دقیق طبقات کالایی تنظیم می‌کنیم.',
    basePrice: 480000,
    formattedPrice: '۴۸۰,۰۰۰ تومان',
    duration: 'استعلام در ۲ ساعت / پرونده ۳ روز',
    guaranteeText: 'استعلام اصالت برند در تمامی طبقات ۴۵ گانه بین‌المللی کالا و خدمات',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'استعلام تشابه برند و ارزیابی شانس قبولی', fee: '۱۲۰,۰۰۰ تومان', duration: '۲ ساعت' },
      { serviceName: 'تنظیم و ارسال اظهارنامه ثبت علامت تجاری', fee: '۴۸۰,۰۰۰ تومان', duration: '۳ روز' },
    ],
    fields: [
      { id: 'brand_persian_name', name: 'brand_persian_name', label: 'نام پیشنهادی برند (فارسی)', type: 'text', placeholder: 'مثال: روناک، کاسپین، آریا...', required: true },
      { id: 'brand_latin_name', name: 'brand_latin_name', label: 'نام لاتین برند (در صورت تمایل به ثبت لاتین)', type: 'text', placeholder: 'مثال: Ronak', required: false },
      { id: 'business_field', name: 'business_field', label: 'زمینه فعالیت و محصولات/خدمات', type: 'textarea', placeholder: 'مثال: تولید پوشاک، بسته‌بندی مواد غذایی، خدمات نرم‌افزاری...', required: true },
      { id: 'owner_type', name: 'owner_type', label: 'نوع مالکیت برند', type: 'select', required: true, options: [
        { label: 'شخص حقیقی (به نام خودم)', value: 'individual' },
        { label: 'شخص حقوقی (به نام شرکت)', value: 'corporate' },
      ]},
      { id: 'license_file', name: 'license_file', label: 'تصویر جواز تاسیس، پروانه کسب یا اینماد (اختیاری)', type: 'file', required: false, validationRule: 'file' },
      { id: 'logo_image_file', name: 'logo_image_file', label: 'تصویر لوگو یا علامت گرافیکی (در صورت وجود)', type: 'file', required: false, validationRule: 'file' },
    ],
    faqs: [
      { question: 'آیا برای ثبت برند حتماً نیاز به کارت بازرگانی است؟', answer: 'خیر، تنها در صورتی که نام برند دارای حروف لاتین باشد داشتن کارت بازرگانی یا عضویت اتاق بازرگانی الزامی است.' },
    ],
    seo: {
      metaTitle: 'ثبت برند و علامت تجاری | استعلام تشابه نام برند و لوگو',
      metaDescription: 'استعلام آنلاین تشابه نام برند در مرکز مالکیت معنوی، ثبت اظهارنامه علامت تجاری، حمایت قانونی و آگهی رسمی برند.',
      keywords: ['ثبت برند', 'علامت تجاری', 'استعلام نام برند', 'مالکیت معنوی', 'ثبت لوگو'],
    },
  },

  // ۱۳. ثبت کسب‌وکار در نقشه‌ها (Google Maps، بلد، نشان)
  {
    slug: 'maps-business-registration',
    title: 'ثبت لوکیشن کسب‌وکار در گوگل‌مپ، بلد و نشان',
    categoryId: 'business',
    category: 'کسب‌وکار و شرکت‌ها',
    iconName: 'MapPin',
    badgeText: 'دیده‌شدن توسط مشتریان اطراف',
    shortDescription: 'ثبت دائمی موقعیت مکانی مغازه، شرکت یا کارگاه روی Google Maps، نقشه نشان، بلد و اسنپ به همراه شماره و ساعات کاری.',
    fullDescription: 'حضور در نقشه‌های دیجیتال موجب هدایت مستقیم مشتریان محلی و افزایش چشمگیر فروش حضوری و تلفنی می‌شود. ما موقعیت مکانی شما را با تاییدیه گوگل و اپلیکیشن‌های بومی بدون ریسک حذف یا دستکاری ثبت می‌نماییم.',
    basePrice: 150000,
    formattedPrice: '۱۵۰,۰۰۰ تومان',
    duration: '۲۴ تا ۴۸ ساعت',
    guaranteeText: 'ثبت قطعی لوکیشن با تاییدیه جستجو در اسنپ و گوگل مپ',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'پکیج کامل (گوگل‌مپ + بلد + نشان + اسنپ)', fee: '۲۴۰,۰۰۰ تومان', duration: '۴۸ ساعت' },
      { serviceName: 'فقط Google Maps بین‌المللی', fee: '۱۵۰,۰۰۰ تومان', duration: '۲۴ ساعت' },
    ],
    fields: [
      { id: 'business_name', name: 'business_name', label: 'نام کامل کسب‌وکار / فروشگاه روی نقشه', type: 'text', placeholder: 'مثال: رستوران سنتی ارکیده', required: true },
      { id: 'category_business', name: 'category_business', label: 'رسته و دسته‌بندی فروشگاه', type: 'text', placeholder: 'مثال: سوپرمارکت، داروخانه، سالن زیبایی...', required: true },
      { id: 'business_phone', name: 'business_phone', label: 'شماره تماس جهت نمایش در نقشه', type: 'text', placeholder: '۰۲۱۲۲۳۳۴۴۵۵', required: true },
      { id: 'working_hours', name: 'working_hours', label: 'روزها و ساعات کاری', type: 'text', placeholder: 'مثال: شنبه تا پنجشنبه از ۹ الی ۲۱', required: true },
      { id: 'exact_address', name: 'exact_address', label: 'آدرس متنی دقیق به همراه پلاک', type: 'textarea', placeholder: 'شهر، خیابان، پلاک، طبقه...', required: true },
      { id: 'storefront_photo', name: 'storefront_photo', label: 'عکس از تابلوی مغازه یا ورودی محل کسب (جهت تایید سریع)', type: 'file', required: false, validationRule: 'file' },
    ],
    faqs: [
      { question: 'آیا بعد از ثبت، نام مغازه در اسنپ و تپسی هم پیدا می‌شود؟', answer: 'بله، با ثبت در بلد و نشان و گوگل، بانک‌های اطلاعاتی اسنپ و تپسی نیز لوکیشن شما را به عنوان مقصد شناسایی می‌کنند.' },
    ],
    seo: {
      metaTitle: 'ثبت لوکیشن در گوگل مپ و بلد و نشان | اضافه کردن مغازه به نقشه',
      metaDescription: 'ثبت دائمی آدرس کسب‌وکار در Google Maps، بلد، نشان و اسنپ، اضافه کردن عکس، شماره تلفن و ساعات کاری جهت جذب مشتری.',
      keywords: ['ثبت لوکیشن در گوگل مپ', 'ثبت در بلد', 'ثبت در نشان', 'اضافه کردن مغازه به نقشه', 'گوگل مپ'],
    },
  },

  // ۱۴. صدور و تاییدیه کد پستی GNAF
  {
    slug: 'gnaf-postal-code',
    title: 'استعلام، صدور و گواهی کد پستی ده‌رقمی GNAF',
    categoryId: 'real-estate',
    category: 'املاک و مسکن',
    iconName: 'Mail',
    badgeText: 'شرکت ملی پست جمهوری اسلامی ایران',
    shortDescription: 'استعلام تاییدیه کد پستی معتبر، دریافت گواهی الکترونیک کد پستی با QR-Code و ثبت درخواست کد پستی برای ساختمان‌های نوساز.',
    fullDescription: 'گواهی تاییدیه کد پستی شرکت ملی پست مدرک اصلی احراز نشانی جهت ثبت شرکت، اخذ اینماد، دریافت دسته‌چک و تعویض پلاک است. سیستم ما گواهی رسمی را مستقیماً از سامانه GNAF استعلام و فایل PDF ممهور به بارکد رهگیری را صادر می‌کند.',
    basePrice: 65000,
    formattedPrice: '۶۵,۰۰۰ تومان',
    duration: 'کمتر از ۱۵ دقیقه',
    guaranteeText: 'فایل رسمی PDF ممهور به هولوگرام و تاییدیه نشانی شرکت ملی پست',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'استعلام و صدور گواهی الکترونیک کد پستی', fee: '۶۵,۰۰۰ تومان', duration: '۱۰ دقیقه' },
      { serviceName: 'یافتن کد پستی از روی آدرس و شناسه کنتور', fee: '۸۵,۰۰۰ تومان', duration: '۲۰ دقیقه' },
      { serviceName: 'درخواست تخصیص کد پستی جدید برای املاک نوساز', fee: '۱۸۰,۰۰۰ تومان', duration: '۲ روز' },
    ],
    fields: [
      { id: 'postal_code', name: 'postal_code', label: 'کد پستی ۱۰ رقمی (در صورت داشتن)', type: 'postal_code', placeholder: '۱۰ رقم بدون خط تیره', required: false, validationRule: 'postal_code' },
      { id: 'electricity_id', name: 'electricity_id', label: 'شناسه قبض برق کنتور ملک', type: 'text', placeholder: '۱۳ رقم شناسه برق', required: false },
      { id: 'full_address', name: 'full_address', label: 'آدرس کامل ملک', type: 'textarea', placeholder: 'استان، شهر، خیابان اصلی، کوچه، پلاک، زنگ، واحد...', required: true },
      { id: 'applicant_phone', name: 'applicant_phone', label: 'شماره همراه جهت ارسال فایل گواهی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
    ],
    faqs: [
      { question: 'آیا گواهی کد پستی دریافتی برای بانک‌ها معتبر است؟', answer: 'بله، این برگه شامل تاییدیه استاندارد آدرس مکانی GNAF و کد اعتبارسنجی ملی پست است.' },
    ],
    seo: {
      metaTitle: 'دریافت گواهی کد پستی GNAF | استعلام تاییدیه پستی شرکت ملی پست',
      metaDescription: 'استعلام آنلاین کد پستی از روی آدرس یا قبض برق، دریافت گواهی کد پستی رسمی با بارکد و تاییدیه نشانی شرکت ملی پست ایران.',
      keywords: ['گواهی کد پستی', 'استعلام کد پستی', 'کد پستی ده رقمی', 'سامانه GNAF', 'تاییدیه پستی'],
    },
  },

  // ۱۵. سوابق بیمه تامین اجتماعی
  {
    slug: 'tamin-social-security',
    title: 'سوابق بیمه تامین اجتماعی و نسخه الکترونیک',
    categoryId: 'judicial',
    category: 'قضایی و هویتی',
    iconName: 'HeartHandshake',
    badgeText: 'درگاه خدمات غیرحضوری eservices.tamin.ir',
    shortDescription: 'مشاهده و تجمیع سوابق بیمه تامین اجتماعی، صدور گواهی رسمی سابقه برای بانک و سفارت، و بررسی استحقاق درمان.',
    fullDescription: 'مشاهده ماه‌به‌ماه واریزی حق بیمه توسط کارفرما و اطمینان از احتساب سابقه بازنشستگی. دریافت گواهی با بارکد اصالت بدون نیاز به مراجعه به شعب و کارگزاری‌های تامین اجتماعی.',
    basePrice: 70000,
    formattedPrice: '۷۰,۰۰۰ تومان',
    duration: 'کمتر از ۱۵ دقیقه',
    guaranteeText: 'فایل رسمی استعلام سوابق با رمز اصالت سند تامین اجتماعی',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'استعلام ریز سوابق و آخرین وضعیت بیمه‌پردازی', fee: '۷۰,۰۰۰ تومان', duration: '۱۰ دقیقه' },
      { serviceName: 'صدور گواهی سابقه رسمی جهت ارائه به مراجع', fee: '۹۵,۰۰۰ تومان', duration: '۱۵ دقیقه' },
    ],
    fields: [
      { id: 'national_id', name: 'national_id', label: 'کد ملی بیمه‌شده', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه متصل به تامین اجتماعی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'tamin_password', name: 'tamin_password', label: 'گذرواژه پرتال تامین اجتماعی (در صورت داشتن)', type: 'text', placeholder: 'گذرواژه شامل حروف بزرگ و کوچک', required: false },
    ],
    faqs: [
      { question: 'در صورت نداشتن گذرواژه تامین اجتماعی چه باید کرد؟', answer: 'کارشناسان ما به صورت آنی حساب کاربری شما را در پرتال تامین اجتماعی فعال و رمز موقت را برایتان ارسال می‌نمایند.' },
    ],
    seo: {
      metaTitle: 'سوابق بیمه تامین اجتماعی | استعلام آنلاین سابقه بیمه با کد ملی',
      metaDescription: 'مشاهده فوری سوابق بیمه تامین اجتماعی eservices.tamin.ir با کد ملی، دریافت گواهی سابقه با بارکد اصالت و بررسی واریزی کارفرما.',
      keywords: ['سوابق بیمه', 'تامین اجتماعی', 'استعلام سابقه بیمه', 'گواهی سابقه کار', 'تامین اجتماعی من'],
    },
  },

  // ۱۶. گواهی عدم سوء پیشینه الکترونیکی
  {
    slug: 'background-check-clearance',
    title: 'گواهی عدم سوء پیشینه الکترونیکی',
    categoryId: 'judicial',
    category: 'قضایی و هویتی',
    iconName: 'FileLock2',
    badgeText: 'درگاه قوه قضاییه با پاسخ ۲۴ ساعته',
    shortDescription: 'درخواست آنلاین گواهی عدم سوء پیشینه کیفری بدون نیاز به انگشت‌نگاری حضوری، همراه با بارکد رسمی تصدیق اصالت.',
    fullDescription: 'گواهی عدم سوء پیشینه از الزامات استخدام در شرکت‌ها، اخذ پروانه کسب، کارت بازرگانی و عضویت در سازمان‌هاست. این خدمت مستقیماً از طریق پایگاه سجل کیفری قوه قضاییه پردازش شده و نسخه نهایی با امضای دیجیتال صادر می‌گردد.',
    basePrice: 110000,
    formattedPrice: '۱۱۰,۰۰۰ تومان',
    duration: '۱۲ الی ۲۴ ساعت',
    guaranteeText: 'صدور نسخه معتبر PDF با کد رهگیری و مهر برجسته الکترونیکی',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'درخواست گواهی عادی جهت استخدام و مجوزها', fee: '۱۱۰,۰۰۰ تومان', duration: '۲۴ ساعت' },
      { serviceName: 'درخواست فوری ویژه سفارت و پرونده‌های اضطراری', fee: '۱۹۰,۰۰۰ تومان', duration: '۱۲ ساعت' },
    ],
    fields: [
      { id: 'national_id', name: 'national_id', label: 'کد ملی متقاضی', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه متصل به ثنا', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'organization_name', name: 'organization_name', label: 'مرجع یا سازمان متقاضی گواهی', type: 'text', placeholder: 'مثال: جهت ارائه به شرکت خصوصی، اصناف...', required: true },
      { id: 'postal_code', name: 'postal_code', label: 'کد پستی ۱۰ رقمی محل سکونت', type: 'postal_code', placeholder: '۱۰ رقم', required: true, validationRule: 'postal_code' },
    ],
    faqs: [
      { question: 'آیا نیاز به مراجعه به پلیس +۱۰ برای انگشت‌نگاری هست؟', answer: 'خیر، در صورتی که در سامانه ثنا ثبت‌نام داشته باشید، نیازی به انگشت‌نگاری فیزیکی نبوده و استعلام کاملاً سیستمی صادر می‌شود.' },
    ],
    seo: {
      metaTitle: 'گواهی عدم سوء پیشینه آنلاین | درخواست گواهی سجل کیفری ثنا',
      metaDescription: 'درخواست غیرحضوری گواهی عدم سوء پیشینه کیفری قوه قضاییه بدون انگشت‌نگاری، صدور ۲۴ ساعته نسخه دیجیتال با بارکد استعلام.',
      keywords: ['عدم سوء پیشینه', 'گواهی عدم سوء پیشینه', 'سجل کیفری', 'ثبت نام سوء پیشینه', 'عدل ایران'],
    },
  },

  // ۱۷. فیش حقوقی و احکام بازنشستگان
  {
    slug: 'pensioners-payslip',
    title: 'فیش حقوقی و احکام بازنشستگان کشوری، لشکری و تامین اجتماعی',
    categoryId: 'banking',
    category: 'بانکی و حمایتی',
    iconName: 'Wallet',
    badgeText: 'صندوق بازنشستگی کشوری و تامین اجتماعی',
    shortDescription: 'دریافت، مشاهده و پرینت فیش حقوقی ماهانه، احکام افزایش سالانه و گواهی کسر از حقوق بازنشستگان و مستمری‌بگیران.',
    fullDescription: 'سامانه دریافت آخرین فیش حقوقی ممهور برای ارائه به بانک‌ها جهت دریافت وام و ضمانت بستگان. دسترسی به احکام همسان‌سازی و احکام کارگزینی جدید.',
    basePrice: 50000,
    formattedPrice: '۵۰,۰۰۰ تومان',
    duration: 'کمتر از ۱۰ دقیقه',
    guaranteeText: 'تحویل فایل چاپی با کیفیت بالا و اطلاعات کد پرسنلی',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'دریافت فیش حقوقی ماهانه', fee: '۵۰,۰۰۰ تومان', duration: 'آنی' },
      { serviceName: 'دریافت حکم افزایش سالانه / همسان‌سازی', fee: '۶۵,۰۰۰ تومان', duration: '۱۰ دقیقه' },
    ],
    fields: [
      { 
        id: 'pension_fund', 
        name: 'pension_fund', 
        label: 'صندوق بازنشستگی', 
        type: 'select', 
        required: true,
        options: [
          { label: 'صندوق تامین اجتماعی', value: 'tamin' },
          { label: 'صندوق بازنشستگی کشوری', value: 'civil' },
          { label: 'صندوق بازنشستگی نیروهای مسلح (ساتا)', value: 'sata' },
        ]
      },
      { id: 'national_id', name: 'national_id', label: 'کد ملی بازنشسته', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه به نام بازنشسته', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'personnel_or_account_number', name: 'personnel_or_account_number', label: 'شماره دفترکل یا شماره حساب واریز حقوق', type: 'text', placeholder: 'شماره حساب حقوقی', required: true },
    ],
    faqs: [
      { question: 'آیا این فیش برای ضمانت وام بانکی پذیرفته می‌شود؟', answer: 'بله، تمامی اطلاعات هویتی و شماره حساب حقوقی همراه با شناسه استعلام در فایل درج می‌گردد.' },
    ],
    seo: {
      metaTitle: 'فیش حقوقی بازنشستگان | دریافت فیش حقوقی تامین اجتماعی و کشوری',
      metaDescription: 'دریافت آنلاین آخرین فیش حقوقی و احکام بازنشستگان تامین اجتماعی، بازنشستگی کشوری و ساتا با کد ملی و شماره حساب.',
      keywords: ['فیش حقوقی بازنشستگان', 'حکم بازنشستگی', 'فیش تامین اجتماعی', 'صندوق بازنشستگی کشوری'],
    },
  },

  // ۱۸. نوبت‌دهی گذرنامه و کارت هوشمند ملی
  {
    slug: 'passport-idcard-booking',
    title: 'نوبت‌دهی گذرنامه و کارت هوشمند ملی',
    categoryId: 'judicial',
    category: 'قضایی و هویتی',
    iconName: 'BookUser',
    badgeText: 'پلیس مهاجرت و سازمان ثبت احوال',
    shortDescription: 'رزرو نوبت دفاتر پلیس +۱۰ برای تعویض و تمدید گذرنامه زیارتی و عادی، و دفاتر پیشخوان کارت ملی هوشمند.',
    fullDescription: 'جلوگیری از اتلاف وقت در صفوف دفاتر پلیس +۱۰ و پیشخوان دولت. ثبت اطلاعات اولیه، تعیین ساعت و شعبه خلوت‌تر و دریافت پیامک یادآوری مدارک لازم.',
    basePrice: 65000,
    formattedPrice: '۶۵,۰۰۰ تومان',
    duration: 'کمتر از ۱۵ دقیقه',
    guaranteeText: 'رزرو قطعی بازه زمانی مراجعه با ارسال چک‌لیست مدارک',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'نوبت‌دهی گذرنامه عادی و اربعین', fee: '۶۵,۰۰۰ تومان', duration: '۱۰ دقیقه' },
      { serviceName: 'نوبت‌دهی صدور و تعویض کارت هوشمند ملی', fee: '۶۵,۰۰۰ تومان', duration: '۱۰ دقیقه' },
    ],
    fields: [
      { 
        id: 'booking_service', 
        name: 'booking_service', 
        label: 'نوع درخواست', 
        type: 'select', 
        required: true,
        options: [
          { label: 'صدور / تمدید گذرنامه بین‌المللی', value: 'passport_international' },
          { label: 'گذرنامه زیارتی ویژه اربعین', value: 'passport_ziarat' },
          { label: 'ثبت‌نام کارت هوشمند ملی', value: 'national_card' },
        ]
      },
      { id: 'national_id', name: 'national_id', label: 'کد ملی متقاضی', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه متقاضی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'city', name: 'city', label: 'شهر و منطقه محل سکونت', type: 'text', placeholder: 'مثال: مشهد، بلوار سجاد', required: true },
    ],
    faqs: [
      { question: 'برای گذرنامه چه مدارکی الزامی است؟', answer: 'اصل شناسنامه، کارت ملی، گذرنامه قبلی، عکس بیومتریک (در دفتر گرفته می‌شود) و اجازه محضری همسر برای بانوان متاهل.' },
    ],
    seo: {
      metaTitle: 'نوبت دهی گذرنامه و کارت ملی | رزرو نوبت پلیس +۱۰',
      metaDescription: 'رزرو آنلاین نوبت دفاتر پلیس +۱۰ جهت صدور و تمدید گذرنامه، ثبت نام کارت هوشمند ملی و گذرنامه زیارتی اربعین.',
      keywords: ['نوبت دهی گذرنامه', 'پلیس +10', 'کارت هوشمند ملی', 'گذرنامه اربعین', 'تمدید گذرنامه'],
    },
  },

  // ۱۹. تاییدیه تحصیلی و سوابق دیپلم
  {
    slug: 'academic-diploma-verification',
    title: 'تاییدیه تحصیلی الکترونیکی و سوابق فارغ‌التحصیلی',
    categoryId: 'education',
    category: 'آموزش و پژوهش',
    iconName: 'GraduationCap',
    badgeText: 'وزارت آموزش و پرورش (emtiaz.medu.ir)',
    shortDescription: 'دریافت کد پیگیری تاییدیه تحصیلی دیپلم و پیش‌دانشگاهی جهت ثبت‌نام دانشگاه سراسری، آزاد، پیام‌نور و استخدام.',
    fullDescription: 'تمامی دانشگاه‌ها در زمان پذیرش دانشجو موظف به اخذ تاییدیه تحصیلی سوابق فارغ‌التحصیلی از وزارت آموزش و پرورش هستند. درخواست شما در سامانه رسمی ثبت و کد پیگیری استعلام مستقیماً به دانشگاه مقصد متصل می‌گردد.',
    basePrice: 75000,
    formattedPrice: '۷۵,۰۰۰ تومان',
    duration: 'کمتر از ۳۰ دقیقه',
    guaranteeText: 'ارسال مستقیم تاییدیه به کارتابل استعلام دانشگاه مقصد',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'تاییدیه تحصیلی دیپلم نظام جدید و قدیم', fee: '۷۵,۰۰۰ تومان', duration: '۲۰ دقیقه' },
      { serviceName: 'استعلام ریزنمرات نهایی برای کنکور سراسری', fee: '۸۵,۰۰۰ تومان', duration: '۳۰ دقیقه' },
    ],
    fields: [
      { id: 'national_id', name: 'national_id', label: 'کد ملی فارغ‌التحصیل', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه دانشجو / متقاضی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'graduation_year', name: 'graduation_year', label: 'سال فارغ‌التحصیلی دیپلم', type: 'number', placeholder: 'مثال: ۱۴۰۱', required: true },
      { id: 'destination_university', name: 'destination_university', label: 'نام کامل دانشگاه یا سازمان استعلام‌گیرنده', type: 'text', placeholder: 'مثال: دانشگاه آزاد واحد علوم و تحقیقات', required: true },
    ],
    faqs: [
      { question: 'کد پیگیری چه زمانی برای دانشگاه فعال می‌شود؟', answer: 'کد پیگیری بلافاصله صادر شده و دانشگاه مقصد با وارد کردن آن در سامانه استعلام وزارت آموزش و پرورش ریزنمرات را تایید می‌کند.' },
    ],
    seo: {
      metaTitle: 'تاییدیه تحصیلی آنلاین | استعلام کد پیگیری دیپلم و پیش دانشگاهی',
      metaDescription: 'دریافت اینترنتی تاییدیه تحصیلی آموزش و پرورش emtiaz.medu.ir، ثبت سوابق فارغ‌التحصیلی دیپلم جهت ثبت‌نام دانشگاه.',
      keywords: ['تاییدیه تحصیلی', 'استعلام دیپلم', 'کد تاییدیه تحصیلی', 'ثبت نام دانشگاه', 'سوابق تحصیلی'],
    },
  },

  // ۲۰. امور مالیات بر ارث و نقل و انتقال ملک
  {
    slug: 'inheritance-property-tax',
    title: 'اظهارنامه مالیات بر ارث و استعلام نقل و انتقال قطعی املاک',
    categoryId: 'tax',
    category: 'مالیات و دارایی',
    iconName: 'Landmark',
    badgeText: 'ماده ۱۸۷ قانون مالیات‌های مستقیم',
    shortDescription: 'محاسبه و اخذ گواهی موضوع ماده ۱۸۷ جهت دفترخانه، اظهارنامه مالیات بر ارث متوفیان و استعلام مالیات مستغلات.',
    fullDescription: 'تنظیم سند قطعی انتقال ملک در دفاتر اسناد رسمی منوط به تسویه مالیات نقل و انتقال و اخذ مفاصاحساب ماده ۱۸۷ است. همچنین تقسیم ارث نیازمند تسلیم اظهارنامه موازین قانونی ارث و دریافت گواهی واریز مالیات اموال است.',
    basePrice: 380000,
    formattedPrice: '۳۸۰,۰۰۰ تومان',
    duration: '۱ تا ۳ روز کاری',
    guaranteeText: 'اخذ گواهی الکترونیک معتبر مورد تایید سامانه ثبت آنی اسناد',
    formType: 'standard',
    pricingTable: [
      { serviceName: 'استعلام و صدور مفاصاحساب مالیاتی ماده ۱۸۷ املاک', fee: '۳۸۰,۰۰۰ تومان', duration: '۲۴ ساعت' },
      { serviceName: 'تنظیم اظهارنامه مالیات بر ارث اموال منقول و غیرمنقول', fee: '۶۵۰,۰۰۰ تومان', duration: '۳ روز' },
    ],
    fields: [
      { 
        id: 'tax_subject', 
        name: 'tax_subject', 
        label: 'نوع درخواست مالیاتی', 
        type: 'select', 
        required: true,
        options: [
          { label: 'مفاصاحساب نقل و انتقال املاک (ماده ۱۸۷ دفترخانه)', value: 'article_187' },
          { label: 'اظهارنامه مالیات بر ارث و انحصار وراثت', value: 'inheritance' },
          { label: 'استعلام مالیات بر اجاره و مستغلات', value: 'rental_tax' },
        ]
      },
      { id: 'taxpayer_national_id', name: 'taxpayer_national_id', label: 'کد ملی متقاضی یا وکیل قانونی', type: 'national_id', placeholder: '۱۰ رقم', required: true, validationRule: 'national_code' },
      { id: 'phone', name: 'phone', label: 'شماره همراه متقاضی', type: 'mobile', placeholder: '۰۹۱۲۰۰۰۰۰۰۰', required: true, validationRule: 'mobile' },
      { id: 'property_postal_code', name: 'property_postal_code', label: 'کد پستی ۱۰ رقمی ملک مورد معامله', type: 'postal_code', placeholder: '۱۰ رقم', required: true, validationRule: 'postal_code' },
      { id: 'notary_office_number', name: 'notary_office_number', label: 'شماره دفترخانه اسناد رسمی (در صورت مراجعه)', type: 'text', placeholder: 'مثال: دفترخانه شماره ۲۵ تهران', required: false },
      { id: 'deed_file', name: 'deed_file', label: 'تصویر سند مالکیت یا برگ انحصار وراثت', type: 'file', required: true, validationRule: 'file' },
    ],
    faqs: [
      { question: 'گواهی ماده ۱۸۷ پس از صدور تا چه مدت معتبر است؟', answer: 'گواهی مالیاتی تا پایان سال مالیاتی صدور معتبر است و در سامانه ثبت آنی دفاتر اسناد رسمی قابل مشاهده می‌باشد.' },
    ],
    seo: {
      metaTitle: 'مفاصاحساب مالیات بر ارث و ماده ۱۸۷ املاک | استعلام آنلاین مالیاتی',
      metaDescription: 'دریافت گواهی ماده ۱۸۷ مالیات نقل و انتقال ملک جهت دفترخانه، ثبت اظهارنامه مالیات بر ارث و تسویه مالیات مستغلات.',
      keywords: ['ماده 187', 'مالیات بر ارث', 'نقل و انتقال املاک', 'مفاصاحساب مالیاتی', 'استعلام دارایی'],
    },
  },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return servicesConfig.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return servicesConfig.map((s) => s.slug);
}
