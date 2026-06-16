'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Phone, MapPin, Milk, AlertCircle, X, Check, Eye } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

interface CustomerProfile {
  id: string
  full_name: string
  phone: string
  address: string
  area: string
  landmark?: string
  floor_notes?: string
  subscriptions: Array<{
    id: string
    status: string
    quantity_litres: number
    balance: number
  }> | null
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Paused' | 'None'>('All')

  // Selected customer details modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)

  async function loadCustomers() {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          address,
          area,
          landmark,
          floor_notes,
          subscriptions (
            id,
            status,
            quantity_litres,
            balance
          )
        `)
        .eq('role', 'customer')
        .order('full_name', { ascending: true })

      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setCustomers(data as any[])
      }
    } catch (err) {
      setError('An unexpected error occurred loading directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  // Filter logic
  const filtered = customers.filter(c => {
    const activeSub = c.subscriptions && c.subscriptions.length > 0 ? c.subscriptions[0] : null
    
    // Status match
    let matchesStatus = true
    if (statusFilter === 'Active') {
      matchesStatus = !!activeSub && activeSub.status === 'active'
    } else if (statusFilter === 'Paused') {
      matchesStatus = !!activeSub && activeSub.status === 'paused'
    } else if (statusFilter === 'None') {
      matchesStatus = !activeSub
    }

    // Search match
    const query = searchQuery.toLowerCase()
    const matchesSearch = 
      c.full_name.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.area.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })

  // Summary counts
  const totalCount = customers.length
  const activeCount = customers.filter(c => c.subscriptions?.[0]?.status === 'active').length
  const pausedCount = customers.filter(c => c.subscriptions?.[0]?.status === 'paused').length
  const noneCount = customers.filter(c => !c.subscriptions || c.subscriptions.length === 0).length

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Customer Directory</h1>
        <p className="text-xs font-semibold text-brown-600">Browse profile information, balances, and delivery settings.</p>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-warm-white border border-border/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider mb-0.5">Total Registered</p>
          <p className="text-xl font-black text-brown-800 font-mono">{totalCount}</p>
        </div>
        <div className="bg-warm-white border border-border/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-0.5">Active Subscribers</p>
          <p className="text-xl font-black text-green-600 font-mono">{activeCount}</p>
        </div>
        <div className="bg-warm-white border border-border/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-0.5">Paused Subscriptions</p>
          <p className="text-xl font-black text-amber-600 font-mono">{pausedCount}</p>
        </div>
        <div className="bg-warm-white border border-border/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-black text-brown-500 uppercase tracking-wider mb-0.5">Not Subscribed</p>
          <p className="text-xl font-black text-brown-800 font-mono">{noneCount}</p>
        </div>
      </div>

      {/* Table controls */}
      <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-cream-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search name, phone, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 h-10 pl-4 pr-4 border border-border bg-warm-white rounded-xl text-xs font-bold text-brown-800 placeholder:text-brown-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-cream-200 transition-all"
            />
          </div>

          {/* Filter toggle buttons */}
          <div className="flex items-center gap-2">
            {(['All', 'Active', 'Paused', 'None'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "h-9 px-3.5 rounded-lg text-xs font-bold transition-all border border-border cursor-pointer",
                  statusFilter === status 
                    ? "bg-amber-400 text-brown-800 border-amber-400" 
                    : "bg-warm-white text-brown-600 hover:bg-cream-50"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-brown-400">
              Loading directory...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-brown-400">
              No matching profiles found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-50/10 border-b border-border/40">
                  {['Customer', 'Phone', 'Locality', 'Quantity', 'Balance Due', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-[10px] font-black text-brown-600 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((c) => {
                  const activeSub = c.subscriptions && c.subscriptions.length > 0 ? c.subscriptions[0] : null
                  const balance = activeSub?.balance || 0
                  return (
                    <tr key={c.id} className="hover:bg-cream-50/10 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-brown-800 block leading-tight">{c.full_name}</span>
                        <span className="text-[9px] text-brown-400 font-bold block mt-0.5">UID #{c.id.substring(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-brown-600 flex items-center gap-1">
                        <Phone size={11} className="text-brown-400" /> {c.phone}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-brown-600">{c.area}</td>
                      <td className="px-6 py-4">
                        {activeSub ? (
                          <span className="text-xs font-black text-brown-800 font-mono">{activeSub.quantity_litres} Litres / Day</span>
                        ) : (
                          <span className="text-[10px] font-bold text-brown-400">No active plan</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-black">
                        {activeSub ? (
                          balance >= 0 ? (
                            <span className="text-green-600">₹{balance.toFixed(2)} Credit</span>
                          ) : (
                            <span className="text-red-500">₹{Math.abs(balance).toFixed(2)} Due</span>
                          )
                        ) : (
                          <span className="text-brown-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="h-8 w-8 rounded-lg bg-cream-100 hover:bg-cream-200 border border-border text-brown-600 flex items-center justify-center cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#292524]/40 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          
          <div className="bg-warm-white border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-black text-brown-800 font-display">{selectedCustomer.full_name}</h3>
                <p className="text-[10px] text-brown-400 font-bold">Client Profile Summary</p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded bg-cream-100 border border-border text-brown-600 bg-transparent"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-brown-600 font-semibold">
              <div className="bg-cream-50/50 border border-border/60 rounded-xl p-4 space-y-2.5">
                <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Delivery Instructions</p>
                <div>
                  <p className="text-brown-400 text-[9px] uppercase tracking-wider">Locality Zone</p>
                  <p className="text-brown-800 font-bold">{selectedCustomer.area}</p>
                </div>
                <div>
                  <p className="text-brown-400 text-[9px] uppercase tracking-wider">Street address</p>
                  <p className="text-brown-800 font-bold leading-relaxed">{selectedCustomer.address}</p>
                </div>
                {selectedCustomer.landmark && (
                  <div>
                    <p className="text-brown-400 text-[9px] uppercase tracking-wider">Landmark</p>
                    <p className="text-brown-800 font-bold">{selectedCustomer.landmark}</p>
                  </div>
                )}
                {selectedCustomer.floor_notes && (
                  <div>
                    <p className="text-brown-400 text-[9px] uppercase tracking-wider">Floor notes</p>
                    <p className="text-brown-800 font-bold">{selectedCustomer.floor_notes}</p>
                  </div>
                )}
              </div>

              {selectedCustomer.subscriptions?.[0] && (
                <div className="bg-cream-100/40 border border-border/80 rounded-xl p-4 space-y-2.5">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Subscription Ledger</p>
                  <div className="flex justify-between">
                    <span>Plan Quantity:</span>
                    <span className="text-brown-800 font-black">{selectedCustomer.subscriptions[0].quantity_litres} Litres / Day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accrued Balance:</span>
                    <span className={cn(
                      "font-black font-mono",
                      selectedCustomer.subscriptions[0].balance >= 0 ? "text-green-600" : "text-red-500"
                    )}>
                      ₹{selectedCustomer.subscriptions[0].balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-brown-800 font-bold text-xs border-none cursor-pointer"
            >
              Close Profile View
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
