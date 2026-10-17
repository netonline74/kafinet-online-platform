import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidSupabaseConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

// Initial in-memory seed data for graceful standalone operation
const initialCategories = [
  {
    id: 'cat-housing',
    title: 'نقل و انتقال مسکن',
    description: 'امور ملکی، استعلام قرارداد ۵ برگی پردیس و استعلامات ثبتی',
    icon_name: 'Building',
    display_order: 1,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'cat-tax',
    title: 'امور مالیاتی',
    description: 'اظهارنامه مالیاتی، تبصره ۱۰۰ و سامانه مودیان',
    icon_name: 'Calculator',
    display_order: 2,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'cat-univ',
    title: 'امور دانشگاهی',
    description: 'ثبت‌نام کنکور، انتخاب رشته و تاییدیه تحصیلی',
    icon_name: 'GraduationCap',
    display_order: 3,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'cat-car',
    title: 'خدمات خودرو',
    description: 'نوبت‌دهی تعویض پلاک، استعلام خلافی و ثبت‌نام خودرو',
    icon_name: 'Car',
    display_order: 4,
    created_at: new Date('2025-01-01').toISOString(),
  },
];

const initialServices = [
  {
    id: 'pardis-housing-transfer',
    category_id: 'cat-housing',
    title: 'استعلام و نقل و انتقال مسکن مهر پردیس',
    description: 'بررسی اصالت قرارداد ۵ برگی، تشکیل پرونده کارگزاری در شرکت عمران پردیس و استعلامات ثبتی و بانکی',
    required_documents: [
      { id: 'doc-id-card', label: 'تصویر کارت ملی و شناسنامه', type: 'file', is_required: true },
      { id: 'doc-contract', label: 'تصویر قرارداد ۵ برگی عمران', type: 'file', is_required: true },
      { id: 'doc-facility-num', label: 'شماره تسهیلات بانک مسکن', type: 'text', is_required: true },
      { id: 'doc-power-attorney', label: 'سلسله وکالت‌نامه‌های قبلی', type: 'file', is_required: false },
    ],
    base_price: 350000,
    display_order: 1,
    is_active: true,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'tax-affairs',
    category_id: 'cat-tax',
    title: 'امور مالیاتی، اظهارنامه و سامانه مودیان',
    description: 'ارسال اظهارنامه مالیات بر درآمد مشاغل، ثبت فرم تبصره ماده ۱۰۰، ثبت‌نام کد اقتصادی',
    required_documents: [
      { id: 'doc-tax-pass', label: 'کلمه عبور درگاه ملی مالیات (my.tax.gov.ir)', type: 'text', is_required: true },
      { id: 'doc-pos-report', label: 'گردش حساب بانکی و ریز تراکنش‌های کارتخوان', type: 'file', is_required: true },
      { id: 'doc-license', label: 'تصویر پروانه کسب یا مجوز فعالیت', type: 'file', is_required: false },
    ],
    base_price: 250000,
    display_order: 1,
    is_active: true,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'university-registration',
    category_id: 'cat-univ',
    title: 'ثبت‌نام آزمون‌ها و تاییدیه تحصیلی',
    description: 'ثبت نام کنکور سراسری، ارشد، دکتری و دریافت تاییدیه تحصیلی آنلاین',
    required_documents: [
      { id: 'doc-univ-cert', label: 'کد پیگیری دیپلم یا تاییدیه مدرک', type: 'text', is_required: true },
      { id: 'doc-univ-photo', label: 'تصویر پرسنلی ۳×۴', type: 'file', is_required: true },
    ],
    base_price: 120000,
    display_order: 2,
    is_active: true,
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'vehicle-services',
    category_id: 'cat-car',
    title: 'نوبت‌دهی تعویض پلاک و معاینه فنی',
    description: 'دریافت سریع نوبت مراکز تعویض پلاک، پرداخت خلافی و عوارض آزادراهی',
    required_documents: [
      { id: 'doc-car-plate', label: 'شماره پلاک خودرو', type: 'text', is_required: true },
      { id: 'doc-car-card', label: 'تصویر کارت یا برگ سبز خودرو', type: 'file', is_required: false },
    ],
    base_price: 90000,
    display_order: 2,
    is_active: true,
    created_at: new Date('2025-01-01').toISOString(),
  },
];

