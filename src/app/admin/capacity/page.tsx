'use client'

import { useState, useEffect } from 'react'
import {
  Droplets, CloudUpload, Download, Filter, Activity, ShieldCheck, UserPlus, AlertCircle, TrendingUp,
  Search, Square, ArrowUpRight, ArrowDownRight, ChevronRight, MoreHorizontal, Edit2, CheckCircle2,
  AlertTriangle, RefreshCw, Plus, FileText, Database, Share2
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area
} from 'recharts'

// --- MOCK DATA ---
const utilizationData = [
  { name: 'Committed', value: 84, color: '#0066cc' },
  { name: 'Available Buffer', value: 16, color: '#e2e8f0' },
]

const yieldTrendData = [
  { name: 'Mon', value: 920 },
  { name: 'Tue', value: 940 },
  { name: 'Wed', value: 910 },
  { name: 'Thu', value: 960 },
  { name: 'Fri', value: 980 },
  { name: 'Sat', value: 990 },
  { name: 'Sun', value: 1000 },
]

const sparklineDataBlue = [{ v: 1000 }, { v: 1000 }, { v: 1000 }, { v: 1000 }, { v: 1000 }, { v: 1000 }, { v: 1000 }]
const sparklineDataGreen = [{ v: 75 }, { v: 78 }, { v: 80 }, { v: 79 }, { v: 82 }, { v: 83 }, { v: 84 }]
const sparklineDataSky = [{ v: 25 }, { v: 22 }, { v: 20 }, { v: 21 }, { v: 18 }, { v: 17 }, { v: 16 }]
const sparklineDataAmber = [{ v: 15 }, { v: 18 }, { v: 20 }, { v: 22 }, { v: 25 }, { v: 26 }, { v: 27 }]
const sparklineDataRed = [{ v: 2 }, { v: 5 }, { v: 3 }, { v: 8 }, { v: 4 }, { v: 2 }, { v: 5 }]
const sparklineDataPurple = [{ v: 13.5 }, { v: 13.8 }, { v: 14.0 }, { v: 14.1 }, { v: 13.9 }, { v: 14.2 }, { v: 14.2 }]

