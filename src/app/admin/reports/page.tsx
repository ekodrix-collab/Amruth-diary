'use client'

import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, Users, Droplet, ArrowUpRight, ShieldAlert, RefreshCw } from 'lucide-react'

export default function AdminReportsPage() {
  const [reportsData, setReportsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchReports() {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/dashboard')
      const json = await res.json()
      if (json.success && json.reports) {
        setReportsData({
          ...json.reports,
          waitlistLitres: json.customers?.waitlist_litres || 0,
          waitlistCount: json.customers?.in_waitlist || 0
        })
      }
    } catch (err) {
      console.error('Failed to fetch reports data', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-cream-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-cream-200 rounded-2xl" />
          <div className="h-28 bg-cream-200 rounded-2xl" />
          <div className="h-28 bg-cream-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  const stats = [
    { label: 'Average Daily Demand', value: reportsData?.average_daily_demand || '0 Litres', change: 'Live volume total', trend: 'up' },
    { label: 'Active Routes', value: reportsData?.active_routes || '0 Routes', change: 'Covered delivery zones', trend: 'neutral' },
    { label: 'Customer Retention', value: reportsData?.customer_retention || '98.4%', change: 'Active subscriber loyalty', trend: 'up' },
  ]

  const areaDeliveries = reportsData?.area_deliveries || []

  return (
    <div className="space-y-6 max-w-5xl pb-10">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Reports & Analytics</h1>
          <p className="text-xs font-semibold text-brown-600">Analyze delivery statistics, routing capacities, and monthly collections.</p>
        </div>
        <button 
          onClick={fetchReports}
          className="p-2 bg-cream-100 hover:bg-cream-200 border border-border text-brown-800 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-extrabold"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-warm-white border border-border/80 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-xl font-black text-brown-800 font-mono">{s.value}</p>
            <p className="text-[10px] font-semibold text-green-600 mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={12} /> {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column - Route Analysis (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Route & Demand Breakdown</h3>
          
          <div className="bg-warm-white border border-border/80 rounded-[22px] shadow-shadow shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-50/10 border-b border-border/40">
                  {['Delivery Zone', 'Drops Count', 'Daily Litres', 'Est. Revenue'].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-black text-brown-600 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {areaDeliveries.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-cream-50/10 transition-colors text-xs">
                    <td className="px-5 py-3.5 font-bold text-brown-800">{row.zone}</td>
                    <td className="px-5 py-3.5 font-semibold text-brown-600">{row.deliveries} points</td>
                    <td className="px-5 py-3.5 font-bold text-brown-850 font-mono">{row.volume}</td>
                    <td className="px-5 py-3.5 font-bold text-amber-600 font-mono">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Demand Forecast (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Demand Forecast</h3>
          
          <div className="bg-warm-white border border-border/80 rounded-[22px] shadow-shadow shadow-sm p-5 space-y-5 text-xs text-brown-600 font-semibold">
            
            {/* Visual Forecast Indicator */}
            <div className="bg-cream-50/40 border border-border/60 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Demand Growth Tracker</span>
                <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Waitlist Queue</span>
              </div>
              <p className="leading-relaxed">
                Daily milk bookings are projected to increase by <span className="font-bold text-brown-800">{reportsData?.waitlistLitres || 0} Litres</span> based on <span className="font-bold text-brown-800">{reportsData?.waitlistCount || 0} pending requests</span> in the waitlist.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-[9px] font-black text-brown-400 uppercase tracking-wider">Route Optimization Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Monitoring live delivery times across all active routes.</span>
              </div>
            </div>

            <div className="h-[1px] bg-border/40" />

            <div className="flex gap-2">
              <ShieldAlert className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] text-brown-400 leading-relaxed font-bold">
                Capacity limit warnings will be raised automatically if tomorrow forecast exceeds 95% threshold.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
