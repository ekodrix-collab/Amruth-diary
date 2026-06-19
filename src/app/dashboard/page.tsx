'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, SkipForward, Palmtree, PlusCircle, FileText, Calendar, Compass, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, Clock, Milk } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DashboardData {
  success: boolean;
  profile: {
    full_name: string;
    phone: string;
    address: string;
  };
  subscription: {
    id: string;
    status: string;
    quantity_litres: number;
    monthly_amount: number;
    daily_rate: number;
    start_date: string;
    balance: number;
  } | null;
  waitlist?: {
    id: string;
    quantity_litres: number;
    requested_start_date: string;
    position: number;
    status: string;
    created_at: string;
  } | null;
  current_month: {
    billing_month: string;
    days_delivered: number;
    days_skipped: number;
    days_paused: number;
    extra_litres_ordered: number;
    skip_credit: number;
    pause_credit: number;
    extra_charges: number;
    carry_in_balance: number;
    net_due: number;
    amount_paid: number;
  } | null;
  upcoming_skips: Array<{ skip_date: string; credit_amount: number }>;
  active_vacation: { pause_start: string; pause_end: string; total_credit: number } | null;
  next_month_change: { quantity: number; amount: number } | null;
  recent_deliveries: Array<{ delivery_date: string; total_litres: number; delivery_status: string }>;
}

