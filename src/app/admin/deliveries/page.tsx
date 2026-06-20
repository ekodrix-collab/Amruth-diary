'use client'

import { useState, useEffect } from 'react'
import {
  Truck, CloudUpload, Download, Filter, CheckCircle, Clock, CalendarX, Umbrella,
  Search, Calendar, Edit2, MoreHorizontal, ChevronRight, ArrowUpRight, ArrowDownRight, Square,
  Plus, CalendarPlus, UserPlus, XCircle, Eye
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts'

// --- MOCK DATA ---
const overviewData = [
  { name: 'Completed', value: 198, color: '#22c55e', percent: '36.5%' },
  { name: 'In Progress', value: 28, color: '#0ea5e9', percent: '5.2%' },
  { name: 'Pending', value: 22, color: '#f59e0b', percent: '4.1%' },
  { name: 'Skipped', value: 16, color: '#8b5cf6', percent: '3.0%' },
  { name: 'Vacation', value: 14, color: '#ef4444', percent: '2.6%' },
]

const timeSlotData = [
  { name: '6AM - 8AM', value: 156, percent: '66%' },
  { name: '8AM - 10AM', value: 64, percent: '27%' },
  { name: '10AM - 12PM', value: 36, percent: '15%' },
  { name: '12PM - 2PM', value: 12, percent: '5%' },
]

const sparklineDataBlue = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 25 }, { v: 20 }, { v: 35 }, { v: 45 }]
const sparklineDataGreen = [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }, { v: 38 }]
const sparklineDataAmber = [{ v: 45 }, { v: 35 }, { v: 20 }, { v: 25 }, { v: 12 }, { v: 15 }, { v: 10 }]
const sparklineDataPurple = [{ v: 5 }, { v: 10 }, { v: 8 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 16 }]
const sparklineDataRed = [{ v: 12 }, { v: 8 }, { v: 15 }, { v: 10 }, { v: 18 }, { v: 14 }, { v: 16 }]

