'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Search, ArrowUpRight, ArrowDownRight, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

interface BillingMonth {
  id: string
  billing_month: string
  monthly_amount: number
  amount_paid: number
  net_due: number
  payment_status: string
  profiles: {
    full_name: string
    phone: string
  } | null
}

export default function AdminBillingPage() {
  const [bills, setBills] = useState<BillingMonth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Totals
  const [revenue, setRevenue] = useState(0)
  const [dues, setDues] = useState(0)
  const [credits, setCredits] = useState(0)

  async function loadBills() {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch bills
      const { data, error: fetchError } = await supabase
        .from('billing_months')
        .select(`
          id,
          billing_month,
          monthly_amount,
          amount_paid,
          net_due,
          payment_status,
          skip_credit,
          pause_credit,
          profiles (
            full_name,
            phone
          )
        `)
        .order('net_due', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setBills(data as any[])
        
        // Calculate totals
        let totalRev = 0
        let totalDues = 0
        let totalCreds = 0

        data.forEach((b: any) => {
          totalRev += Number(b.amount_paid || 0)
          totalDues += Number(b.net_due || 0)
          totalCreds += (Number(b.skip_credit || 0) + Number(b.pause_credit || 0))
        })

        setRevenue(totalRev)
        setDues(totalDues)
        setCredits(totalCreds)
      }
    } catch (err) {
      setError('An unexpected error occurred loading billing ledger.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBills()
  }, [])

  async function handleMarkPaid(billId: string, netDue: number) {
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('billing_months')
        .update({
          payment_status: 'paid',
          amount_paid: netDue,
          net_due: 0
        })
        .eq('id', billId)

      if (updateError) {
        alert('Failed to update payment status: ' + updateError.message)
      } else {
        await loadBills()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredBills = bills.filter(b => {
    const name = b.profiles?.full_name?.toLowerCase() || ''
    const phone = b.profiles?.phone || ''
    const query = searchQuery.toLowerCase()
    return name.includes(query) || phone.includes(query)
  })

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Billing & Invoices</h1>
          <p className="text-xs font-semibold text-brown-600">Track collections, client outstanding balances, and monthly statements.</p>
        </div>
        <button 
          onClick={loadBills}
          className="h-10 px-4 rounded-xl border border-border bg-warm-white hover:bg-cream-50 text-brown-600 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Refresh ledger</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-warm-white border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider mb-1">Total Revenue Collected</p>
            <p className="text-2xl font-black text-green-600 font-mono tracking-tight">₹{revenue.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="bg-warm-white border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider mb-1">Outstanding Dues</p>
            <p className="text-2xl font-black text-red-500 font-mono tracking-tight">₹{dues.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <ArrowDownRight size={18} />
          </div>
        </div>

        <div className="bg-warm-white border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-brown-400 uppercase tracking-wider mb-1">Total Credits Issued</p>
            <p className="text-2xl font-black text-blue-600 font-mono tracking-tight">₹{credits.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard size={18} />
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-warm-white border border-border/80 rounded-[24px] shadow-shadow shadow-sm overflow-hidden">
        
        {/* Table controls */}
        <div className="p-5 border-b border-border/40 bg-cream-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-black text-brown-800">Subscriber Accounts Ledger</h3>
          <input
            type="text"
            placeholder="Search name, phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-60 h-10 pl-4 pr-4 border border-border bg-warm-white rounded-xl text-xs font-bold text-brown-800 placeholder:text-brown-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-cream-200 transition-all"
          />
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-brown-400">
              Loading ledger...
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-brown-400">
              No invoice records matching criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-50/10 border-b border-border/40">
                  {['Customer Name', 'Billing Month', 'Monthly Amount', 'Net Balance Due', 'Payment Status', 'Action'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-[10px] font-black text-brown-600 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-cream-50/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-brown-800 block leading-tight">{b.profiles?.full_name || 'Deleted Account'}</span>
                      <span className="text-[9px] text-brown-400 font-bold block mt-0.5">{b.profiles?.phone || 'No phone'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brown-600">
                      {new Date(b.billing_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-brown-800 font-mono">
                      ₹{b.monthly_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-brown-800 font-mono">
                      ₹{b.net_due.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        b.payment_status === 'paid' ? "bg-green-50 text-green-600 border-green-200" :
                        b.payment_status === 'carry_forward' ? "bg-blue-50 text-blue-600 border-blue-200" :
                        "bg-red-50 text-red-500 border-red-200"
                      )}>
                        {b.payment_status === 'paid' ? 'Paid' : b.payment_status === 'carry_forward' ? 'Carried forward' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.payment_status !== 'paid' && b.net_due > 0 ? (
                        <button
                          onClick={() => handleMarkPaid(b.id, b.net_due)}
                          className="h-8 px-3 rounded-lg bg-green-50 hover:bg-green-600 text-green-600 hover:text-white border border-green-200 flex items-center gap-1 cursor-pointer transition-all text-xs font-bold active:scale-95"
                        >
                          <Check size={12} />
                          <span>Mark Paid</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-brown-400 font-bold flex items-center gap-1 select-none">
                          <Check size={12} /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  )
}
