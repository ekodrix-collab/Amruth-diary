type StatusType = 
  | 'success' // Active, Completed, Paid, Delivered
  | 'warning' // Pending, Low Stock, Due
  | 'danger'  // Inactive, Cancelled, Out of Stock, Failed
  | 'info'    // Draft, Vacation, Processing
  | 'default' // Default grey

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
}

export function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  
  // Auto-map common statuses if type isn't explicitly provided
  let determinedType = type;
  if (type === 'default') {
    const s = status.toLowerCase();
    if (['active', 'completed', 'paid', 'delivered', 'optimal', 'ready'].includes(s)) determinedType = 'success';
    else if (['pending', 'low stock', 'due', 'generating', 'waitlist'].includes(s)) determinedType = 'warning';
    else if (['inactive', 'cancelled', 'out of stock', 'failed', 'dropped'].includes(s)) determinedType = 'danger';
    else if (['draft', 'vacation', 'processing', 'scheduled'].includes(s)) determinedType = 'info';
  }

  const styles = {
    success: 'bg-green-50 text-green-600 border border-green-100',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100',
    danger: 'bg-red-50 text-red-600 border border-red-100',
    info: 'bg-blue-50 text-[#0066cc] border border-blue-100',
    default: 'bg-slate-50 text-slate-600 border border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[determinedType]}`}>
      {status}
    </span>
  );
}
