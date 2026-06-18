'use client'

import { useState, useEffect } from 'react'
import { SkipForward, Calendar, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface UpcomingSkip {
  skip_date: string;
  credit_amount: number;
}

export default function SkipDayPage() {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  
  const [dailyRate, setDailyRate] = useState(82.6667)
  const [upcomingSkips, setUpcomingSkips] = useState<UpcomingSkip[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [dateList, setDateList] = useState<Array<{ dateStr: string; label: string; weekday: string; isAllowed: boolean; reason?: string }>>([])

  // Load dashboard data to get daily rate and upcoming skips
  async function loadData() {
    try {
      setPageLoading(true)
      const res = await fetch('/api/customer/dashboard')
      const json = await res.json()
      if (json.success) {
        if (json.subscription) {
          setDailyRate(json.subscription.daily_rate)
        }
        setUpcomingSkips(json.upcoming_skips || [])
        generateDates(json.upcoming_skips || [])
      } else {
        setError(json.message || 'Failed to retrieve subscription details')
      }
    } catch (err) {
      setError('Network error loading page data')
    } finally {
      setPageLoading(false)
    }
  }

  // Generate skip options (next 14 days)
  function generateDates(existingSkips: UpcomingSkip[]) {
    const list = []
    const now = new Date()
    const currentHour = now.getHours()
    
    // Skip deadline is 9 PM (21:00) previous day
    // So if today is June 16, and current time is > 21:00 (9 PM), 
    // skipping June 17 is NOT allowed. Only June 18 and later.
    
    for (let i = 1; i <= 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      
      const dateStr = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' })
      
      let isAllowed = true
      let reason = ''
      
      // If the date is tomorrow, check if we passed 9 PM tonight
      if (i === 1 && currentHour >= 21) {
        isAllowed = false
        reason = 'Passed 9 PM deadline'
      }

      // Check if already skipped
      const isAlreadySkipped = existingSkips.some(s => s.skip_date === dateStr)
      if (isAlreadySkipped) {
        isAllowed = false
        reason = 'Already skipped'
      }

      list.push({
        dateStr,
        label,
        weekday,
        isAllowed,
        reason
      })
    }
    setDateList(list)
    
    // Auto-select first allowed date
    const firstAllowed = list.find(item => item.isAllowed)
    if (firstAllowed) {
      setSelectedDate(firstAllowed.dateStr)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSkipSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate) {
      setError('Please select a date to skip.')
      return
    }
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/skip/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skip_date: selectedDate })
      })
      const json = await res.json()
      if (json.success) {
        setSuccessMsg(json.message || `Skip confirmed for ${selectedDate}!`)
        setSelectedDate('')
        // Refresh statistics
        await loadData()
      } else {
        setError(json.message || 'Failed to submit skip request')
      }
    } catch (err) {
      setError('Network error submitting skip request')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="max-w-xl space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-cream-200 rounded-lg" />
        <div className="h-40 bg-cream-200 rounded-3xl" />
        <div className="h-32 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Skip Milk Delivery</h1>
        <p className="text-xs font-semibold text-brown-600">Request to skip delivery on specific upcoming days.</p>
      </div>

      {/* 9 PM Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-xs font-black text-brown-800 uppercase tracking-wider">9:00 PM Daily Deadline</h4>
          <p className="text-xs font-semibold text-brown-600 mt-1 leading-relaxed">
            Skips must be requested before 9 PM on the night before delivery. Skips for tomorrow are locked after 9 PM tonight as milk preparation is finalized.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column - Form & Date selector (3/5) */}
        <div className="md:col-span-3 space-y-5">
          <form onSubmit={handleSkipSubmit} className="bg-warm-white border border-border/80 rounded-2xl p-5 shadow-shadow shadow-sm space-y-5">
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Select Skip Date</label>
              
              <div className="grid grid-cols-3 gap-2.5">
                {dateList.map((item) => (
                  <button
                    key={item.dateStr}
                    type="button"
                    disabled={!item.isAllowed}
                    onClick={() => {
                      setSelectedDate(item.dateStr)
                      setError('')
                      setSuccessMsg('')
                    }}
                    className={`h-16 rounded-xl border flex flex-col items-center justify-center p-2.5 gap-0.5 transition-all ${
                      selectedDate === item.dateStr
                        ? 'border-amber-500 bg-cream-100/60 ring-2 ring-cream-200 text-brown-800'
                        : !item.isAllowed
                        ? 'border-border/40 bg-cream-50/10 text-brown-400 opacity-60 cursor-not-allowed'
                        : 'border-border bg-cream-50/10 hover:bg-cream-50/20 text-brown-700'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-brown-400">{item.weekday}</span>
                    <span className="text-sm font-black leading-none">{item.label}</span>
                    {!item.isAllowed && (
                      <span className="text-[8px] font-semibold text-red-400 mt-0.5 truncate max-w-full">
                        {item.reason === 'Already skipped' ? 'Skipped' : 'Locked'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Preview Block */}
            {selectedDate && (
              <div className="bg-cream-100/40 border border-border/80 rounded-xl p-4 flex items-center justify-between text-xs font-semibold text-brown-600">
                <span className="flex items-center gap-1.5"><Info size={14} className="text-amber-500" /> Credit Preview:</span>
                <span className="font-black text-amber-600 font-mono">₹{dailyRate.toFixed(2)} added to next bill</span>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-1.5">
                <AlertTriangle size={14} /> {error}
              </p>
            )}

            {successMsg && (
              <p className="text-xs text-green-600 font-bold flex items-center gap-1.5">
                <CheckCircle size={14} /> {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !selectedDate}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-bold text-xs shadow-sm transition-all border-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-brown-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <SkipForward size={14} />
                  <span>Confirm Skip Request</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Upcoming skips log (2/5) */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Confirmed Skips</h3>
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm p-4 space-y-3">
            {upcomingSkips.length === 0 ? (
              <p className="text-xs text-brown-400 font-semibold py-8 text-center">
                No upcoming skips confirmed.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {upcomingSkips.map((skip, i) => (
                  <div key={i} className="flex justify-between items-center bg-cream-50/40 border border-border/40 rounded-xl p-3 text-xs">
                    <div>
                      <p className="font-black text-brown-800">
                        {new Date(skip.skip_date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                      <p className="text-[10px] text-brown-400 font-bold mt-0.5">Skip confirmed</p>
                    </div>
                    <span className="font-black text-green-600 font-mono">+₹{skip.credit_amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
