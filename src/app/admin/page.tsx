'use client';

import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, getOrderDocumentSignedUrlAction } from '@/actions/orders';
import { getAllArticles, createArticleAction } from '@/actions/articles';
import { getCategories, getAllServicesAdmin, createCategoryAction, createServiceAction } from '@/actions/services';
import { createAnnouncementAction, getActiveAnnouncements, updateAnnouncementAction, deleteAnnouncementAction } from '@/actions/announcements';
import { OrderItem, OrderStatus } from '@/types/order';
import { Article } from '@/types/article';
import { ServiceCategory, Service } from '@/types/service';
import { formatToman, formatPersianDate } from '@/lib/utils';
import { 
  RefreshCw, 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Loader2, 
  Layers, 
  FolderPlus, 
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Phone,
  Calendar,
  Wallet,
  Inbox,
  ShieldCheck,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Image as ImageIcon,
  FileType,
  X,
  AlertCircle,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'articles' | 'services' | 'announcements'>('orders');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // State های اسناد امن با Signed URLs
  const [selectedOrderForDocs, setSelectedOrderForDocs] = useState<OrderItem | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, { url: string; expiresAt: string }>>({});
  const [generatingUrlFor, setGeneratingUrlFor] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // State های داده‌ها
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // State های فرم‌ها
  const [articleForm, setArticleForm] = useState({ title: '', slug: '', excerpt: '' });
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  
  const [categoryForm, setCategoryForm] = useState({ id: '', title: '', description: '', icon_name: 'FileText', display_order: 1 });
  const [serviceForm, setServiceForm] = useState({ id: '', category_id: '', title: '', description: '', docs: '', base_price: 0, display_order: 1 });
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  // State های تابلو اعلانات
  const [announcementForm, setAnnouncementForm] = useState({ title: '', description: '', category: 'خودرو', urgency_level: 'normal', deadline: '', action_link: '' });
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  const fetchData = async () => {
    setRefreshing(true);
    const [ordersRes, articlesRes, catRes, srvRes, annRes] = await Promise.all([
      getAllOrders(), getAllArticles(), getCategories(), getAllServicesAdmin(), getActiveAnnouncements()
    ]);
    if (ordersRes.success) setOrders(ordersRes.orders || []);
    if (articlesRes.success) setArticles(articlesRes.articles || []);
    if (catRes.success) setCategories(catRes.categories || []);
    if (srvRes.success) setServices(srvRes.services || []);
    if (annRes.success) setAnnouncements(annRes.announcements || []);
    
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchData(); }, []);

  // هندلرهای پایه‌ای
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    else alert('خطا در بروزرسانی وضعیت');
  };

  // هندلرهای اسناد امن با لینک امضاشده موقت (Signed URLs - 15 دقیقه)
  const handleOpenDocsModal = (order: OrderItem) => {
    setSelectedOrderForDocs(order);
  };

  const handleGenerateSignedUrl = async (filePath: string) => {
    setGeneratingUrlFor(filePath);
    try {
      // استفاده از createSignedUrl در باکت order-documents با انقضای ۱۵ دقیقه (۹۰۰ ثانیه)
      const res = await getOrderDocumentSignedUrlAction(filePath, 900);
      if (res.success && res.signedUrl) {
        setSignedUrls((prev) => ({
          ...prev,
          [filePath]: {
            url: res.signedUrl,
            expiresAt: res.expiresAt || new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('fa-IR'),
          },
        }));
      } else {
        alert('خطا در صدور لینک امن: ' + (res.error || 'فایل در باکت order-documents یافت نشد'));
      }
    } catch (err: any) {
      alert('خطا در ارتباط با سرور: ' + err.message);
    } finally {
      setGeneratingUrlFor(null);
    }
  };

  const handleGenerateAllSignedUrls = async (filePaths: string[]) => {
    for (const path of filePaths) {
      if (!signedUrls[path]) {
        await handleGenerateSignedUrl(path);
      }
    }
  };

  const handleCopyUrl = async (url: string, pathKey: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPath(pathKey);
      setTimeout(() => setCopiedPath(null), 2500);
    } catch {
      // fallback
    }
  };

  // هندلرهای تابلو اعلانات
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAnnouncement(true);
    
    const payload = {
      title: announcementForm.title,
      description: announcementForm.description,
      category: announcementForm.category,
      urgency_level: announcementForm.urgency_level,
      deadline: announcementForm.deadline ? new Date(announcementForm.deadline).toISOString() : null,
      action_link: announcementForm.action_link
    };

    const res = editingAnnId 
      ? await updateAnnouncementAction(editingAnnId, payload)
      : await createAnnouncementAction(payload);

    if (res.success) {
      setAnnouncementForm({ title: '', description: '', category: 'خودرو', urgency_level: 'normal', deadline: '', action_link: '' });
      setEditingAnnId(null);
      fetchData(); 
      alert(editingAnnId ? 'ویرایش موفقیت‌آمیز بود' : 'اطلاعیه با موفقیت ثبت شد');
    } else alert('خطا: ' + res.error);
    
    setIsSubmittingAnnouncement(false);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('آیا از حذف این اطلاعیه مطمئن هستید؟')) return;
    const res = await deleteAnnouncementAction(id);
    if (res.success) fetchData();
    else alert('خطا در حذف اطلاعیه: ' + res.error);
  };

  const handleEditClick = (ann: any) => {
    setEditingAnnId(ann.id);
    setAnnouncementForm({
      title: ann.title,
      description: ann.description || '',
      category: ann.category,
      urgency_level: ann.urgency_level,
      deadline: ann.deadline ? new Date(ann.deadline).toISOString().slice(0, 16) : '',
      action_link: ann.action_link || ''
    });
    // اسکرول به بالای فرم
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200/80 gap-1.5 py-1 px-2.5 font-medium text-xs">
            <Clock className="size-3 text-amber-500" />
            <span>در انتظار بررسی</span>
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200/80 gap-1.5 py-1 px-2.5 font-medium text-xs">
            <RefreshCw className="size-3 text-blue-500" />
            <span>در حال انجام</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200/80 gap-1.5 py-1 px-2.5 font-medium text-xs">
            <CheckCircle2 className="size-3 text-emerald-500" />
            <span>تکمیل شده</span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="gap-1.5 py-1 px-2.5 font-medium text-xs">
            <XCircle className="size-3" />
            <span>لغو شده</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* هدر و تب‌ها */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-slate-800">پنل مدیریت یکپارچه</h1>
            <button onClick={fetchData} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> <span className="text-sm">بروزرسانی</span>
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 border-b border-slate-100 pb-0 scrollbar-hide">
            <button onClick={() => setActiveTab('orders')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <LayoutDashboard size={18} /> سفارشات
            </button>
            <button onClick={() => setActiveTab('services')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <Layers size={18} /> خدمات
            </button>
            <button onClick={() => setActiveTab('announcements')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'announcements' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <Bell size={18} /> تابلو اعلانات
            </button>
          </div>
        </div>

        {/* --- تب سفارشات --- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">لیست و مدیریت سفارش‌ها</h2>
                <p className="text-xs text-slate-500 mt-1">
                  مجموع {orders.length} پرونده ثبت شده در سامانه
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>بروزرسانی زنده</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full text-right">
                <TableHeader className="bg-slate-50/70 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="p-4 font-bold text-slate-700 text-right">کد رهگیری</TableHead>
                    <TableHead className="p-4 font-bold text-slate-700 text-right">اطلاعات مشتری</TableHead>
                    <TableHead className="p-4 font-bold text-slate-700 text-right">نوع خدمت و هزینه</TableHead>
                    <TableHead className="p-4 font-bold text-slate-700 text-center">مدارک پیوست (امن)</TableHead>
                    <TableHead className="p-4 font-bold text-slate-700 text-right">تاریخ ثبت</TableHead>
                    <TableHead className="p-4 font-bold text-slate-700 text-center">وضعیت فعلی</TableHead>
                    <TableHead className="p-4 font-bold text-slate-700 text-left">تغییر وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50/60 transition-colors">
                        <TableCell className="p-4 font-mono font-bold text-slate-800">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 font-mono">
                            {order.tracking_code}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="font-bold text-slate-800 text-sm">{order.full_name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1" dir="ltr">
                            <Phone className="size-3 text-slate-400" />
                            <span>{order.phone}</span>
                          </p>
                        </TableCell>
                        <TableCell className="p-4">
                          <p className="text-slate-800 font-medium text-sm">{order.service_type}</p>
                          {order.amount > 0 && (
                            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                              {formatToman(order.amount)}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="p-4 text-center">
                          {order.file_urls && order.file_urls.length > 0 ? (
                            <button
                              onClick={() => handleOpenDocsModal(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-sm"
                              title="مشاهده مدارک با لینک موقت امضاشده ۱۵ دقیقه‌ای"
                            >
                              <ShieldCheck className="size-3.5 text-blue-600" />
                              <span>{order.file_urls.length} مدرک</span>
                              <Lock className="size-3 text-amber-600" />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">بدون مدرک</span>
                          )}
                        </TableCell>
                        <TableCell className="p-4 text-xs text-slate-500 whitespace-nowrap">
                          {order.created_at ? formatPersianDate(order.created_at) : '—'}
                        </TableCell>
                        <TableCell className="p-4 text-center">
                          {renderOrderStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="p-4 text-left">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id as string, e.target.value as OrderStatus)}
                            className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
                          >
                            <option value="pending">در انتظار بررسی</option>
                            <option value="in_progress">در حال انجام</option>
                            <option value="completed">تکمیل شده</option>
                            <option value="cancelled">لغو شده</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                        <Inbox className="size-8 mx-auto text-slate-300" />
                        <p className="text-sm font-medium">هنوز هیچ سفارشی ثبت نشده است.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* --- تب مدیریت خدمات --- */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
             بخش مدیریت خدمات (فعال است)
          </div>
        )}

        {/* --- تب تابلو اعلانات --- */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* فرم ثبت / ویرایش */}
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm shadow-rose-50 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Bell size={20} className="text-rose-500" /> {editingAnnId ? 'ویرایش اطلاعیه' : 'ثبت اطلاعیه جدید'}
                </h2>
                {editingAnnId && (
                  <button 
                    onClick={() => { setEditingAnnId(null); setAnnouncementForm({ title: '', description: '', category: 'خودرو', urgency_level: 'normal', deadline: '', action_link: '' }); }} 
                    className="text-xs font-bold text-slate-500 hover:text-rose-500 bg-slate-100 px-3 py-1.5 rounded-lg"
                  >
                    لغو ویرایش
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">عنوان اطلاعیه <span className="text-rose-500">*</span></label>
                  <input required type="text" value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500" placeholder="مثال: ثبت نام سایپا" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">توضیح یک خطی (اختیاری)</label>
                  <input type="text" value={announcementForm.description} onChange={e => setAnnouncementForm({...announcementForm, description: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500" placeholder="مثال: ویژه مادران دارای دو فرزند" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">دسته‌بندی</label>
                    <select value={announcementForm.category} onChange={e => setAnnouncementForm({...announcementForm, category: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500">
                      <option value="خودرو">خودرو</option><option value="مالیات">مالیات</option><option value="آموزش">آموزش</option><option value="مسکن">مسکن</option><option value="حمایتی">حمایتی</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">سطح فوریت</label>
                    <select value={announcementForm.urgency_level} onChange={e => setAnnouncementForm({...announcementForm, urgency_level: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500">
                      <option value="normal">عادی</option><option value="warning">مهم (زرد)</option><option value="critical">بسیار فوری (قرمز)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تاریخ پایان مهلت (اختیاری)</label>
                  <input type="datetime-local" value={announcementForm.deadline} onChange={e => setAnnouncementForm({...announcementForm, deadline: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500" dir="ltr" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">لینک اقدام (اختیاری)</label>
                  <input type="text" value={announcementForm.action_link} onChange={e => setAnnouncementForm({...announcementForm, action_link: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none text-left" dir="ltr" placeholder="/order/new" />
                </div>

                <button type="submit" disabled={isSubmittingAnnouncement} className="w-full mt-2 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors disabled:opacity-70">
                  {isSubmittingAnnouncement ? 'در حال پردازش...' : (editingAnnId ? 'ذخیره تغییرات' : 'انتشار در تابلو اعلانات')}
                </button>
              </form>
            </div>

            {/* لیست اطلاعیه‌ها با امکان حذف و ویرایش */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
              <h3 className="font-bold text-slate-800 mb-4">اطلاعیه‌های فعال در سایت</h3>
              <div className="space-y-3">
                {announcements.length > 0 ? announcements.map(ann => (
                  <div key={ann.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-slate-800 pl-4">{ann.title}</h4>
                      <div className="flex gap-3 shrink-0">
                        <button onClick={() => handleEditClick(ann)} className="text-xs font-bold text-blue-600 hover:text-blue-800">ویرایش</button>
                        <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-xs font-bold text-rose-600 hover:text-rose-800">حذف</button>
                      </div>
                    </div>
                    {ann.description && <p className="text-xs text-slate-500 mb-3">{ann.description}</p>}
                    <div className="flex gap-2">
                      <span className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">{ann.category}</span>
                      {ann.deadline && <span className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">زمان‌دار</span>}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 text-center py-6">هیچ اطلاعیه فعالی وجود ندارد.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* مودال بررسی و صدور لینک‌های امضاشده موقت (Signed URLs) مدارک از باکت order-documents */}
      {selectedOrderForDocs && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-right">
            
            {/* هدر مودال */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    مدارک پیوست پرونده {selectedOrderForDocs.tracking_code}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 pr-10">
                  متقاضی: {selectedOrderForDocs.full_name} | {selectedOrderForDocs.service_type}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForDocs(null)}
                className="size-8 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* بدنه اسناد و کنترل دسترسی */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* پیام راهنمای امنیت لینک‌های امضاشده */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                <Lock className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed space-y-1">
                  <p className="font-bold">
                    حفاظت امن باکت اختصاصی (order-documents) و لینک‌های موقت
                  </p>
                  <p className="text-amber-800/90 font-normal">
                    مدارک کاربران عمومی و قابل جستجو نیستند. دسترسی به فایل‌ها صرفاً با قابلیت 
                    <span className="font-bold font-mono px-1 mx-0.5 bg-amber-100 rounded">createSignedUrl</span> 
                    سوپابیس و با مهلت انقضای ۱۵ دقیقه (۹۰۰ ثانیه) صادر می‌گردد.
                  </p>
                </div>
              </div>

              {/* دکمه تولید گروهی */}
              {selectedOrderForDocs.file_urls && selectedOrderForDocs.file_urls.length > 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGenerateAllSignedUrls(selectedOrderForDocs.file_urls || [])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>صدور لینک موقت برای تمام {selectedOrderForDocs.file_urls.length} مدرک</span>
                  </button>
                </div>
              )}

              {/* لیست فایل‌های مدرک */}
              <div className="space-y-3">
                {selectedOrderForDocs.file_urls && selectedOrderForDocs.file_urls.length > 0 ? (
                  selectedOrderForDocs.file_urls.map((filePath, idx) => {
                    const isPdf = filePath.toLowerCase().endsWith('.pdf');
                    const cleanFileName = filePath.split('/').pop() || `مدرک شماره ${idx + 1}`;
                    const signedInfo = signedUrls[filePath];
                    const isGenerating = generatingUrlFor === filePath;
                    const isCopied = copiedPath === filePath;

                    return (
                      <div 
                        key={filePath + idx} 
                        className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-3 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isPdf ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                              {isPdf ? <FileType className="size-5" /> : <ImageIcon className="size-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 break-all font-mono">
                                {cleanFileName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block text-[11px] font-semibold text-slate-500">
                                  باکت: order-documents
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {isPdf ? 'PDF' : 'تصویر'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* وضعیت امضا */}
                          <div>
                            {signedInfo ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="size-3 text-emerald-600" />
                                <span>لینک موقت فعال</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                <Lock className="size-3 text-slate-400" />
                                <span>محافظت‌شده</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* اکشن‌های صدور و استفاده از Signed URL */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          {signedInfo ? (
                            <div className="flex flex-wrap items-center gap-2 w-full justify-between">
                              <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                                <Clock className="size-3 text-slate-400" />
                                <span>انقضا: ۱۵ دقیقه (تا {signedInfo.expiresAt})</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleCopyUrl(signedInfo.url, filePath)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                                  title="کپی لینک موقت امضاشده"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="size-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">کپی شد!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3.5 text-slate-600" />
                                      <span>کپی لینک</span>
                                    </>
                                  )}
                                </button>

                                <a
                                  href={signedInfo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                                >
                                  <Eye className="size-3.5" />
                                  <span>مشاهده مدرک</span>
                                  <ExternalLink className="size-3 opacity-80" />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs text-slate-400">
                                لینک هنوز صادر نشده است
                              </span>
                              <button
                                onClick={() => handleGenerateSignedUrl(filePath)}
                                disabled={isGenerating}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isGenerating ? (
                                  <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>در حال ساخت لینک امضاشده...</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="size-3.5 text-emerald-400" />
                                    <span>دریافت لینک امن ۱۵ دقیقه‌ای</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-slate-400 py-8">
                    مدرکی برای این سفارش آپلود نشده است.
                  </p>
                )}
              </div>
            </div>

            {/* فوتر مودال */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                🔒 اعتبار هر لینک موقت ۱۵ دقیقه از زمان ایجاد است.
              </span>
              <button
                onClick={() => setSelectedOrderForDocs(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}