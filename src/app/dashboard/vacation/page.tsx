'use client'

import { useState, useEffect } from 'react'
import { Palmtree, Calendar, CreditCard, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface VacationPause {
  pause_start: string;
  pause_end: string;
  total_days: number;
  total_credit: number;
  resume_date: string;
  status: string;
}

export default function VacationPausePage() {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [dailyRate, setDailyRate] = useState(82.6667)
  const [vacationList, setVacationList] = useState<VacationPause[]>([])
  
  // Inputs
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Calculations
  const [totalDays, setTotalDays] = useState(0)
  const [creditPreview, setCreditPreview] = useState(0)
  const [resumeDate, setResumeDate] = useState('')

  // Load dashboard data
  async function loadData() {
    try {
      setPageLoading(true)
      const res = await fetch('/api/customer/dashboard')
      const json = await res.json()
      if (json.success) {
        if (json.subscription) {
          setDailyRate(json.subscription.daily_rate)
        }
        // Active vacation pauses
        if (json.active_vacation) {
          setVacationList([json.active_vacation])
        } else {
          setVacationList([])
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
    
    // Set default dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    setStartDate(tomorrowStr)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 4)
    setEndDate(nextWeek.toISOString().split('T')[0])
  }, [])

  // Calculate pause values live when inputs change
  useEffect(() => {
    if (!startDate || !endDate) {
      setTotalDays(0)
      setCreditPreview(0)
      setResumeDate('')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
      setTotalDays(0)
      setCreditPreview(0)
      setResumeDate('')
      return
    }

    // Days calculation: inclusive of start and end date
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    setTotalDays(diffDays)
    setCreditPreview(Math.round(diffDays * dailyRate * 100) / 100)
    
    // Resume date is day after end date
    const resume = new Date(endDate)
    resume.setDate(resume.getDate() + 1)
    setResumeDate(resume.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))

  }, [startDate, endDate, dailyRate])

  async function handleVacationSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0)

    if (start < tomorrow) {
      setError('Vacation must start tomorrow or later.')
      return
    }

    if (end < start) {
      setError('End date must be on or after start date.')
      return
    }

    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/vacation/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pause_start: startDate,
          pause_end: endDate
        })
      })
      const json = await res.json()
      if (json.success) {
        setSuccessMsg(json.message || 'Vacation pause confirmed successfully!')
        // Reload values
        await loadData()
      } else {
        setError(json.message || 'Failed to request vacation pause')
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
        <div className="h-32 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Vacation Pause</h1>
        <p className="text-xs font-semibold text-brown-600">Pause your daily deliveries while you are away from home.</p>
      </div>

      {/* Deadline Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-xs font-black text-brown-800 uppercase tracking-wider">Vacation Delivery Rules</h4>
          <p className="text-xs font-semibold text-brown-600 mt-1 leading-relaxed">
            Vacation pauses must be registered at least one day in advance. The vacation pause cannot start today. Delivery will auto-resume the day after your vacation ends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column - Pause Form (3/5) */}
        <div className="md:col-span-3 space-y-5">
          <form onSubmit={handleVacationSubmit} className="bg-warm-white border border-border/80 rounded-2xl p-5 shadow-shadow shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Pause Start Date</label>
                <div className="flex items-center h-11 rounded-xl border border-border bg-cream-50/20 px-3 gap-2">
                  <Calendar size={15} className="text-brown-400" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={(() => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      return tomorrow.toISOString().split('T')[0]
                    })()}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      setError('')
                      setSuccessMsg('')
                    }}
                    className="flex-1 h-full bg-transparent text-xs font-bold text-brown-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Pause End Date</label>
                <div className="flex items-center h-11 rounded-xl border border-border bg-cream-50/20 px-3 gap-2">
                  <Calendar size={15} className="text-brown-400" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate || (() => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      return tomorrow.toISOString().split('T')[0]
                    })()}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      setError('')
                      setSuccessMsg('')
                    }}
                    className="flex-1 h-full bg-transparent text-xs font-bold text-brown-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation preview card */}
            {totalDays > 0 && (
              <div className="bg-cream-100/40 border border-border/80 rounded-xl p-5 space-y-3.5 animate-fade-in text-xs font-bold text-brown-600">
                <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                  <span>Total Vacation Days:</span>
                  <span className="font-extrabold text-brown-800 font-mono text-sm">{totalDays} days</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                  <span>Total Credit Accrued:</span>
                  <span className="font-extrabold text-green-600 font-mono text-sm">₹{creditPreview.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Milk Resumes:</span>
                  <span className="font-extrabold text-amber-600 text-sm">{resumeDate}</span>
                </div>
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
              disabled={loading || totalDays <= 0}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-bold text-xs shadow-sm transition-all border-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-brown-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Palmtree size={14} />
                  <span>Confirm Vacation Pause</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Existing Vacations (2/5) */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Scheduled Pauses</h3>
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm p-4 space-y-3">
            {vacationList.length === 0 ? (
              <p className="text-xs text-brown-400 font-semibold py-8 text-center">
                No vacation pauses currently active or scheduled.
              </p>
            ) : (
              <div className="space-y-2">
                {vacationList.map((vac, i) => (
                  <div key={i} className="bg-cream-50/40 border border-border/40 rounded-xl p-4 text-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Scheduled Pause</span>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Confirmed</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-brown-800">
                        {new Date(vac.pause_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(vac.pause_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[10px] text-brown-400 font-bold mt-1">
                        Resumes: {vac.resume_date ? new Date(vac.resume_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Next day'}
                      </p>
                    </div>
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
