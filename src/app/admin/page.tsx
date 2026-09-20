'use client';

import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/actions/orders';
import { getAllArticles, createArticleAction } from '@/actions/articles';
import { getCategories, getAllServicesAdmin, createCategoryAction, createServiceAction } from '@/actions/services';
import { createAnnouncementAction, getActiveAnnouncements, updateAnnouncementAction, deleteAnnouncementAction } from '@/actions/announcements';
import { OrderItem, OrderStatus } from '@/types/order';
import { Article } from '@/types/article';
import { ServiceCategory, Service } from '@/types/service';
import { formatToman } from '@/lib/utils';
import { RefreshCw, FileText, LayoutDashboard, Plus, Loader2, Layers, FolderPlus, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'articles' | 'services' | 'announcements'>('orders');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-medium">کد رهگیری</th>
                  <th className="p-4 font-medium">مشتری</th>
                  <th className="p-4 font-medium">نوع خدمت</th>
                  <th className="p-4 font-medium text-center">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-slate-700">{order.tracking_code}</td>
                    <td className="p-4"><p className="font-medium text-slate-800">{order.full_name}</p><p className="text-xs text-slate-500 font-mono mt-0.5">{order.phone}</p></td>
                    <td className="p-4 text-slate-700">{order.service_type}</td>
                    <td className="p-4 text-center">
                      <select value={order.status} onChange={(e) => handleStatusChange(order.id as string, e.target.value as OrderStatus)} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="pending">بررسی</option><option value="in_progress">در حال انجام</option><option value="completed">تکمیل</option><option value="cancelled">لغو</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}