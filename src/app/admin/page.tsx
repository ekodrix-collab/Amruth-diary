'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Milk,
  UserCheck,
  Truck,
  Package,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Clock,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminDashboardHome() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }
      setCurrentTime(new Date().toLocaleDateString('en-IN', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch Live Dashboard Stats
  async function fetchStats() {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/dashboard')
      const json = await res.json()
      if (json.success) {
        setDashboardData(json)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard statistics', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-6xl space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-cream-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-cream-200 rounded-2xl" />
          <div className="h-28 bg-cream-200 rounded-2xl" />
          <div className="h-28 bg-cream-200 rounded-2xl" />
          <div className="h-28 bg-cream-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  // Safe variable fallbacks
  const totalDeliveries = dashboardData?.today?.delivering_count || 0
  const totalSkips = (dashboardData?.today?.skipped_count || 0) + (dashboardData?.today?.vacation_count || 0)
  const extraOrders = dashboardData?.today?.extra_orders_count || 0
  const totalMilkLiters = dashboardData?.today?.total_litres_needed || 0
  const totalActiveCustomers = dashboardData?.customers?.total_active || 0
  const capacityUsedPercent = dashboardData?.today?.capacity_used_percent || 0
  const totalCapacityLimit = dashboardData?.today?.total_capacity_limit || 1000

  const stats = [
    {
      icon: <Truck size={22} />,
      label: 'Delivering Today',
      value: `${totalDeliveries} / ${totalActiveCustomers}`,
      subtext: 'Active Subscriptions',
      bgClass: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      icon: <UserCheck size={22} />,
      label: 'Skips & Vacation',
      value: totalSkips.toString(),
      subtext: 'Not delivering today',
      bgClass: 'bg-red-50 text-red-500 border-red-100',
    },
    {
      icon: <Milk size={22} />,
      label: 'Total Litres Needed',
      value: `${totalMilkLiters} L`,
      subtext: `Max capacity: ${totalCapacityLimit}L`,
      bgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      icon: <Package size={22} />,
      label: 'Extra Orders',
      value: extraOrders.toString(),
      subtext: 'One-time additions',
      bgClass: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ]

  // Live regional routing breakdown
  const regionalDemand = dashboardData?.reports?.area_deliveries?.map((d: any) => ({
    area: d.zone,
    orders: d.deliveries,
    litres: d.volume.replace('L', '').trim()
  })) || []

  return (
    <div className="space-y-8 max-w-6xl pb-10">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brown-800 font-display tracking-tight mb-1">
            Morning Operations Desk ☀️
          </h1>
          <p className="text-xs font-semibold text-brown-600 flex items-center gap-1.5">
            <Clock size={13} className="text-amber-500" />
            <span className="font-mono">{currentTime || 'Loading date & time...'}</span>
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="h-10 px-4 rounded-xl border border-border bg-warm-white hover:bg-cream-50 text-brown-600 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Refresh stats</span>
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-warm-white border border-border/80 rounded-2xl p-6 shadow-shadow shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", s.bgClass)}>
                {s.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-brown-800 font-mono tracking-tight leading-none mb-1.5">{s.value}</p>
              <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-[10px] font-semibold text-brown-600">{s.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warning/Alerts Panel */}
      {dashboardData?.alerts?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 shadow-sm">
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-black text-brown-800 uppercase tracking-wider">System Alerts</h4>
            <ul className="text-xs font-semibold text-brown-600 mt-1.5 space-y-1.5 list-disc list-inside">
              {dashboardData.alerts.map((alert: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{alert}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Two Column Layout details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Daily Farm Capacity (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Daily Capacity Limit</h3>
          
          <div className="bg-warm-white border border-border/80 rounded-2xl p-6 shadow-shadow shadow-sm space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-black text-brown-800 font-mono tracking-tight leading-none mb-1">
                  {totalMilkLiters} L / {totalCapacityLimit} L
                </p>
                <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider">Daily Demand Capacity</p>
              </div>
              <span className={cn(
                "text-[10px] font-black px-2.5 py-0.5 rounded-full border",
                capacityUsedPercent >= 90 ? "bg-red-50 text-red-600 border-red-200" :
                capacityUsedPercent >= 75 ? "bg-amber-50 text-amber-600 border-amber-200" :
                "bg-green-50 text-green-600 border-green-200"
              )}>
                {capacityUsedPercent}% Capacity Used
              </span>
            </div>

            {/* Capacity slider bar */}
            <div className="h-3.5 bg-cream-100 rounded-full overflow-hidden border border-border/40 relative">
              <div
                style={{ width: `${Math.min(capacityUsedPercent, 100)}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  capacityUsedPercent >= 90 ? "bg-red-500" :
                  capacityUsedPercent >= 75 ? "bg-amber-500" :
                  "bg-gradient-to-r from-green-500 to-green-600"
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-brown-600 pt-2">
              <div>
                <p className="text-brown-400 font-black text-[9px] uppercase tracking-wider mb-0.5">Remaining slots</p>
                <p className="font-bold text-brown-800 font-mono">{Math.max(0, totalCapacityLimit - totalMilkLiters)} Litres</p>
              </div>
              <div>
                <p className="text-brown-400 font-black text-[9px] uppercase tracking-wider mb-0.5">Current Status</p>
                <p className="font-bold text-green-600">
                  {capacityUsedPercent >= 95 ? 'Closed' : 'Accepting Subs'}
                </p>
              </div>
              <div>
                <p className="text-brown-400 font-black text-[9px] uppercase tracking-wider mb-0.5">Active Routes</p>
                <p className="font-bold text-brown-800">{regionalDemand.length} Delivery Zones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Routing / Area Breakdown (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Delivery Zone Breakdown</h3>
          
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm overflow-hidden divide-y divide-border/40">
            {regionalDemand.map((region: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-4 hover:bg-cream-50/20 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-brown-600">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brown-800 leading-tight">{region.area}</p>
                    <p className="text-[10px] text-brown-400 font-semibold mt-0.5">{region.orders} drops scheduled</p>
                  </div>
                </div>
                <span className="text-xs font-black text-brown-800 font-mono bg-cream-50 px-2.5 py-1 rounded-lg border border-border">{region.litres} L</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
