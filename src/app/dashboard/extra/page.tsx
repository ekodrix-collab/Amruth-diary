'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Calendar, ShieldAlert, CheckCircle, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ExtraMilkPage() {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [dailyRate, setDailyRate] = useState(82.6667)
  const [baseQty, setBaseQty] = useState(1.0)
  
  // Inputs
  const [orderDate, setOrderDate] = useState('')
  const [extraLitres, setExtraLitres] = useState<number>(0.5) // 0.5, 1.0, 1.5
  const [estimatedCharge, setEstimatedCharge] = useState(0)

  // Load dashboard data
  async function loadData() {
    try {
      setPageLoading(true)
      const res = await fetch('/api/customer/dashboard')
      const json = await res.json()
      if (json.success) {
        if (json.subscription) {
          setDailyRate(json.subscription.daily_rate)
          setBaseQty(json.subscription.quantity_litres || 1.0)
        }
      } else {
        setError(json.message || 'Failed to retrieve subscription details')
      }
    } catch (err) {
      setError('Network error loading page data')
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Default date is tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setOrderDate(tomorrow.toISOString().split('T')[0])
  }, [])

  // Calculate charge amount live: daily_rate * (extra_litres / base_litres)
  useEffect(() => {
    if (baseQty <= 0) return
    const charge = Math.round((dailyRate * (extraLitres / baseQty)) * 100) / 100
    setEstimatedCharge(charge)
  }, [extraLitres, dailyRate, baseQty])

  async function handleExtraSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orderDate || extraLitres === undefined) {
      setError('Please choose a date and quantity.')
      return
    }

    const selected = new Date(orderDate)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0)

    if (selected < tomorrow) {
      setError('Order date must be tomorrow or later.')
      return
    }

    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/extra-milk/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_date: orderDate,
          extra_litres: extraLitres
        })
      })
      const json = await res.json()
      if (json.success) {
        setSuccessMsg(json.message || `Confirmed extra ${extraLitres}L for ${orderDate}!`)
      } else {
        setError(json.message || 'Failed to request extra milk')
      }
    } catch (err) {
      setError('Network error submitting request')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="max-w-xl space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-cream-200 rounded-lg" />
        <div className="h-44 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Order Extra Milk</h1>
        <p className="text-xs font-semibold text-brown-600">Need more milk tomorrow? Add a one-time extra order to your delivery.</p>
      </div>

      {/* Info Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-xs font-black text-brown-800 uppercase tracking-wider">9:00 PM Ordering Deadline</h4>
          <p className="text-xs font-semibold text-brown-600 mt-1 leading-relaxed">
            Extra orders must be placed before 9:00 PM on the previous night. Booking is subject to daily farm capacity.
          </p>
        </div>
      </div>

      {/* Main card */}
      <form onSubmit={handleExtraSubmit} className="bg-warm-white border border-border/80 rounded-2xl p-5 sm:p-7 shadow-shadow shadow-sm space-y-6">
        
        {/* Date Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Select Delivery Date</label>
          <div className="flex items-center h-11 rounded-xl border border-border bg-cream-50/20 px-3 gap-2">
            <Calendar size={15} className="text-brown-400" />
            <input
              type="date"
              required
              value={orderDate}
              min={(() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow.toISOString().split('T')[0]
              })()}
              onChange={(e) => {
                setOrderDate(e.target.value)
                setError('')
                setSuccessMsg('')
              }}
              className="flex-1 h-full bg-transparent text-xs font-bold text-brown-800 outline-none"
            />
          </div>
        </div>

        {/* Litres Selector cards */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Choose Extra Litres</label>
          <div className="grid grid-cols-3 gap-3">
            {[0.5, 1.0, 1.5].map((litres) => (
              <button
                key={litres}
                type="button"
                onClick={() => {
                  setExtraLitres(litres)
                  setError('')
                  setSuccessMsg('')
                }}
                className={`h-20 rounded-xl border flex flex-col items-center justify-center p-3 gap-1.5 transition-all ${
                  extraLitres === litres
                    ? 'border-amber-500 bg-cream-100/60 ring-2 ring-cream-200 text-brown-800'
                    : 'border-border bg-cream-50/10 hover:bg-cream-50/20 text-brown-700'
                }`}
              >
                <span className="text-lg font-black leading-none">+{litres}L</span>
                <span className="text-[9px] font-bold text-brown-400">Extra Milk</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cost Summary Preview */}
        {extraLitres > 0 && (
          <div className="bg-cream-100/40 border border-border/80 rounded-xl p-4 space-y-2.5 text-xs font-bold text-brown-600">
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <span>Your regular delivery:</span>
              <span className="font-extrabold text-brown-800">{baseQty} Litres</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <span>Tomorrow&apos;s total:</span>
              <span className="font-extrabold text-amber-600">{(baseQty + extraLitres)} Litres</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Info size={14} className="text-amber-500" /> Extra Charge:</span>
              <span className="font-extrabold text-amber-600 font-mono">₹{estimatedCharge.toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 font-bold flex items-center gap-1.5">
            <ShieldAlert size={14} /> {error}
          </p>
        )}

        {successMsg && (
          <p className="text-xs text-green-600 font-bold flex items-center gap-1.5">
            <CheckCircle size={14} /> {successMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !orderDate}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-bold text-xs shadow-sm transition-all border-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-brown-800 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <PlusCircle size={14} />
              <span>Confirm Order Extra</span>
            </>
          )}
        </button>

      </form>

    </div>
  )
}
