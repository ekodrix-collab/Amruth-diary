'use client'

import { useState, useEffect } from 'react'
import {
  Wallet, CloudUpload, Download, Filter, UserCheck, UserPlus, Clock, Pause, ArrowRightLeft, Droplets,
  Search, Calendar, Edit2, MoreHorizontal, ChevronRight, ArrowUpRight, ArrowDownRight, Square,
  Plus, ArrowUpCircle, PauseCircle, PlayCircle, RefreshCw, IndianRupee
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

// --- MOCK DATA ---
const distributionData = [
  { name: 'Standard', value: 62, color: '#0ea5e9' },
  { name: 'Premium', value: 21, color: '#22c55e' },
  { name: 'Family', value: 10, color: '#8b5cf6' },
  { name: 'Custom', value: 7, color: '#f59e0b' },
]

const quantityData = [
  { name: '1.0 L / Day', value: 58 },
  { name: '1.5 L / Day', value: 28 },
  { name: '2.0 L / Day', value: 10 },
  { name: '0.5 L / Day', value: 4 },
]

export default function SubscriptionsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <Wallet size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Subscriptions</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Manage recurring milk plans, upgrades, pauses and subscription changes.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><CloudUpload size={16} /> Import</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Download size={16} /> Export</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-xl text-xs font-bold text-[#0066cc] bg-blue-50 hover:bg-blue-100 shadow-sm transition-all">
            <Filter size={16} /> Filters
            <span className="bg-[#0066cc] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] ml-1">2</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Active Subscriptions" value="1,089" trend="+ 8.6%" subtext="vs last month" isUp icon={UserCheck} color="green" />
        <MetricCard title="New This Month" value="42" trend="+ 15.7%" subtext="vs last month" isUp icon={UserPlus} color="blue" />
        <MetricCard title="Pending Activation" value="18" subtext="Awaiting payment" icon={Clock} color="amber" />
        <MetricCard title="Paused / Vacation" value="64" subtext="Temporary" icon={Pause} color="amber" />
        <MetricCard title="Plan Changes" value="31" subtext="Next billing cycle" icon={ArrowRightLeft} color="purple" />
        <MetricCard title="Daily Milk Volume" value="842 L" subtext="Across subscriptions" icon={Droplets} color="sky" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 p-4 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button className="text-xs font-bold text-[#0066cc] border-b-2 border-[#0066cc] pb-4 -mb-4 whitespace-nowrap">All Plans</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Active</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Pending</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Vacation</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Changing Plan</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Cancelled</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Waitlisted</button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search subscriptions..." className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-4 px-4 w-10"><Square size={14} className="text-slate-300"/></th>
                  <th className="py-4 px-2">Customer</th>
                  <th className="py-4 px-2">Subscription ID</th>
                  <th className="py-4 px-2">Plan</th>
                  <th className="py-4 px-2">Daily Qty</th>
                  <th className="py-4 px-2">Start Date</th>
                  <th className="py-4 px-2">Billing Cycle</th>
                  <th className="py-4 px-2">Next Renewal</th>
                  <th className="py-4 px-2 text-center">Auto Renew</th>
                  <th className="py-4 px-2">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700 divide-y divide-slate-50">
                <SubscriptionRow name="Sneha R." subId="SUB-0001248" plan="Standard" qty="1.0 L / Day" start="Jan 12, 2025" cycle="Monthly" nextDate="Jun 01, 2025" nextDays="in 14 days" status="Active" avatar="S" autoRenew />
                <SubscriptionRow name="Rohit Kumar" subId="SUB-0001247" plan="Premium" qty="1.5 L / Day" start="Feb 05, 2025" cycle="Monthly" nextDate="Jun 01, 2025" nextDays="in 14 days" status="Active" avatar="R" autoRenew />
                <SubscriptionRow name="Anita Sharma" subId="SUB-0001246" plan="Standard" qty="1.0 L / Day" start="Mar 15, 2025" cycle="Monthly" nextDate="Jun 08, 2025" nextDays="in 21 days" status="Vacation" avatar="A" autoRenew />
                <SubscriptionRow name="Vikram Joshi" subId="SUB-0001245" plan="Family" qty="2.0 L / Day" start="Apr 10, 2025" cycle="Monthly" nextDate="Jun 01, 2025" nextDays="in 14 days" status="Active" avatar="V" autoRenew />
                <SubscriptionRow name="Priya Nair" subId="SUB-0001244" plan="Standard" qty="1.0 L / Day" start="May 02, 2025" cycle="Monthly" nextDate="May 20, 2025" nextDays="in 3 days" status="Awaiting Payment" isUrgent avatar="P" autoRenew={false} />
                <SubscriptionRow name="Meera Iyer" subId="SUB-0001243" plan="Premium" qty="1.5 L / Day" start="Mar 01, 2025" cycle="Monthly" nextDate="Jun 01, 2025" nextDays="in 14 days" status="Plan Change" avatar="M" autoRenew />
                <SubscriptionRow name="Arjun Patel" subId="SUB-0001242" plan="Custom" qty="0.5 L / Day" start="Apr 22, 2025" cycle="Monthly" nextDate="May 22, 2025" nextDays="in 5 days" status="Active" isUrgent avatar="A" autoRenew />
                <SubscriptionRow name="Karthik Rao" subId="SUB-0001241" plan="Premium" qty="1.5 L / Day" start="Apr 18, 2025" cycle="Monthly" nextDate="May 18, 2025" nextDays="in 1 day" status="Cancelled" isUrgent avatar="K" autoRenew={false} />
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Showing 1 to 8 of 1,089 subscriptions</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"><ChevronRight size={14} className="rotate-180"/></button>
                <button className="w-7 h-7 rounded-lg border border-[#0066cc] bg-blue-50 text-[#0066cc] flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">3</button>
                <span>...</span>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">109</button>
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"><ChevronRight size={14}/></button>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <span>Rows per page</span>
                <select className="border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Subscription Distribution Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Subscription Distribution</h2>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={distributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1 ml-4">
                {distributionData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-bold text-slate-700">{d.name}</span>
                    </div>
                    <span className="font-black text-slate-800 w-8 text-right">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Distribution Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Quantity Distribution (Daily)</h2>
            <div className="space-y-4">
              {quantityData.map((item, idx) => {
                const max = Math.max(...quantityData.map(d => d.value))
                const width = `${(item.value / max) * 100}%`
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-700 w-16">{item.name}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0066cc] rounded-full" style={{ width }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 w-8 text-right">{item.value}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-800">Upcoming Renewals</h2>
              <button className="text-[10px] font-bold text-[#0066cc] bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100">View all</button>
            </div>
            <div className="space-y-4">
              <UpcomingRenewalRow name="Sneha R." time="Tomorrow" amount="₹900" avatar="S" />
              <UpcomingRenewalRow name="Rohit Kumar" time="Tomorrow" amount="₹1,350" avatar="R" />
              <UpcomingRenewalRow name="Vikram Joshi" time="Tomorrow" amount="₹1,800" avatar="V" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={Plus} label="New Subscription" color="blue" />
              <QuickActionButton icon={ArrowUpCircle} label="Upgrade Plan" color="emerald" />
              <QuickActionButton icon={PauseCircle} label="Pause Subscription" color="amber" />
              <QuickActionButton icon={PlayCircle} label="Resume Subscription" color="sky" />
              <QuickActionButton icon={RefreshCw} label="Change Quantity" color="purple" />
              <QuickActionButton icon={Download} label="Export Plans" color="slate" />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// --- SUBCOMPONENTS ---

function MetricCard({ title, value, trend, isUp, icon: Icon, color, subtext }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-[#0066cc]' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-500' },
  }
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 mb-0.5">{title}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
        <div className="flex flex-col mt-1">
          {trend ? (
            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
              {isUp ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
              {trend}
            </span>
          ) : null}
          <span className="text-[9px] font-bold text-slate-400">{subtext}</span>
        </div>
      </div>
    </div>
  )
}

function SubscriptionRow({ name, subId, plan, qty, start, cycle, nextDate, nextDays, status, avatar, autoRenew, isUrgent }: any) {
  const planMap: any = {
    'Standard': { bg: 'bg-sky-50', text: 'text-sky-600' },
    'Premium': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    'Family': { bg: 'bg-purple-50', text: 'text-purple-600' },
    'Custom': { bg: 'bg-orange-50', text: 'text-orange-600' },
  }

  const statusMap: any = {
    'Active': { bg: 'bg-green-50', text: 'text-green-600' },
    'Vacation': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'Awaiting Payment': { bg: 'bg-blue-50', text: 'text-[#0066cc]' },
    'Plan Change': { bg: 'bg-purple-50', text: 'text-purple-600' },
    'Cancelled': { bg: 'bg-red-50', text: 'text-red-600' },
  }

  const p = planMap[plan] || { bg: 'bg-slate-50', text: 'text-slate-500' }
  const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-500' }

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4"><Square size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer transition-colors"/></td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden">
            {avatar}
          </div>
          <span className="font-bold text-slate-800">{name}</span>
        </div>
      </td>
      <td className="py-3 px-2">
        <span className="font-bold text-slate-600">{subId}</span>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-md border border-white shadow-sm ${p.bg} ${p.text}`}>{plan}</span>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-[#0066cc] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{qty}</span>
      </td>
      <td className="py-3 px-2">
        <span className="text-slate-500">{start}</span>
      </td>
      <td className="py-3 px-2">
        <span className="text-slate-500">{cycle}</span>
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <Calendar size={12} className={isUrgent ? 'text-orange-500' : 'text-slate-400'} />
          <div className="flex flex-col leading-tight">
             <span className={`font-bold ${isUrgent ? 'text-orange-600' : 'text-slate-800'}`}>{nextDate}</span>
             <span className={`text-[9px] ${isUrgent ? 'text-orange-400' : 'text-slate-400'}`}>{nextDays}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-2 text-center">
        <div className={`w-8 h-4 rounded-full mx-auto relative cursor-pointer transition-colors ${autoRenew ? 'bg-[#0066cc]' : 'bg-slate-200'}`}>
          <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${autoRenew ? 'left-4.5' : 'left-0.5'}`} />
        </div>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>{status}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-[#0066cc] hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100"><Edit2 size={12}/></button>
          <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200"><MoreHorizontal size={12}/></button>
        </div>
      </td>
    </tr>
  )
}

function QuickActionButton({ icon: Icon, label, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-[#0066cc] hover:bg-[#0066cc] border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-500 hover:bg-amber-500 border-amber-100',
    sky: 'bg-sky-50 text-sky-500 hover:bg-sky-500 border-sky-100',
    slate: 'bg-slate-50 text-slate-600 hover:bg-slate-600 border-slate-200',
  }
  return (
    <button className="flex flex-col items-center justify-center p-3 text-center rounded-xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm transition-all group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors mb-2 ${colorMap[color]} group-hover:text-white border`}>
        <Icon size={14} />
      </div>
      <span className="text-[9px] font-bold text-slate-600 leading-tight">{label}</span>
    </button>
  )
}

function UpcomingRenewalRow({ name, time, amount, avatar }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
          {avatar}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">{name}</span>
          <span className="text-[9px] font-bold text-slate-400">{time}</span>
        </div>
      </div>
      <span className="text-xs font-black text-slate-800">{amount}</span>
    </div>
  )
}
