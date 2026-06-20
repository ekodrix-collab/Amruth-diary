'use client'

import { useState, useEffect } from 'react'
import {
  Package, CloudUpload, Download, Filter, Database, AlertTriangle, XCircle, Star, TrendingUp,
  Search, Square, ArrowUpRight, ArrowDownRight, ChevronRight, MoreHorizontal, Edit2, Plus, RefreshCw, Settings, LayoutGrid, FileText
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis
} from 'recharts'

// --- MOCK DATA ---
const salesData = [
  { name: 'A2 Milk', value: 45, color: '#0ea5e9' },
  { name: 'Fresh Paneer', value: 25, color: '#22c55e' },
  { name: 'Pure Ghee', value: 20, color: '#f59e0b' },
  { name: 'Thick Curd', value: 10, color: '#8b5cf6' },
]

const inventoryData = [
  { name: 'A2 Milk', value: 1200 },
  { name: 'Buffalo Milk', value: 850 },
  { name: 'Fresh Paneer', value: 420 },
  { name: 'Pure Ghee', value: 150 },
  { name: 'Thick Curd', value: 310 },
]

const sparklineDataBlue = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 25 }, { v: 20 }, { v: 35 }, { v: 45 }]
const sparklineDataGreen = [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }, { v: 38 }]
const sparklineDataAmber = [{ v: 5 }, { v: 2 }, { v: 4 }, { v: 1 }, { v: 3 }, { v: 5 }, { v: 2 }]
const sparklineDataRed = [{ v: 0 }, { v: 0 }, { v: 1 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }]
const sparklineDataPurple = [{ v: 15 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 35 }]
const sparklineDataSky = [{ v: 150 }, { v: 180 }, { v: 160 }, { v: 200 }, { v: 220 }, { v: 250 }, { v: 280 }]

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <Package size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Products</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Manage your inventory, pricing, and product catalog.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><CloudUpload size={16} /> Import</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Download size={16} /> Export</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-xl text-xs font-bold text-[#0066cc] bg-blue-50 hover:bg-blue-100 shadow-sm transition-all">
            <Filter size={16} /> Filters
            <span className="bg-[#0066cc] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] ml-1">3</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID WITH SPARKLINES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Total Products" value="12" subtext="Active catalog" trend="+ 2" isUp icon={Package} color="blue" sparkData={sparklineDataBlue} />
        <MetricCard title="Total Stock Volume" value="1,248 L" subtext="Available today" trend="+ 4.2%" isUp icon={Database} color="green" sparkData={sparklineDataGreen} />
        <MetricCard title="Low Stock Alerts" value="2" subtext="Needs restock" trend="+ 1" isUp={false} icon={AlertTriangle} color="amber" sparkData={sparklineDataAmber} />
        <MetricCard title="Out of Stock" value="0" subtext="All good" icon={XCircle} color="red" sparkData={sparklineDataRed} />
        <MetricCard title="Top Selling" value="A2 Milk" subtext="45% of sales" icon={Star} color="purple" sparkData={sparklineDataPurple} />
        <MetricCard title="Revenue/Day" value="₹32,450" subtext="vs last week" trend="+ 5.0%" isUp icon={TrendingUp} color="sky" sparkData={sparklineDataSky} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 p-4 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button className="text-xs font-bold text-[#0066cc] border-b-2 border-[#0066cc] pb-4 -mb-4 whitespace-nowrap">All Products</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Active</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Draft</button>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800 pb-4 -mb-4 whitespace-nowrap">Out of Stock</button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search products or SKU..." className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-4 px-4 w-10"><Square size={14} className="text-slate-300"/></th>
                  <th className="py-4 px-2">Product</th>
                  <th className="py-4 px-2">Category</th>
                  <th className="py-4 px-2">SKU</th>
                  <th className="py-4 px-2 text-right">Price</th>
                  <th className="py-4 px-2 text-right">Current Stock</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700 divide-y divide-slate-50">
                <ProductRow name="Pure A2 Cow Milk" unit="1L Bottle" category="Milk" sku="MLK-A2-001" price="₹90.00" stock="450 L" status="In Stock" avatarColor="bg-blue-100 text-blue-600" avatarText="M" />
                <ProductRow name="Fresh Buffalo Milk" unit="1L Pouch" category="Milk" sku="MLK-BF-002" price="₹75.00" stock="280 L" status="In Stock" avatarColor="bg-sky-100 text-sky-600" avatarText="M" />
                <ProductRow name="Farm Fresh Paneer" unit="250g Pack" category="Dairy" sku="D-PNR-250" price="₹120.00" stock="45 Packs" status="Low Stock" isUrgent avatarColor="bg-green-100 text-green-600" avatarText="P" />
                <ProductRow name="Pure Desi Ghee" unit="500ml Jar" category="Premium" sku="PRM-GHE-500" price="₹450.00" stock="120 Jars" status="In Stock" avatarColor="bg-amber-100 text-amber-600" avatarText="G" />
                <ProductRow name="Thick Curd" unit="500g Tub" category="Dairy" sku="D-CRD-500" price="₹60.00" stock="8 Tubs" status="Low Stock" isUrgent avatarColor="bg-purple-100 text-purple-600" avatarText="C" />
                <ProductRow name="Unsalted Butter" unit="200g Pack" category="Dairy" sku="D-BTR-200" price="₹110.00" stock="85 Packs" status="In Stock" avatarColor="bg-yellow-100 text-yellow-600" avatarText="B" />
                <ProductRow name="Raw Honey" unit="250g Bottle" category="Premium" sku="PRM-HNY-250" price="₹220.00" stock="0 Bottles" status="Out of Stock" isUrgent avatarColor="bg-orange-100 text-orange-600" avatarText="H" />
                <ProductRow name="Flavored Milk (Badam)" unit="200ml Bottle" category="Beverage" sku="BEV-BDM-200" price="₹35.00" stock="140 Btls" status="In Stock" avatarColor="bg-rose-100 text-rose-600" avatarText="F" />
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Showing 1 to 8 of 12 products</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed"><ChevronRight size={14} className="rotate-180"/></button>
                <button className="w-7 h-7 rounded-lg border border-[#0066cc] bg-blue-50 text-[#0066cc] flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-slate-50 flex items-center justify-center opacity-50 cursor-not-allowed"><ChevronRight size={14}/></button>
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
          
          {/* Sales Distribution Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Product Sales Distribution</h2>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" stroke="none">
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1 ml-4">
                {salesData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
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

          {/* Inventory Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">Inventory Levels</h2>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} width={80} />
                  <Bar dataKey="value" fill="#0066cc" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Warnings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-800">Low Stock Warnings</h2>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">Action Needed</span>
            </div>
            <div className="space-y-4">
              <WarningRow name="Farm Fresh Paneer" stock="45 Packs" color="amber" />
              <WarningRow name="Thick Curd" stock="8 Tubs" color="amber" />
              <WarningRow name="Raw Honey" stock="0 Bottles" color="red" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={Plus} label="Add Product" color="blue" />
              <QuickActionButton icon={RefreshCw} label="Update Inventory" color="emerald" />
              <QuickActionButton icon={Settings} label="Price Settings" color="purple" />
              <QuickActionButton icon={LayoutGrid} label="Categories" color="amber" />
              <QuickActionButton icon={FileText} label="Inventory Reports" color="sky" />
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

function ProductRow({ name, unit, category, sku, price, stock, status, isUrgent, avatarColor, avatarText }: any) {
  const statusMap: any = {
    'In Stock': { bg: 'bg-green-50', text: 'text-green-600' },
    'Low Stock': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'Out of Stock': { bg: 'bg-red-50', text: 'text-red-600' },
  }
  const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-500' }

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4"><Square size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer transition-colors"/></td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${avatarColor}`}>
            {avatarText}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{name}</span>
            <span className="text-[9px] text-slate-500">{unit}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-slate-600">{category}</span>
      </td>
      <td className="py-3 px-2">
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{sku}</span>
      </td>
      <td className="py-3 px-2 text-right">
        <span className="font-black text-slate-800">{price}</span>
      </td>
      <td className="py-3 px-2 text-right pl-4">
        <span className={`font-black ${isUrgent ? 'text-red-500' : 'text-slate-800'}`}>{stock}</span>
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

function WarningRow({ name, stock, color }: any) {
  const isRed = color === 'red';
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isRed ? 'bg-red-500' : 'bg-amber-500'}`} />
        <span className="text-xs font-bold text-slate-800">{name}</span>
      </div>
      <span className={`text-[10px] font-black ${isRed ? 'text-red-600' : 'text-amber-600'}`}>{stock}</span>
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