export default function CustomerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/customer/dashboard')
        const json = await res.json()
        if (json.success) {
          setData(json)
        } else {
          setError(json.message || 'Failed to retrieve dashboard data')
        }
      } catch (err) {
        setError('Network error loading dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-cream-200 rounded-xl" />
          <div className="h-4 w-32 bg-cream-200 rounded-lg" />
        </div>
        {/* Card Skeleton */}
        <div className="h-48 bg-cream-200 rounded-3xl" />
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto text-center py-12 bg-warm-white border border-border/80 rounded-3xl p-8 shadow-shadow shadow-md">
        <AlertTriangle className="text-amber-500 mx-auto mb-4" size={40} />
        <h3 className="text-lg font-black text-brown-800">Dashboard Unavailable</h3>
        <p className="text-xs font-semibold text-brown-600 mt-2 mb-6">{error || 'Failed to load details.'}</p>
        <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center px-5 h-10 bg-amber-400 text-brown-800 font-extrabold rounded-xl text-xs shadow-sm hover:bg-amber-500 border-none cursor-pointer">
          Retry Loading
        </button>
      </div>
    )
  }

  if (data.waitlist) {
    const wl = data.waitlist
    const requestedPlan = wl.quantity_litres === 0.5 ? '½ L' : `${wl.quantity_litres} L`
    const formattedStartDate = new Date(wl.requested_start_date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
    
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brown-800 font-display tracking-tight mb-1 flex items-center gap-2">
            Waitlist Status <Clock size={24} className="text-amber-500 animate-pulse" />
          </h1>
          <p className="text-xs font-semibold text-brown-600">You are currently in queue for a delivery slot.</p>
        </div>

        {/* Waitlist Position Card */}
        <div className="rounded-[28px] p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_16px_40px_rgba(217,119,6,0.12)] border border-amber-500/20 bg-gradient-to-br from-[#78350f] to-[#b45309]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-amber-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-200 mb-4 border border-amber-400/20 backdrop-blur-md">
                <Milk size={10} />
                <span>{requestedPlan} Daily Plan</span>
              </span>
              <p className="text-xl sm:text-2xl font-black text-white font-display leading-tight mb-1">
                Amruth Milk Waitlist
              </p>
              <p className="text-xs text-amber-100/70 font-semibold">
                Requested Start Date: {formattedStartDate}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[10px] text-amber-100/60 uppercase tracking-widest font-black mb-1">Queue Position</p>
              <p className="text-4xl font-black font-mono tracking-tight leading-none text-amber-300">
                #{wl.position}
              </p>
              <p className="text-[9px] text-amber-100/50 font-bold mt-1">Updates dynamically as slots clear</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-warm-white border border-border/80 rounded-2xl p-5 shadow-shadow shadow-sm space-y-4 text-xs font-semibold text-brown-600 leading-relaxed">
          <h3 className="text-sm font-black text-brown-800 flex items-center gap-2">
            <HelpCircle size={14} className="text-amber-500" /> How the Waitlist Works
          </h3>
          <p>
            At Amruth Dairy Farm, we limit our daily production to ensure every drop of milk is fresh, raw, and delivered directly within hours of milking. We never compromise on quality or blend with third-party sources.
          </p>
          <p>
            Due to high demand, all local delivery zones are operating at full capacity. We review active orders every morning. As soon as a spot opens up in your delivery zone, your queue status will update and your subscription will automatically activate!
          </p>
          <p>
            No payment has been charged yet. First payment will be triggered once your slot is confirmed.
          </p>
          <div className="pt-2 border-t border-border/40 flex justify-between items-center text-[10px] text-brown-400">
            <span>Registered: {new Date(wl.created_at).toLocaleDateString('en-IN')}</span>
            <span>Status: <strong className="text-amber-600 uppercase font-black">{wl.status}</strong></span>
          </div>
        </div>

        {/* Support contacts */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex justify-between items-center gap-4 text-xs">
          <div>
            <p className="font-black text-brown-800">Need help or want to cancel?</p>
            <p className="text-[10px] font-semibold text-brown-500 mt-0.5">Reach our delivery support line anytime.</p>
          </div>
          <a href="tel:+919876543210" className="inline-flex items-center justify-center px-4 h-9 bg-warm-white border border-border text-brown-800 font-extrabold rounded-lg hover:bg-cream-50 transition-all text-xs cursor-pointer decoration-none">
            Call Support
          </a>
        </div>
      </div>
    )
  }

  if (!data.subscription) {
    return (
      <div className="max-w-md mx-auto text-center py-12 bg-warm-white border border-border/80 rounded-3xl p-8 shadow-shadow shadow-md">
        <AlertTriangle className="text-amber-500 mx-auto mb-4" size={40} />
        <h3 className="text-lg font-black text-brown-800">Subscription Missing</h3>
        <p className="text-xs font-semibold text-brown-600 mt-2 mb-6">You don&apos;t have an active milk subscription yet.</p>
        <Link href="/onboarding" className="inline-flex items-center justify-center px-6 h-11 bg-amber-400 text-brown-800 font-extrabold rounded-xl text-xs shadow-sm hover:bg-amber-500 transition-all border-none">
          Complete Onboarding
        </Link>
      </div>
    )
  }

  const { subscription, current_month, recent_deliveries, upcoming_skips, active_vacation, profile } = data

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Determine greeting based on local time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  // Determine balance text (positive = credit, negative = due)
  const balanceVal = subscription.balance || 0
  const balanceText = balanceVal >= 0 
    ? `₹${balanceVal.toFixed(2)} Credit` 
    : `₹${Math.abs(balanceVal).toFixed(2)} Due`

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Welcome Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brown-800 font-display tracking-tight mb-1">
            {greeting}, {profile.full_name.split(' ')[0]}!
          </h1>
          <p className="text-xs font-semibold text-brown-600 flex items-center gap-1.5">
            <Calendar size={13} className="text-amber-600" />
            <span>{todayStr}</span>
          </p>
        </div>
      </div>

      {/* Subscription Card - Creamy Deep Green visual */}
      <div className="rounded-[28px] p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_16px_40px_rgba(26,58,42,0.18)] border border-white/5 bg-gradient-to-br from-[#1a3a2a] to-[#27533f]">
        
        {/* Soft Background floating milk drops */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-400/[0.04] rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-cream-100 mb-4 border border-white/10 backdrop-blur-md">
              <Milk size={10} />
              <span>{subscription.quantity_litres} Litre Daily Plan</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-display leading-tight mb-1">
              Amruth Farm Milk
            </p>
            <p className="text-xs text-cream-100/70 font-semibold">
              Delivered fresh before 7:00 AM every morning
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] text-cream-100/60 uppercase tracking-widest font-black mb-1">Account Balance</p>
            <p className={cn(
              "text-3xl font-black font-mono tracking-tight leading-none",
              balanceVal >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {balanceText}
            </p>
            <p className="text-[9px] text-cream-100/50 font-bold mt-1">Carried forward to next bill</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] text-cream-100/50 font-bold mb-0.5">Monthly Cost</p>
              <p className="text-sm font-black font-mono">₹{subscription.monthly_amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-cream-100/50 font-bold mb-0.5">Daily rate</p>
              <p className="text-sm font-black font-mono">₹{subscription.daily_rate.toFixed(2)}</p>
            </div>
          </div>

          <Link
            href="/dashboard/bills"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-extrabold text-xs shadow-md border-none cursor-pointer transition-all gap-1.5 self-start sm:self-auto"
          >
            <span>View Statements</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <Link href="/dashboard/skip" className="bg-warm-white border border-border/80 p-5 rounded-2xl shadow-shadow shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group flex flex-col justify-between h-32">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <SkipForward size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-brown-800 leading-tight mb-0.5">Skip Day</p>
              <p className="text-[10px] font-semibold text-red-400">Before 9:00 PM</p>
            </div>
          </Link>

          <Link href="/dashboard/vacation" className="bg-warm-white border border-border/80 p-5 rounded-2xl shadow-shadow shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group flex flex-col justify-between h-32">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Palmtree size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-brown-800 leading-tight mb-0.5">Vacation Pause</p>
              <p className="text-[10px] font-semibold text-blue-400">Multi-day pause</p>
            </div>
          </Link>

          <Link href="/dashboard/extra" className="bg-warm-white border border-border/80 p-5 rounded-2xl shadow-shadow shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group flex flex-col justify-between h-32">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <PlusCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-brown-800 leading-tight mb-0.5">Extra Milk</p>
              <p className="text-[10px] font-semibold text-green-500">Order for tomorrow</p>
            </div>
          </Link>

          <Link href="/dashboard/bills" className="bg-warm-white border border-border/80 p-5 rounded-2xl shadow-shadow shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group flex flex-col justify-between h-32">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-brown-800 leading-tight mb-0.5">My Bills</p>
              <p className="text-[10px] font-semibold text-amber-600">Monthly invoice</p>
            </div>
          </Link>

        </div>
      </div>

      {/* Two Column details row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column - Live Bill Calculator (3/5) */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Live Billing Calculator</h3>
          <div className="bg-warm-white border border-border/80 rounded-2xl p-5 shadow-shadow shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs text-brown-600 font-semibold pb-2.5 border-b border-border/40">
              <span>Base Plan amount:</span>
              <span className="font-bold text-brown-800">₹{subscription.monthly_amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-brown-600 font-semibold pb-2.5 border-b border-border/40">
              <span className="flex items-center gap-1.5">
                <span>Skips Credit:</span>
                <span className="bg-cream-100 text-brown-600 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">{current_month?.days_skipped || 0} days</span>
              </span>
              <span className="font-bold text-green-600">-₹{(current_month?.skip_credit || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-brown-600 font-semibold pb-2.5 border-b border-border/40">
              <span className="flex items-center gap-1.5">
                <span>Vacation Credit:</span>
                <span className="bg-cream-100 text-brown-600 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">{current_month?.days_paused || 0} days</span>
              </span>
              <span className="font-bold text-green-600">-₹{(current_month?.pause_credit || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-brown-600 font-semibold pb-2.5 border-b border-border/40">
              <span className="flex items-center gap-1.5">
                <span>Extra Milk Charges:</span>
                <span className="bg-cream-100 text-brown-600 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">+{current_month?.extra_litres_ordered || 0}L</span>
              </span>
              <span className="font-bold text-amber-600">+₹{(current_month?.extra_charges || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-brown-600 font-semibold pb-2.5 border-b border-border/40">
              <span>Carry In balance (Previous month):</span>
              <span className={cn("font-bold", (current_month?.carry_in_balance || 0) >= 0 ? "text-green-600" : "text-red-500")}>
                {((current_month?.carry_in_balance || 0) >= 0 ? '-' : '+')}₹{Math.abs(current_month?.carry_in_balance || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 text-sm font-black text-brown-800">
              <span>Net Due for payment:</span>
              <span className="text-amber-600 font-mono text-base">₹{(current_month?.net_due || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Deliveries (2/5) */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Recent Delivery Log</h3>
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm overflow-hidden divide-y divide-border/40">
            {recent_deliveries.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-brown-400">
                No deliveries recorded in the last 7 days.
              </div>
            ) : (
              recent_deliveries.slice(0, 5).map((delivery, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-cream-50/20 transition-all">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-brown-800 leading-tight">
                      {new Date(delivery.delivery_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}
                    </p>
                    <p className="text-[10px] text-brown-400 font-semibold mt-0.5">
                      {delivery.total_litres} Litres Delivered
                    </p>
                  </div>
                  <div>
                    {delivery.delivery_status === 'delivered' && (
                      <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        Delivered
                      </span>
                    )}
                    {delivery.delivery_status === 'skipped' && (
                      <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        Skipped
                      </span>
                    )}
                    {delivery.delivery_status === 'paused' && (
                      <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Vacation
                      </span>
                    )}
                    {delivery.delivery_status === 'pending' && (
                      <span className="text-[9px] font-black uppercase text-brown-400 bg-cream-50 px-2 py-0.5 rounded-full border border-border">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