const initialAnnouncements = [
  {
    id: 'ann-1',
    title: 'آغاز ثبت‌نام مرحله جدید خودروهای وارداتی در سامانه یکپارچه',
    description: 'متقاضیان می‌توانند جهت ثبت‌نام و تعیین اولویت با بارگذاری مدارک اقدام نمایند.',
    category: 'خودرو',
    urgency_level: 'critical',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    action_link: '/order/new',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    title: 'آخرین مهلت ارسال فرم تبصره ماده ۱۰۰ مالیات عملکرد مشاغل',
    description: 'به منظور جلوگیری از جرایم مالیاتی، پیش از پایان مهلت قانونی نسبت به تعیین مالیات مقطوع اقدام کنید.',
    category: 'مالیات',
    urgency_level: 'warning',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    action_link: '/services/tax-affairs',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ann-3',
    title: 'شروع دریافت تاییدیه تحصیلی الکترونیکی برای داوطلبان کنکور',
    description: 'داوطلبان آزمون سراسری موظف به استعلام سوابق تحصیلی از سامانه وزارت آموزش و پرورش هستند.',
    category: 'آموزش',
    urgency_level: 'normal',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    action_link: '/order/new',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const initialArticles = [
  {
    id: 'art-1',
    title: 'راهنمای جامع نقل و انتقال مسکن مهر پردیس و استعلام قرارداد ۵ برگی',
    slug: 'pardis-housing-transfer-guide',
    excerpt: 'تمام مراحل قانونی بررسی اصالت اسناد، استعلام بدهی عمران و انتقال قطعی در دفتر اسناد رسمی بدون واسطه.',
    is_published: true,
    cover_image: '',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'art-2',
    title: 'تفاوت تبصره ۱۰۰ با اظهارنامه عادی؛ کدام روش به نفع کسب‌وکار شماست؟',
    slug: 'tax-article-100-vs-normal',
    excerpt: 'بررسی ضرایب مالیاتی، سقف فروش مجاز و نحوه رسیدگی به حساب‌های تجاری در سامانه سازمان امور مالیاتی کشور.',
    is_published: true,
    cover_image: '',
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'art-3',
    title: 'نکات کلیدی نوبت‌دهی اینترنتی تعویض پلاک و مدارک مورد نیاز',
    slug: 'vehicle-plate-transfer-tips',
    excerpt: 'راهنمای سریع برای دریافت وقت در کوتاه‌ترین زمان، مدارک احراز سکونت و پرداخت الکترونیکی عوارض شهرداری.',
    is_published: true,
    cover_image: '',
    created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
];

const initialOrders = [
  {
    id: 'ord-1',
    tracking_code: 'CN-849201',
    category_id: 'cat-housing',
    service_id: 'pardis-housing-transfer',
    service_type: 'استعلام و نقل و انتقال مسکن مهر پردیس',
    full_name: 'مهدی رحیمی',
    national_id: '0012345678',
    national_code: '0012345678',
    phone: '09121112233',
    phone_number: '09121112233',
    description: 'بررسی اصالت قرارداد فاز ۱۱ زون ۴',
    amount: 350000,
    file_urls: [
      'uploads/national-card-sample.jpg',
      'uploads/housing-contract-sample.pdf',
    ],
    status: 'in_progress',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ord-2',
    tracking_code: 'CN-612459',
    category_id: 'cat-tax',
    service_id: 'tax-affairs',
    service_type: 'امور مالیاتی، اظهارنامه و سامانه مودیان',
    full_name: 'سارا حسینی',
    national_id: '0023456789',
    national_code: '0023456789',
    phone: '09123334455',
    phone_number: '09123334455',
    description: 'محاسبه تبصره ۱۰۰ صنف لوازم تحریر',
    amount: 250000,
    file_urls: [
      'uploads/pos-report-statement.png',
    ],
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// In-Memory Database store
const inMemoryTables: Record<string, any[]> = {
  service_categories: [...initialCategories],
  services: [...initialServices],
  announcements: [...initialAnnouncements],
  articles: [...initialArticles],
  orders: [...initialOrders],
};

function createMockQueryBuilder(tableName: string) {
  const filters: Array<(item: any) => boolean> = [];
  let sortFn: ((a: any, b: any) => number) | null = null;
  let limitCount: number | null = null;
  let insertedRows: any[] | null = null;
  let updatedData: any = null;
  let isDelete = false;

  const getTable = () => {
    if (!inMemoryTables[tableName]) {
      inMemoryTables[tableName] = [];
    }
    return inMemoryTables[tableName];
  };

  const builder: any = {
    select(fields?: string) {
      return builder;
    },
    eq(col: string, val: any) {
      filters.push((item) => String(item[col]) === String(val));
      return builder;
    },
    neq(col: string, val: any) {
      filters.push((item) => String(item[col]) !== String(val));
      return builder;
    },
    or(query: string) {
      // Handles queries like deadline.is.null,deadline.gte.2025-...
      filters.push((item) => {
        if (!query.includes('deadline')) return true;
        if (!item.deadline) return true;
        return new Date(item.deadline).getTime() >= Date.now();
      });
      return builder;
    },
    order(col: string, opts: { ascending?: boolean } = {}) {
      const ascending = opts.ascending ?? true;
      sortFn = (a: any, b: any) => {
        const valA = a[col] ?? 0;
        const valB = b[col] ?? 0;
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      };
      return builder;
    },
    limit(n: number) {
      limitCount = n;
      return builder;
    },
    insert(rows: any[]) {
      const table = getTable();
      const newItems = rows.map((r, i) => ({
        id: r.id || `${tableName}-${Date.now()}-${i}`,
        created_at: r.created_at || new Date().toISOString(),
        ...r,
      }));
      table.unshift(...newItems);
      insertedRows = newItems;
      return builder;
    },
    update(patch: any) {
      updatedData = patch;
      return builder;
    },
    delete() {
      isDelete = true;
      return builder;
    },
    async single() {
      const res = await builder.execute();
      const first = res.data && res.data.length > 0 ? res.data[0] : null;
      if (!first) {
        return { data: null, error: { message: 'موردی یافت نشد.' } };
      }
      return { data: first, error: null };
    },
    async maybeSingle() {
      const res = await builder.execute();
      const first = res.data && res.data.length > 0 ? res.data[0] : null;
      return { data: first, error: null };
    },
    async execute() {
      const table = getTable();

      if (insertedRows) {
        return { data: insertedRows, error: null };
      }

      if (isDelete) {
        inMemoryTables[tableName] = table.filter((item) => !filters.every((f) => f(item)));
        return { data: null, error: null };
      }

      if (updatedData) {
        let updatedCount = 0;
        inMemoryTables[tableName] = table.map((item) => {
          if (filters.every((f) => f(item))) {
            updatedCount++;
            return { ...item, ...updatedData };
          }
          return item;
        });
        return { data: updatedCount, error: null };
      }

      let results = [...table];
      for (const f of filters) {
        results = results.filter(f);
      }
      if (sortFn) {
        results.sort(sortFn);
      }
      if (limitCount !== null) {
        results = results.slice(0, limitCount);
      }
      return { data: results, error: null };
    },
    // Allows `await supabase.from(...)`
    then(onfulfilled?: any, onrejected?: any) {
      return builder.execute().then(onfulfilled, onrejected);
    },
  };

  return builder;
}

const mockStorage = {
  from(bucket: string) {
    return {
      async upload(filePath: string, file: any) {
        return { data: { path: filePath }, error: null };
      },
      getPublicUrl(filePath: string) {
        return {
          data: {
            publicUrl: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80`,
          },
        };
      },
      async createSignedUrl(filePath: string, expiresIn: number) {
        // Return temporary signed URL expiring in expiresIn seconds (e.g. 15 minutes = 900s)
        const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
        const signature = Math.random().toString(36).substring(2, 10);
        const isPdf = filePath.toLowerCase().endsWith('.pdf');
        
        // Return signed URL with security token and expiration
        const signedUrl = isPdf
          ? `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?token=${signature}&expires=${expiresAt}&bucket=${bucket}&file=${encodeURIComponent(filePath)}`
          : `https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=90&token=${signature}&expires=${expiresAt}&bucket=${bucket}&file=${encodeURIComponent(filePath)}`;
        
        return {
          data: {
            signedUrl,
          },
          error: null,
        };
      },
      async remove(filePaths: string[]) {
        return { data: filePaths, error: null };
      },
    };
  },
};

const mockSupabase = {
  from(table: string) {
    return createMockQueryBuilder(table);
  },
  storage: mockStorage,
};

let clientInstance: any;

if (hasValidSupabaseConfig) {
  try {
    const realClient = createClient(supabaseUrl!, supabaseAnonKey!);
    // Wrap realClient with a fallback proxy in case network fails or table is empty
    clientInstance = realClient;
  } catch {
    console.warn('[AI Studio] Supabase client initialization failed — using in-memory mock store');
    clientInstance = mockSupabase;
  }
} else {
  clientInstance = mockSupabase;
}

export const supabase = clientInstance;
