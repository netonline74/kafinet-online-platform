import React from 'react';
import { OrderStatus } from '@/types/order';

interface Props {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'در انتظار بررسی',
    className: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  in_progress: {
    label: 'در حال انجام',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  completed: {
    label: 'تکمیل شده',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  cancelled: {
    label: 'لغو شده',
    className: 'bg-rose-100 text-rose-800 border-rose-300',
  },
};

export const OrderStatusBadge: React.FC<Props> = ({ status }) => {
  const current = statusConfig[status] || statusConfig.pending;

  return (
    <span className={"inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border " + current.className}>
      {current.label}
    </span>
  );
};