export default function CapacityPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <Droplets size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Production & Capacity</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Monitor milk production, farm yield, and daily capacity limits.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><CloudUpload size={16} /> Import</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Download size={16} /> Export</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-xl text-xs font-bold text-[#0066cc] bg-blue-50 hover:bg-blue-100 shadow-sm transition-all">
            <Filter size={16} /> Filters
            <span className="bg-[#0066cc] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] ml-1">1</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID WITH SPARKLINES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Capacity" value="1,000 L" subtext="Max farm yield" trend="Fixed" icon={Droplets} color="blue" sparkData={sparklineDataBlue} />
        <MetricCard title="Current Utilization" value="84%" subtext="842 L committed" trend="+ 2.5%" isUp icon={Activity} color="green" sparkData={sparklineDataGreen} />
        <MetricCard title="Available Buffer" value="158 L" subtext="16% remaining" trend="- 2.5%" isUp={false} icon={ShieldCheck} color="sky" sparkData={sparklineDataSky} />
        <MetricCard title="Waitlist Demand" value="45 L" subtext="From 27 users" trend="+ 5 L" isUp icon={UserPlus} color="amber" sparkData={sparklineDataAmber} />
        <MetricCard title="Wastage / Spoiled" value="5 L" subtext="0.5% today" trend="+ 1 L" isUp={false} icon={AlertCircle} color="red" sparkData={sparklineDataRed} />
        <MetricCard title="Avg Yield / Cow" value="14.2 L" subtext="vs last week" trend="+ 2.0%" isUp icon={TrendingUp} color="purple" sparkData={sparklineDataPurple} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 p-4 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button className="text-xs font-bold text-[#0066cc] border-b-2 border-[#0066cc] pb-4 -mb-4 whitespace-nowrap">Daily Logs</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Farm Yield</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Wastage</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Adjustments</button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search date or source..." className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-4 px-4 w-10"><Square size={14} className="text-slate-300"/></th>
                  <th className="py-4 px-2">Date</th>
                  <th className="py-4 px-2">Source</th>
                  <th className="py-4 px-2 text-right">Expected Yield</th>
                  <th className="py-4 px-2 text-right">Actual Yield</th>
                  <th className="py-4 px-2 text-right">Variance</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700 divide-y divide-slate-50">
                <LogRow date="May 18, 2025" source="Farm A - North Block" expected="450 L" actual="462 L" variance="+ 12 L" isPositive status="Optimal" />
                <LogRow date="May 18, 2025" source="Farm B - South Block" expected="550 L" actual="538 L" variance="- 12 L" isPositive={false} status="Below Target" />
                <LogRow date="May 17, 2025" source="Farm A - North Block" expected="450 L" actual="455 L" variance="+ 5 L" isPositive status="Optimal" />
                <LogRow date="May 17, 2025" source="Farm B - South Block" expected="550 L" actual="535 L" variance="- 15 L" isPositive={false} status="Below Target" />
                <LogRow date="May 16, 2025" source="Farm A - North Block" expected="450 L" actual="448 L" variance="- 2 L" isPositive={false} status="Optimal" />
                <LogRow date="May 16, 2025" source="Farm B - South Block" expected="550 L" actual="532 L" variance="- 18 L" isPositive={false} status="Below Target" />
                <LogRow date="May 15, 2025" source="Farm A - North Block" expected="450 L" actual="460 L" variance="+ 10 L" isPositive status="Optimal" />
                <LogRow date="May 15, 2025" source="Farm B - South Block" expected="550 L" actual="540 L" variance="- 10 L" isPositive={false} status="Optimal" />
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Showing 1 to 8 of 124 logs</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed"><ChevronRight size={14} className="rotate-180"/></button>
                <button className="w-7 h-7 rounded-lg border border-[#0066cc] bg-blue-50 text-[#0066cc] flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">3</button>
                <span>...</span>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">16</button>
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
          
          {/* Utilization Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Capacity Utilization</h2>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-[120px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={utilizationData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                      {utilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-[#0066cc]">84%</span>
                </div>
              </div>
              <div className="space-y-3 flex-1 ml-4">
                {utilizationData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color === '#e2e8f0' ? '#94a3b8' : d.color }} />
                      <span className="font-bold text-slate-700">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-800">{d.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7-Day Yield Trend Area Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">7-Day Yield Trend (Liters)</h2>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldTrendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066cc" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Area type="monotone" dataKey="value" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Capacity Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-800">Capacity Alerts</h2>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">2 Alerts</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <AlertTriangle size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Buffer Running Low</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Buffer is at 16%. Consider pausing waitlist approvals.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <AlertCircle size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Farm B Underperforming</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Yield is 12L below target for the 3rd consecutive day.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={Droplets} label="Log Yield" color="blue" />
              <QuickActionButton icon={RefreshCw} label="Adjust Base" color="emerald" />
              <QuickActionButton icon={UserPlus} label="View Waitlist" color="amber" />
              <QuickActionButton icon={Plus} label="Add Farm" color="purple" />
              <QuickActionButton icon={TrendingUp} label="Projections" color="sky" />
              <QuickActionButton icon={Share2} label="Export Report" color="slate" />
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
             <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${trend === 'Fixed' ? 'text-slate-400' : isUp === false ? 'text-red-500' : 'text-green-600'}`}>
              {trend !== 'Fixed' && (isUp === false ? <ArrowDownRight size={10}/> : <ArrowUpRight size={10}/>)}
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

function LogRow({ date, source, expected, actual, variance, isPositive, status }: any) {
  const statusMap: any = {
    'Optimal': { bg: 'bg-green-50', text: 'text-green-600' },
    'Below Target': { bg: 'bg-red-50', text: 'text-red-600' },
  }
  const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-500' }

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4"><Square size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer transition-colors"/></td>
      <td className="py-3 px-2">
        <span className="font-bold text-slate-800 text-[11px]">{date}</span>
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <Database size={12} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-600">{source}</span>
        </div>
      </td>
      <td className="py-3 px-2 text-right">
        <span className="font-bold text-slate-600">{expected}</span>
      </td>
      <td className="py-3 px-2 text-right">
        <span className="font-black text-slate-800">{actual}</span>
      </td>
      <td className="py-3 px-2 text-right">
        <span className={`text-[10px] font-black ${isPositive ? 'text-green-600' : 'text-red-500'}`}>{variance}</span>
      </td>
      <td className="py-3 px-4 text-center">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>{status}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-[#0066cc] hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100" title="Edit"><Edit2 size={12}/></button>
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
