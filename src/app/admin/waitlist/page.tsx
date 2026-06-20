'use client'

import { useState, useEffect } from 'react'
import {
  Users, CloudUpload, Download, Filter, Clock, Star, CheckCircle, XCircle, TrendingUp,
  Search, Square, ArrowUpRight, ArrowDownRight, ChevronRight, MoreHorizontal, Edit2, Play,
  Mail, MapPin, UserPlus, Database, UserCheck, Trash2
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts'

// --- MOCK DATA ---
const areaData = [
  { name: 'HSR Layout', value: 18, color: '#0ea5e9' },
  { name: 'Koramangala', value: 12, color: '#f59e0b' },
  { name: 'Indiranagar', value: 7, color: '#8b5cf6' },
  { name: 'Whitefield', value: 5, color: '#22c55e' },
]

const activationTrendData = [
  { name: 'Week 1', value: 4 },
  { name: 'Week 2', value: 6 },
  { name: 'Week 3', value: 3 },
  { name: 'Week 4', value: 8 },
  { name: 'Week 5', value: 12 },
  { name: 'Week 6', value: 24 },
]

const sparklineDataBlue = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 25 }, { v: 20 }, { v: 35 }, { v: 42 }]
const sparklineDataPurple = [{ v: 20 }, { v: 18 }, { v: 19 }, { v: 15 }, { v: 16 }, { v: 14 }, { v: 14 }]
const sparklineDataAmber = [{ v: 2 }, { v: 3 }, { v: 2 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 8 }]
const sparklineDataGreen = [{ v: 4 }, { v: 6 }, { v: 8 }, { v: 12 }, { v: 15 }, { v: 20 }, { v: 24 }]
const sparklineDataRed = [{ v: 0 }, { v: 1 }, { v: 1 }, { v: 2 }, { v: 2 }, { v: 4 }, { v: 5 }]
const sparklineDataSky = [{ v: 15000 }, { v: 18000 }, { v: 22000 }, { v: 28000 }, { v: 35000 }, { v: 42000 }, { v: 48000 }]