export default function DeliveriesPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <Truck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Deliveries</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Manage daily milk deliveries and track delivery status in real-time.</p>
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
        <MetricCard title="Today's Deliveries" value="542 L" subtext="236 deliveries" trend="+ 12.5%" isUp icon={Truck} color="blue" sparkData={sparklineDataBlue} />
        <MetricCard title="Completed" value="198" subtext="36.5%" icon={CheckCircle} color="green" sparkData={sparklineDataGreen} />
        <MetricCard title="In Progress" value="28" subtext="5.2%" icon={Clock} color="sky" sparkData={sparklineDataBlue} />
        <MetricCard title="Pending" value="22" subtext="4.1%" icon={Clock} color="amber" sparkData={sparklineDataAmber} />
        <MetricCard title="Skipped" value="16" subtext="3.0%" icon={CalendarX} color="purple" sparkData={sparklineDataPurple} />
        <MetricCard title="Vacation" value="14" subtext="2.6%" icon={Umbrella} color="red" sparkData={sparklineDataRed} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 p-4 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button className="text-xs font-bold text-[#0066cc] border-b-2 border-[#0066cc] pb-4 -mb-4 whitespace-nowrap">All Deliveries</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Pending</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">In Progress</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Completed</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Skipped</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Vacation</button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search deliveries..." className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-4 px-4 w-10"><Square size={14} className="text-slate-300"/></th>
                  <th className="py-4 px-2">Customer</th>
                  <th className="py-4 px-2">Address / Area</th>
                  <th className="py-4 px-2">Plan / Qty</th>
                  <th className="py-4 px-2">Delivery Date</th>
                  <th className="py-4 px-2">Time Slot</th>
                  <th className="py-4 px-2">Status</th>
                  <th className="py-4 px-2">Delivery Person</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700 divide-y divide-slate-50">
                <DeliveryRow name="Sneha R." phone="98765 43210" address="HSR Layout, Sector 2" city="Bengaluru" qty="1.0 L / Day" date="May 18, 2025" dayText="Today" timeSlot="6:00 AM - 8:00 AM" status="Completed" dpName="Ramesh" dpAvatar="R" avatar="S" />
                <DeliveryRow name="Rohit Kumar" phone="91234 56789" address="Koramangala 4th Block" city="Bengaluru" qty="1.5 L / Day" date="May 18, 2025" dayText="Today" timeSlot="6:00 AM - 8:00 AM" status="In Progress" dpName="Ramesh" dpAvatar="R" avatar="R" />
                <DeliveryRow name="Anita Sharma" phone="99876 54321" address="BTM Layout, 2nd Stage" city="Bengaluru" qty="1.0 L / Day" date="May 18, 2025" dayText="Today" timeSlot="8:00 AM - 10:00 AM" status="Pending" dpName="Suresh" dpAvatar="S" avatar="A" />
                <DeliveryRow name="Vikram Joshi" phone="90123 45678" address="Jayanagar 8th Block" city="Bengaluru" qty="2.0 L / Day" date="May 18, 2025" dayText="Today" timeSlot="8:00 AM - 10:00 AM" status="Completed" dpName="Suresh" dpAvatar="S" avatar="V" />
                <DeliveryRow name="Priya Nair" phone="95312 34567" address="Basavanagudi" city="Bengaluru" qty="1.0 L / Day" date="May 18, 2025" dayText="Today" timeSlot="10:00 AM - 12:00 PM" status="Skipped" dpName="-" dpAvatar="" avatar="P" />
                <DeliveryRow name="Meera Iyer" phone="93456 78901" address="JP Nagar 6th Phase" city="Bengaluru" qty="1.5 L / Day" date="May 18, 2025" dayText="Today" timeSlot="10:00 AM - 12:00 PM" status="Vacation" dpName="-" dpAvatar="" avatar="M" />
                <DeliveryRow name="Arjun Patel" phone="90567 89012" address="Banashankari 3rd Stage" city="Bengaluru" qty="1.0 L / Day" date="May 18, 2025" dayText="Today" timeSlot="6:00 AM - 8:00 AM" status="Pending" dpName="Ramesh" dpAvatar="R" avatar="A" />
                <DeliveryRow name="Karthik Rao" phone="98701 23456" address="Whitefield, ITPL Main Rd" city="Bengaluru" qty="1.0 L / Day" date="May 18, 2025" dayText="Today" timeSlot="6:00 AM - 8:00 AM" status="In Progress" dpName="Ramesh" dpAvatar="R" avatar="K" />
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Showing 1 to 8 of 236 deliveries</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"><ChevronRight size={14} className="rotate-180"/></button>
                <button className="w-7 h-7 rounded-lg border border-[#0066cc] bg-blue-50 text-[#0066cc] flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">3</button>
                <span>...</span>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center">30</button>
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
          
          {/* Delivery Overview Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Delivery Overview (Today)</h2>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overviewData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1 ml-4">
                {overviewData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-bold text-slate-700">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-800">{d.value}</span>
                      <span className="text-slate-400">({d.percent})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery by Time Slot */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Delivery by Time Slot</h2>
            <div className="space-y-4">
              {timeSlotData.map((item, idx) => {
                const max = Math.max(...timeSlotData.map(d => d.value))
                const width = `${(item.value / max) * 100}%`
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-700 w-16">{item.name}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0066cc] rounded-full" style={{ width }} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] w-12 justify-end">
                      <span className="font-black text-slate-800">{item.value}</span>
                      <span className="text-slate-400">({item.percent})</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today's Route Progress */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-800">Today's Route Progress</h2>
              <span className="text-[10px] font-bold text-slate-500">68% Completed</span>
            </div>
            <div className="relative pt-2 pb-4">
               <div className="h-2.5 bg-slate-100 rounded-full w-full" />
               <div className="h-2.5 bg-[#0066cc] rounded-full absolute top-2 left-0" style={{ width: '68%' }} />
               <div className="absolute top-0.5" style={{ left: '68%', transform: 'translateX(-50%)' }}>
                  <div className="w-6 h-6 bg-white border-2 border-[#0066cc] rounded-full flex items-center justify-center shadow-sm">
                     <Truck size={12} className="text-[#0066cc]" />
                  </div>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={Truck} label="Add Delivery" color="blue" />
              <QuickActionButton icon={CalendarPlus} label="Bulk Schedule" color="emerald" />
              <QuickActionButton icon={UserPlus} label="Assign Delivery Boy" color="purple" />
              <QuickActionButton icon={CheckCircle} label="Mark as Completed" color="green" />
              <QuickActionButton icon={XCircle} label="Mark as Skipped" color="amber" />
              <QuickActionButton icon={Download} label="Export Deliveries" color="slate" />
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
             <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
              {isUp ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
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

function DeliveryRow({ name, phone, address, city, qty, date, dayText, timeSlot, status, dpName, dpAvatar, avatar }: any) {
  const statusMap: any = {
    'Completed': { bg: 'bg-green-50', text: 'text-green-600' },
    'In Progress': { bg: 'bg-blue-50', text: 'text-[#0066cc]' },
    'Pending': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'Skipped': { bg: 'bg-purple-50', text: 'text-purple-600' },
    'Vacation': { bg: 'bg-red-50', text: 'text-red-600' },
  }
  const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-500' }

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
           <span className="text-xs text-slate-700">{address}</span>
           <span className="text-[9px] text-slate-400">{city}</span>
        </div>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-[#0066cc] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{qty}</span>
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-[#0066cc]" />
          <div className="flex flex-col leading-tight">
             <span className="font-bold text-slate-800">{date}</span>
             <span className="text-[9px] text-slate-400">{dayText}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-slate-600">{timeSlot}</span>
      </td>
      <td className="py-3 px-2">
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>{status}</span>
      </td>
      <td className="py-3 px-2">
        {dpName !== '-' ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600 border border-white shadow-sm">
               {dpAvatar}
            </div>
            <span className="text-[10px] font-bold text-slate-600">{dpName}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 ml-3">-</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-[#0066cc] hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100"><Eye size={12}/></button>
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
    green: 'bg-green-50 text-green-600 hover:bg-green-600 border-green-100',
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
