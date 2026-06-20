'use client'

import { useState, useEffect } from 'react'
import {
  BarChart2, FileText, Download, Filter, TrendingUp, Users, Truck, AlertTriangle, Award,
  Search, Square, ArrowUpRight, ArrowDownRight, ChevronRight, MoreHorizontal, CheckCircle2,
  Clock, Share2, Printer, Plus, Settings, FileDown, Activity, Clock8, RefreshCw, Edit2
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts'

// --- MOCK DATA ---
const revExpData = [
  { name: 'Jan', revenue: 150000, expenses: 80000 },
  { name: 'Feb', revenue: 165000, expenses: 85000 },
  { name: 'Mar', revenue: 180000, expenses: 90000 },
  { name: 'Apr', revenue: 210000, expenses: 105000 },
  { name: 'May', revenue: 245680, expenses: 121680 },
]

const sparklineDataBlue = [{ v: 5 }, { v: 10 }, { v: 12 }, { v: 18 }, { v: 15 }, { v: 22 }, { v: 24 }]
const sparklineDataGreen = [{ v: 28 }, { v: 29 }, { v: 30 }, { v: 31 }, { v: 30 }, { v: 31 }, { v: 32 }]
const sparklineDataSky = [{ v: 3.5 }, { v: 3.2 }, { v: 2.8 }, { v: 2.6 }, { v: 2.5 }, { v: 2.3 }, { v: 2.1 }]
const sparklineDataAmber = [{ v: 14.0 }, { v: 13.8 }, { v: 13.5 }, { v: 13.2 }, { v: 13.0 }, { v: 12.8 }, { v: 12.5 }]
const sparklineDataRed = [{ v: 3000 }, { v: 3500 }, { v: 3200 }, { v: 4000 }, { v: 3800 }, { v: 4200 }, { v: 4500 }]
const sparklineDataPurple = [{ v: 15000 }, { v: 15500 }, { v: 16200 }, { v: 17000 }, { v: 17500 }, { v: 18000 }, { v: 18500 }]

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <BarChart2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytics & Reports</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Generate financial, operational, and customer insights reports.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Plus size={16} /> Custom Report</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Download size={16} /> Export All</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-xl text-xs font-bold text-[#0066cc] bg-blue-50 hover:bg-blue-100 shadow-sm transition-all">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* METRICS GRID WITH SPARKLINES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Reports" value="24" subtext="Generated this mo" trend="+ 3" isUp icon={FileText} color="blue" sparkData={sparklineDataBlue} />
        <MetricCard title="Net Profit Margin" value="32%" subtext="vs last month" trend="+ 2.5%" isUp icon={TrendingUp} color="green" sparkData={sparklineDataGreen} />
        <MetricCard title="Customer Churn" value="2.1%" subtext="vs last month" trend="- 0.5%" isUp icon={Users} color="sky" sparkData={sparklineDataSky} />
        <MetricCard title="Avg Delivery Cost" value="₹12.50" subtext="Per order" trend="- ₹0.80" isUp icon={Truck} color="amber" sparkData={sparklineDataAmber} />
        <MetricCard title="Wastage Cost" value="₹4,500" subtext="2% of revenue" trend="+ ₹300" isUp={false} icon={AlertTriangle} color="red" sparkData={sparklineDataRed} />
        <MetricCard title="Customer LTV" value="₹18.5k" subtext="Lifetime value" trend="+ ₹1.5k" isUp icon={Award} color="purple" sparkData={sparklineDataPurple} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 p-4 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button className="text-xs font-bold text-[#0066cc] border-b-2 border-[#0066cc] pb-4 -mb-4 whitespace-nowrap">Financial</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Operational</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Customers</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Inventory</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Automated</button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search reports..." className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-4 px-4 w-10"><Square size={14} className="text-slate-300"/></th>
                  <th className="py-4 px-2">Report Name</th>
                  <th className="py-4 px-2">Generated</th>
                  <th className="py-4 px-2">Format</th>
                  <th className="py-4 px-2 text-right">Size</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700 divide-y divide-slate-50">
                <ReportRow name="May 2025 Financial Summary" type="Financial" date="Today, 08:30 AM" format="PDF" size="1.2 MB" status="Ready" />
                <ReportRow name="Q1 Revenue Analysis" type="Financial" date="Yesterday, 06:00 PM" format="CSV" size="4.8 MB" status="Ready" />
                <ReportRow name="Monthly Tax Statement (May)" type="Compliance" date="Today, 09:15 AM" format="PDF" size="0.8 MB" status="Generating" isGenerating />
                <ReportRow name="Delivery Cost Breakdown" type="Operational" date="May 15, 2025" format="CSV" size="2.4 MB" status="Ready" />
                <ReportRow name="Customer Churn Report" type="Analytics" date="May 10, 2025" format="PDF" size="1.5 MB" status="Ready" />
                <ReportRow name="Weekly Farm Yield Output" type="Operational" date="May 08, 2025" format="CSV" size="3.1 MB" status="Ready" />
                <ReportRow name="Inventory Wastage Log" type="Inventory" date="May 01, 2025" format="PDF" size="0.9 MB" status="Ready" />
                <ReportRow name="April 2025 Financial Summary" type="Financial" date="May 01, 2025" format="PDF" size="1.1 MB" status="Ready" />
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Showing 1 to 8 of 24 reports</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed"><ChevronRight size={14} className="rotate-180"/></button>
                <button className="w-7 h-7 rounded-lg border border-[#0066cc] bg-blue-50 text-[#0066cc] flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">3</button>
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
          
          {/* Revenue vs Expenses Line Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Revenue vs Expenses (H1)</h2>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revExpData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ fontWeight: 'black' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0066cc" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Automated Schedules Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-800">Automated Schedules</h2>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">3 Active</span>
            </div>
            <div className="space-y-4">
              <ScheduleRow name="Weekly Sales Summary" schedule="Every Mon at 06:00 AM" icon={TrendingUp} color="green" />
              <ScheduleRow name="Daily Yield & Wastage" schedule="Every Day at 08:00 PM" icon={Activity} color="sky" />
              <ScheduleRow name="Monthly Tax Prep" schedule="1st of Month at 09:00 AM" icon={FileText} color="amber" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={FileText} label="Generate New" color="blue" />
              <QuickActionButton icon={Clock8} label="Schedule Report" color="purple" />
              <QuickActionButton icon={TrendingUp} label="Financials" color="green" />
              <QuickActionButton icon={Download} label="Export All" color="sky" />
              <QuickActionButton icon={Search} label="Custom Query" color="amber" />
              <QuickActionButton icon={Settings} label="Report Settings" color="slate" />
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

function ReportRow({ name, type, date, format, size, status, isGenerating }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4"><Square size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer transition-colors"/></td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066cc] flex items-center justify-center">
            <FileText size={14} />
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-slate-800">{name}</span>
             <span className="text-[9px] text-slate-500">{type}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-slate-600">{date}</span>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-md ${format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {format}
        </span>
      </td>
      <td className="py-3 px-2 text-right">
        <span className="text-[10px] font-bold text-slate-500">{size}</span>
      </td>
      <td className="py-3 px-4 text-center">
        {isGenerating ? (
          <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center gap-1 w-fit mx-auto">
            <RefreshCw size={10} className="animate-spin" /> Generating
          </span>
        ) : (
          <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center justify-center gap-1 w-fit mx-auto">
            <CheckCircle2 size={10} /> Ready
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isGenerating && <button className="p-1.5 text-[#0066cc] hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100" title="Download"><FileDown size={12}/></button>}
          {!isGenerating && <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200" title="Share"><Share2 size={12}/></button>}
          <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200"><MoreHorizontal size={12}/></button>
        </div>
      </td>
    </tr>
  )
}

function ScheduleRow({ name, schedule, icon: Icon, color }: any) {
  const colorMap: any = {
    green: 'bg-green-50 text-green-600',
    sky: 'bg-sky-50 text-sky-500',
    amber: 'bg-amber-50 text-amber-500',
  }
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">{name}</span>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 mt-0.5">
            <Clock size={10} /> {schedule}
          </div>
        </div>
      </div>
      <button className="text-slate-400 hover:text-[#0066cc] transition-colors"><Edit2 size={12}/></button>
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
