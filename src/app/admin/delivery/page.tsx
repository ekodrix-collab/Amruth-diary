'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Check,
  Printer,
  Download,
  Milk,
  RefreshCw,
  Truck
} from 'lucide-react'
import { cn } from '@/lib/utils'

type CustomerStatus = 'Deliver' | 'Skip' | 'Extra' | 'Vacation'

interface Customer {
  id: string
  initials: string
  name: string
  area: string
  address: string
  qty: string
  amount: string
  status: CustomerStatus
  statusClass: string
}

export default function AdminDeliveryPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [areaFilter, setAreaFilter] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    // Default to today's date
    setSelectedDate(new Date().toISOString().split('T')[0])
  }, [])

  // Fetch Delivery manifest list
  async function fetchDeliveries() {
    if (!selectedDate) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/delivery/${selectedDate}`)
      const json = await res.json()
      
      if (json.success && json.deliveries) {
        const mapped = json.deliveries.map((d: any) => ({
          id: d.id,
          initials: d.customer_name?.substring(0, 2).toUpperCase() || 'CU',
          name: d.customer_name || 'Unknown Customer',
          area: d.area || 'Unknown',
          address: d.address || 'No street address saved',
          qty: d.is_skip || d.is_vacation ? '0L' : (d.is_extra ? `${d.regular_litres}L + ${d.extra_litres}L` : `${d.regular_litres}L`),
          amount: 'Billed Monthly',
          status: d.is_skip ? 'Skip' : d.is_vacation ? 'Vacation' : d.is_extra ? 'Extra' : 'Deliver',
          statusClass: d.is_skip ? 'bg-red-50 text-red-500 border-red-200' : 
                       d.is_vacation ? 'bg-amber-50 text-amber-600 border-amber-200' :
                       d.is_extra ? 'bg-blue-50 text-blue-500 border-blue-200' :
                       'bg-green-50 text-green-600 border-green-200'
        }))
        setCustomers(mapped)
      }
    } catch (err) {
      console.error('Failed to load delivery runsheet', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [selectedDate])

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter
    const matchesArea = areaFilter === 'All' || c.area === areaFilter

    return matchesSearch && matchesStatus && matchesArea
  })

  // Unique areas for drop filter
  const areas = ['All', ...Array.from(new Set(customers.map(c => c.area)))]

  // Calculate sum of milk litres for delivering entries
  const totalMilkLitres = customers.reduce((acc, c) => {
    if (c.status === 'Skip' || c.status === 'Vacation') return acc
    // Extract numbers from string, e.g. "1.0L" or "1.0L + 0.5L"
    const matches = c.qty.match(/(\d+(\.\d+)?)/g)
    if (matches) {
      const sum = matches.reduce((s, m) => s + parseFloat(m), 0)
      return acc + sum
    }
    return acc
  }, 0)

  if (isLoading) {
    return (
      <div className="max-w-6xl space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-cream-200 rounded-xl" />
        <div className="h-64 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      
      {/* Upper header action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Today&apos;s Run Manifest</h1>
          <p className="text-xs font-semibold text-brown-600">Daily checklist for delivery agents and packaging teams.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-border bg-warm-white text-xs font-bold text-brown-800 outline-none"
          />
          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-xl border border-border bg-warm-white hover:bg-cream-50 text-brown-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Manifest</span>
          </button>
          <button
            onClick={() => alert('Downloading CSV Run Manifest...')}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-brown-800 font-bold text-xs shadow-sm border-none cursor-pointer flex items-center gap-1.5 hover:scale-[1.01] transition-transform"
          >
            <Download size={14} />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Block */}
      <div className="bg-warm-white border border-border/80 rounded-[24px] shadow-shadow shadow-sm overflow-hidden">
        
        {/* Filter controls header */}
        <div className="p-5 border-b border-border/40 bg-cream-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-brown-800">Delivery Checklist</h3>
            <p className="text-[10px] text-brown-400 font-bold mt-0.5">Filter and verify client routing states</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, street..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-60 h-10 pl-4 pr-4 border border-border bg-warm-white rounded-xl text-xs font-bold text-brown-800 placeholder:text-brown-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-cream-200 transition-all"
              />
            </div>

            {/* Filter by Status */}
            <div className="h-10 px-3.5 border border-border rounded-xl bg-warm-white flex items-center gap-1.5 text-xs font-bold text-brown-600">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer text-brown-800"
              >
                <option value="All">All Statuses</option>
                <option value="Deliver">Deliver</option>
                <option value="Skip">Skip</option>
                <option value="Extra">Extra</option>
                <option value="Vacation">Vacation</option>
              </select>
            </div>

            {/* Filter by Area */}
            <div className="h-10 px-3.5 border border-border rounded-xl bg-warm-white flex items-center gap-1.5 text-xs font-bold text-brown-600">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer text-brown-800"
              >
                <option value="All">All Areas</option>
                {areas.filter(a => a !== 'All').map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customer Manifest list table */}
        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="p-16 text-center text-xs font-bold text-brown-400">
              No matching records found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-50/10 border-b border-border/40">
                  {['Customer Detail', 'Route Zone', 'Quantity', 'Street Address', 'Status', 'Verification'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-[10px] font-black text-brown-600 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredCustomers.map((c, index) => (
                  <tr key={c.id || index} className="hover:bg-cream-50/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cream-200 text-brown-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0 border border-border">
                          {c.initials}
                        </div>
                        <div>
                          <span className="text-xs font-black text-brown-800 block leading-tight">{c.name}</span>
                          <span className="text-[9px] text-brown-400 font-bold block mt-0.5">UID #{c.id ? c.id.substring(0, 8) : 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brown-600">{c.area}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Milk size={13} className="text-amber-500" />
                        <span className="text-xs font-black text-brown-800 font-mono">{c.qty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-brown-600 font-semibold max-w-[200px] truncate" title={c.address}>
                      {c.address}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        c.status === 'Deliver' ? 'bg-green-50 text-green-600 border-green-200' :
                        c.status === 'Skip' ? 'bg-red-50 text-red-500 border-red-200' :
                        c.status === 'Extra' ? 'bg-blue-50 text-blue-500 border-blue-200' :
                        'bg-amber-50 text-amber-600 border-amber-200'
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.status === 'Deliver' || c.status === 'Extra' ? (
                        <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-lg w-fit select-none">
                          <Check size={14} /> Ready
                        </span>
                      ) : (
                        <span className="text-[10px] text-brown-400 font-semibold bg-cream-50 border border-border/80 px-2 py-1 rounded-lg w-fit select-none">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Runsheet statistics footer */}
        <div className="px-6 py-4 bg-cream-50/20 border-t border-border/40 flex justify-between items-center text-xs font-bold text-brown-600">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-brown-800 flex items-center justify-center shadow-sm">🥛</span>
            <span>Total delivery load today:</span>
            <span className="font-extrabold text-amber-600 font-mono text-sm">{totalMilkLitres.toFixed(1)} Litres</span>
          </div>
          <p className="text-[10px] font-black text-brown-400 uppercase tracking-widest">
            Showing {filteredCustomers.length} of {customers.length} Manifest entries
          </p>
        </div>

      </div>

    </div>
  )
}
