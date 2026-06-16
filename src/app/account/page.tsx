import Link from 'next/link'
import { cn } from '@/lib/utils'

// MOCK data matching backend details
const MOCK = {
  name: 'Ravi Nayak',
  subscription: '1 Litre/day',
  status: 'Active',
  creditPaise: 24801,
  nextBillPaise: 239799,
  billingMonth: 'July 2026',
  dueDate: 'July 30, 2026',
  skipsThisMonth: 3,
  recentActivity: [
    { type: 'skip', label: 'Skipped June 15', sub: '+₹82.67 credit credited', color: 'text-red-500', bg: 'bg-red-50', icon: '⏭️' },
    { type: 'delivery', label: 'Delivered June 14', sub: '1 Litre — ₹82.67', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { type: 'delivery', label: 'Delivered June 13', sub: '1 Litre — ₹82.67', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { type: 'extra', label: 'Extra order June 12', sub: '+1 Litre — ₹82.67 charged', color: 'text-blue-600', bg: 'bg-blue-50', icon: '➕' },
    { type: 'delivery', label: 'Delivered June 11', sub: '1 Litre — ₹82.67', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
  ],
}

const quickActions = [
  {
    href: '/account/skip',
    icon: '⏭️',
    title: 'Skip Tomorrow',
    sub: `${MOCK.skipsThisMonth} skips this month`,
    warning: 'Before 9 PM tonight',
    accentBg: 'bg-red-50',
    accentText: 'text-red-500',
  },
  {
    href: '/account/pause',
    icon: '🏖️',
    title: 'Vacation Pause',
    sub: 'No pause scheduled',
    warning: null,
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-500',
  },
  {
    href: '/account/extra',
    icon: '➕',
    title: 'Extra Milk',
    sub: 'Order for tomorrow',
    warning: null,
    accentBg: 'bg-green-50',
    accentText: 'text-green-600',
  },
  {
    href: '/account/bills',
    icon: '📊',
    title: 'My Bills',
    sub: `${MOCK.billingMonth} due ${MOCK.dueDate}`,
    warning: null,
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-600',
  },
]

export default function AccountDashboard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  })

  const hour = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false })
  const greeting = parseInt(hour) < 12 ? 'Good Morning' : parseInt(hour) < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-[#0f2e5c] mb-1 font-playfair" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          {greeting}, {MOCK.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-slate-500 font-semibold">{today}</p>
      </div>

      {/* Subscription overview card (Glossy Premium Brand Color Gradient) */}
      <div className="rounded-[24px] p-8 mb-8 text-white relative overflow-hidden shadow-[0_8px_30px_rgba(15,46,92,0.08)] border border-white/10" style={{ background: 'linear-gradient(135deg, #0f2e5c 0%, #0066cc 100%)' }}>
        
        {/* Soft Background Blurs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-1">Active Subscription</p>
            <p className="text-xl font-bold text-white font-playfair" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {MOCK.subscription} · {MOCK.billingMonth}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-white/60 font-bold mb-1">Credit Balance</p>
            <p className="text-3xl font-black text-green-400 font-mono tracking-tight">
              ₹{(MOCK.creditPaise / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs text-white/60 font-bold mb-1">{MOCK.billingMonth} Bill Amount</p>
            <p className="text-xl font-black text-white font-mono">
              ₹{(MOCK.nextBillPaise / 100).toFixed(2)}
            </p>
          </div>
          
          {/* Action button in modern 3D rounded style */}
          <Link
            href="/account/bills"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '42px',
              padding: '0 24px',
              borderRadius: '12px',
              background: 'linear-gradient(to bottom, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.15), 0 4px 12px rgba(29, 78, 216, 0.2)',
              border: '1px solid rgba(29, 78, 216, 0.15)',
              transition: 'transform 0.2s'
            }}
            className="hover:scale-105 active:scale-[0.98]"
          >
            Pay Bill →
          </Link>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            style={{ borderColor: 'rgba(236, 216, 176, 0.6)' }}
            className={cn(
              'bg-white rounded-[20px] p-6 border shadow-[0_4px_20px_rgba(15,46,92,0.02)]',
              'flex items-center gap-4',
              'transition-all duration-300 hover:shadow-[0_8px_30px_rgba(15,46,92,0.06)] hover:-translate-y-[2px]',
              'group'
            )}
          >
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0', action.accentBg)}>
              <span role="img" aria-label={action.title}>{action.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-[#0f2e5c]">{action.title}</p>
              <p className={cn('text-xs font-semibold mt-0.5', action.accentText)}>{action.sub}</p>
              {action.warning && (
                <p className="text-xs text-orange-500 font-bold mt-1">⏰ {action.warning}</p>
              )}
            </div>
            <span className="text-[#0f2e5c]/30 text-xl font-bold group-hover:text-[#0066cc] group-hover:translate-x-1 transition-all" aria-hidden="true">›</span>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-[20px] border border-[#ECD8B0]/50 shadow-[0_4px_20px_rgba(15,46,92,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#ECD8B0]/30 bg-slate-50/50">
          <h2 className="text-base font-bold text-[#0f2e5c]">Recent Delivery Log</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK.recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4.5 hover:bg-slate-50/30 transition-colors">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', activity.bg)}>
                <span className="text-base" role="img" aria-label={activity.type}>{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0f2e5c]">{activity.label}</p>
                <p className={cn('text-xs font-semibold', activity.color)}>{activity.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