export default function WaitlistPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Customer Waitlist</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Manage potential customers waiting for subscription slots based on capacity.</p>
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

      {/* METRICS GRID WITH SPARKLINES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total on Waitlist" value="42" subtext="Waiting for slots" trend="+ 5" isUp icon={Users} color="blue" sparkData={sparklineDataBlue} />
        <MetricCard title="Average Wait Time" value="14 Days" subtext="Last 30 days" trend="- 2 Days" isUp icon={Clock} color="purple" sparkData={sparklineDataPurple} />
        <MetricCard title="High Priority" value="8" subtext="Referred / Special" trend="+ 2" isUp icon={Star} color="amber" sparkData={sparklineDataAmber} />
        <MetricCard title="Conversions" value="24" subtext="Activated this week" trend="+ 12" isUp icon={CheckCircle} color="green" sparkData={sparklineDataGreen} />
        <MetricCard title="Dropped Off" value="5" subtext="Cancelled request" trend="+ 1" isUp={false} icon={XCircle} color="red" sparkData={sparklineDataRed} />
        <MetricCard title="Potential Revenue" value="₹48k/mo" subtext="If all activated" trend="+ ₹5k" isUp icon={TrendingUp} color="sky" sparkData={sparklineDataSky} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 p-4 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button className="text-xs font-bold text-[#0066cc] border-b-2 border-[#0066cc] pb-4 -mb-4 whitespace-nowrap">All Waitlisted</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Ready to Activate</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Contacted</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Dropped</button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search name or area..." className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-4 px-4 w-10"><Square size={14} className="text-slate-300"/></th>
                  <th className="py-4 px-2">Customer</th>
                  <th className="py-4 px-2">Area / Pincode</th>
                  <th className="py-4 px-2">Requested Plan</th>
                  <th className="py-4 px-2 text-right">Qty / Day</th>
                  <th className="py-4 px-2 text-right">Days Waiting</th>
                  <th className="py-4 px-4 text-center">Priority</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700 divide-y divide-slate-50">
                <WaitlistRow name="Aditi Rao" phone="98765 11111" area="HSR Layout, Sector 2" pin="560102" plan="A2 Cow Milk" qty="2.0 L" days="18" priority="High" avatar="A" />
                <WaitlistRow name="Rahul Menon" phone="91234 22222" area="Koramangala 4th Blk" pin="560034" plan="Buffalo Milk" qty="1.0 L" days="15" priority="Medium" avatar="R" />
                <WaitlistRow name="Neha Sharma" phone="99876 33333" area="Indiranagar 1st Stage" pin="560038" plan="A2 Cow Milk" qty="1.5 L" days="12" priority="High" avatar="N" />
                <WaitlistRow name="Kiran Kumar" phone="90123 44444" area="Whitefield, ITPL" pin="560066" plan="A2 Cow Milk" qty="1.0 L" days="10" priority="Low" avatar="K" />
                <WaitlistRow name="Sneha Desai" phone="95312 55555" area="HSR Layout, Sector 1" pin="560102" plan="Buffalo Milk" qty="2.0 L" days="8" priority="Medium" avatar="S" />
                <WaitlistRow name="Vikram Singh" phone="93456 66666" area="Koramangala 3rd Blk" pin="560034" plan="A2 Cow Milk" qty="1.0 L" days="5" priority="Low" avatar="V" />
                <WaitlistRow name="Pooja Patel" phone="90567 77777" area="Indiranagar 2nd Stage" pin="560038" plan="Buffalo Milk" qty="1.5 L" days="3" priority="Medium" avatar="P" />
                <WaitlistRow name="Amit Verma" phone="98701 88888" area="HSR Layout, Sector 3" pin="560102" plan="A2 Cow Milk" qty="1.0 L" days="1" priority="Low" avatar="A" />
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Showing 1 to 8 of 42 waiting</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed"><ChevronRight size={14} className="rotate-180"/></button>
                <button className="w-7 h-7 rounded-lg border border-[#0066cc] bg-blue-50 text-[#0066cc] flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">3</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">4</button>
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
          
          {/* Waitlist by Area Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Demand by Area</h2>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={areaData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                      {areaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1 ml-4">
                {areaData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-bold text-slate-700">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-800">{d.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activation Trend Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Activation Trend (6 Weeks)</h2>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activationTrendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Areas Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-800">Top Service Areas</h2>
              <span className="text-[10px] font-bold text-slate-500">Waitlist Count</span>
            </div>
            <div className="space-y-4">
              <AreaRow name="HSR Layout" code="560102" count="18 Users" color="sky" />
              <AreaRow name="Koramangala" code="560034" count="12 Users" color="amber" />
              <AreaRow name="Indiranagar" code="560038" count="7 Users" color="purple" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={UserCheck} label="Approve Top 5" color="green" />
              <QuickActionButton icon={Mail} label="Message All" color="amber" />
              <QuickActionButton icon={UserPlus} label="Add Waitlist" color="blue" />
              <QuickActionButton icon={MapPin} label="Prioritize Area" color="purple" />
              <QuickActionButton icon={Database} label="Capacity" color="sky" />
              <QuickActionButton icon={Download} label="Export List" color="slate" />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// --- SUBCOMPONENTS ---

function MetricCard({ title, value, subtext, trend, isUp, icon: Icon, color, sparkData }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-[#0066cc]', stroke: '#0066cc' },
    green: { bg: 'bg-green-50', text: 'text-green-600', stroke: '#22c55e' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-500', stroke: '#f59e0b' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500', stroke: '#8b5cf6' },
    red: { bg: 'bg-red-50', text: 'text-red-500', stroke: '#ef4444' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-500', stroke: '#0ea5e9' },
  }
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-500 mb-0.5">{title}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
        <div className="flex flex-col mt-1">
          <span className="text-[9px] font-bold text-slate-400">{subtext}</span>
          {trend && (
             <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${isUp === false ? 'text-red-500' : 'text-green-600'}`}>
              {isUp === false ? <ArrowDownRight size={10}/> : <ArrowUpRight size={10}/>}
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[40px] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={c.stroke} strokeWidth={2} dot={{ r: 2, fill: c.stroke, strokeWidth: 1, stroke: '#fff' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function WaitlistRow({ name, phone, area, pin, plan, qty, days, priority, avatar }: any) {
  const priorityMap: any = {
    'High': { bg: 'bg-red-50', text: 'text-red-600' },
    'Medium': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'Low': { bg: 'bg-slate-100', text: 'text-slate-600' },
  }
  const p = priorityMap[priority] || { bg: 'bg-slate-50', text: 'text-slate-500' }

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4"><Square size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer transition-colors"/></td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden">
            {avatar}
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-slate-800">{name}</span>
             <span className="text-[9px] text-slate-500">{phone}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-2">
        <div className="flex flex-col">
           <span className="text-xs text-slate-700">{area}</span>
           <span className="text-[9px] text-slate-400">PIN: {pin}</span>
        </div>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-[#0066cc] bg-blue-50 px-2 py-1 rounded-md">{plan}</span>
      </td>
      <td className="py-3 px-2 text-right pl-4">
        <span className="font-black text-slate-800">{qty}</span>
      </td>
      <td className="py-3 px-2 text-right pr-6">
        <span className={`font-black ${parseInt(days) > 10 ? 'text-amber-600' : 'text-slate-800'}`}>{days}</span>
      </td>
      <td className="py-3 px-4 text-center">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${p.bg} ${p.text}`}>{priority}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-100" title="Activate"><Play size={12}/></button>
          <button className="p-1.5 text-[#0066cc] hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100" title="Message"><Mail size={12}/></button>
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100" title="Remove"><Trash2 size={12}/></button>
        </div>
      </td>
    </tr>
  )
}

function AreaRow({ name, code, count, color }: any) {
  const colorMap: any = {
    sky: 'bg-sky-50 text-sky-500',
    amber: 'bg-amber-50 text-amber-500',
    purple: 'bg-purple-50 text-purple-500',
  }
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <MapPin size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">{name}</span>
          <span className="text-[9px] font-bold text-slate-400">PIN: {code}</span>
        </div>
      </div>
      <span className="text-[10px] font-black text-slate-800">{count}</span>
    </div>
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
    green: 'bg-green-50 text-green-600 hover:bg-green-600 border-green-100',
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
