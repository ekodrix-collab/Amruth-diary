'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function AccountDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/customer/dashboard')
        const json = await res.json()
        if (json.success) setData(json)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-cream-200 rounded-xl" />
        <div className="h-48 bg-cream-200 rounded-[24px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="h-24 bg-cream-200 rounded-[20px]" />
          <div className="h-24 bg-cream-200 rounded-[20px]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-md text-center py-12 bg-warm-white border border-border/80 rounded-3xl p-8">
        <AlertCircle className="text-amber-500 mx-auto mb-4" size={40} />
        <h3 className="text-lg font-black text-brown-800">Account Unavailable</h3>
        <p className="text-xs font-semibold text-brown-600 mt-2">Failed to load account details.</p>
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  })

  const hour = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false })
  const greeting = parseInt(hour) < 12 ? 'Good Morning' : parseInt(hour) < 17 ? 'Good Afternoon' : 'Good Evening'

  const firstName = data.profile?.full_name?.split(' ')[0] || 'Customer'
  const isSubActive = data.subscription?.status === 'active'
  const subLabel = data.subscription ? `${data.subscription.quantity_litres} L/day` : 'No Active Plan'
  const billingMonth = data.current_month?.billing_month 
    ? new Date(data.current_month.billing_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'This Month'
    
  const creditBalance = data.subscription?.balance || 0
  const nextBill = data.current_month?.net_due || 0

  const skipsThisMonth = data.current_month?.days_skipped || 0

  const quickActions = [
    {
      href: '/dashboard/skip',
      icon: '⏭️',
      title: 'Skip Tomorrow',
      sub: `${skipsThisMonth} skips this month`,
      warning: 'Before 9 PM tonight',
      accentBg: 'bg-red-50',
      accentText: 'text-red-500',
    },
    {
      href: '/dashboard/vacation',
      icon: '🏖️',
      title: 'Vacation Pause',
      sub: data.active_vacation ? 'Pause active' : 'No pause scheduled',
      warning: null,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-500',
    },
    {
      href: '/dashboard/extra',
      icon: '➕',
      title: 'Extra Milk',
      sub: 'Order for tomorrow',
      warning: null,
      accentBg: 'bg-green-50',
      accentText: 'text-green-600',
    },
    {
      href: '/dashboard/bills',
      icon: '📊',
      title: 'My Bills',
      sub: `${billingMonth} statement`,
      warning: nextBill > 0 ? `₹${nextBill.toFixed(0)} due` : null,
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-600',
    },
  ]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-[#0f2e5c] mb-1 font-playfair" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          {greeting}, {firstName}! 👋
        </h1>
        <p className="text-sm text-slate-500 font-semibold">{today}</p>
      </div>

      {/* Subscription overview card */}
      <div className="rounded-[24px] p-8 mb-8 text-white relative overflow-hidden shadow-[0_8px_30px_rgba(15,46,92,0.08)] border border-white/10" style={{ background: 'linear-gradient(135deg, #0f2e5c 0%, #0066cc 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-1">
              {isSubActive ? 'Active Subscription' : 'Subscription Status'}
            </p>
            <p className="text-xl font-bold text-white font-playfair" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {subLabel} · {billingMonth}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-white/60 font-bold mb-1">Credit Balance</p>
            <p className="text-3xl font-black text-green-400 font-mono tracking-tight">
              ₹{creditBalance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs text-white/60 font-bold mb-1">{billingMonth} Bill Amount</p>
            <p className="text-xl font-black text-white font-mono">
              ₹{nextBill.toFixed(2)}
            </p>
          </div>
          
          <Link
            href="/dashboard/bills"
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
          {data.recent_deliveries && data.recent_deliveries.length > 0 ? (
            data.recent_deliveries.map((delivery: any, i: number) => {
              const dateObj = new Date(delivery.delivery_date)
              const dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
              let icon = '✅', bg = 'bg-green-50', color = 'text-green-600', sub = `${delivery.total_litres} Litre delivered`
              
              if (delivery.delivery_status === 'skipped') {
                icon = '⏭️'; bg = 'bg-red-50'; color = 'text-red-500'; sub = 'Skipped'
              } else if (delivery.delivery_status === 'vacation') {
                icon = '🏖️'; bg = 'bg-blue-50'; color = 'text-blue-500'; sub = 'Vacation Pause'
              }

              return (
                <div key={i} className="flex items-center gap-4 px-6 py-4.5 hover:bg-slate-50/30 transition-colors">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
                    <span className="text-base" role="img" aria-label={delivery.delivery_status}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0f2e5c]">{dateStr}</p>
                    <p className={cn('text-xs font-semibold', color)}>{sub}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-6 text-center text-sm font-semibold text-slate-500">
              No recent deliveries to show.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
