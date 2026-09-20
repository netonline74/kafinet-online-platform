export interface FaqItem {
  question: string;
  answer: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface DocItem {
  title: string;
  required: boolean;
}

export interface PricingItem {
  title: string;
  price: string;
  duration: string;
}

export interface ServiceLandingData {
  title: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  coverImage?: string;
  orderUrl: string; // لینکی که به فرم ویزارد می‌رود
  documents: DocItem[];
  steps: StepItem[];
  pricing: PricingItem[];
  faqs: FaqItem[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}