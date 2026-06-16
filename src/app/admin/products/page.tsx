'use client'

import { useState, useEffect } from 'react'
import { Package, Calendar, Edit3, Save, ShieldAlert, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

interface DailyCapacity {
  id: string
  date: string
  total_litres: number
  booked_litres: number
}

export default function AdminCapacityPage() {
  const [capacities, setCapacities] = useState<DailyCapacity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  
  // Inputs
  const [selectedDate, setSelectedDate] = useState('')
  const [capacityLitres, setCapacityLitres] = useState<number>(1000)
  const [isUpdating, setIsUpdating] = useState(false)

  // Load upcoming capacities
  async function loadCapacities() {
    try {
      setLoading(true)
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]

      const { data, error: fetchError } = await supabase
        .from('daily_capacity')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(15)

      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setCapacities(data)
      }
    } catch (err) {
      setError('An unexpected error occurred loading capacities.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCapacities()
    
    // Default selected date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split('T')[0])
  }, [])

  // Auto-fill capacity input if selecting a date that already has capacity
  useEffect(() => {
    if (!selectedDate) return
    const match = capacities.find(c => c.date === selectedDate)
    if (match) {
      setCapacityLitres(match.total_litres)
    } else {
      setCapacityLitres(1000) // Default fallback
    }
  }, [selectedDate, capacities])

  async function handleCapacityUpsert(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !capacityLitres || capacityLitres <= 0) {
      setError('Please provide a valid date and capacity quantity.')
      return
    }

    setError('')
    setSuccessMsg('')
    setIsUpdating(true)

    try {
      const supabase = createClient()
      
      // Upsert to daily_capacity table
      // If a row with same date exists, update it, else insert
      const { data: match } = await supabase
        .from('daily_capacity')
        .select('id, booked_litres')
        .eq('date', selectedDate)
        .maybeSingle()

      const booked = match?.booked_litres || 0

      if (capacityLitres < booked) {
        setError(`Cannot reduce capacity below already booked amount of ${booked} Litres.`)
        setIsUpdating(false)
        return
      }

      const { error: upsertError } = await supabase
        .from('daily_capacity')
        .upsert({
          date: selectedDate,
          total_litres: capacityLitres,
          booked_litres: booked
        }, { onConflict: 'date' })

      if (upsertError) {
        setError(upsertError.message)
      } else {
        setSuccessMsg(`Capacity updated to ${capacityLitres}L for ${selectedDate}!`)
        await loadCapacities()
      }

    } catch (err) {
      setError('Failed to update capacity details.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">Capacity Management</h1>
        <p className="text-xs font-semibold text-brown-600">Track and adjust daily maximum milk packaging limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column: Form to update capacity (2/5) */}
        <div className="md:col-span-2 space-y-4">
          <form onSubmit={handleCapacityUpsert} className="bg-warm-white border border-border/80 rounded-2xl p-5 shadow-shadow shadow-sm space-y-5">
            <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest">Adjust Limit</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Select Date</label>
              <div className="flex items-center h-11 rounded-xl border border-border bg-cream-50/20 px-3 gap-2">
                <Calendar size={15} className="text-brown-400" />
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="flex-1 h-full bg-transparent text-xs font-bold text-brown-800 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-brown-600 uppercase tracking-wider">Daily Limit (Litres)</label>
              <div className="flex items-center h-11 rounded-xl border border-border bg-cream-50/20 px-3 gap-2">
                <Package size={15} className="text-brown-400" />
                <input
                  type="number"
                  required
                  min={1}
                  max={5000}
                  value={capacityLitres}
                  onChange={(e) => {
                    setCapacityLitres(parseInt(e.target.value) || 0)
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="flex-1 h-full bg-transparent text-xs font-bold text-brown-800 outline-none font-mono"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}

            {successMsg && (
              <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                <span>✅</span> {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-bold text-xs shadow-sm transition-all border-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-brown-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  <span>Update Capacity</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Upcoming capacities list (3/5) */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-xs font-black text-brown-600 uppercase tracking-widest pl-1">Capacity Log Schedule</h3>
          
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs font-bold text-brown-400">
                Loading capacity log...
              </div>
            ) : capacities.length === 0 ? (
              <div className="p-12 text-center text-xs font-bold text-brown-400">
                No capacity records logged. All dates default to 1000L.
              </div>
            ) : (
              <div className="divide-y divide-border/30 max-h-[420px] overflow-y-auto">
                {capacities.map((cap) => {
                  const pct = cap.total_litres > 0 ? Math.round((cap.booked_litres / cap.total_litres) * 100) : 0
                  return (
                    <div key={cap.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-50/10 transition-colors">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-brown-800">
                          {new Date(cap.date).toLocaleDateString('en-IN', {
                            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                        <p className="text-[10px] text-brown-400 font-semibold mt-0.5 font-mono">
                          {cap.booked_litres}L Booked of {cap.total_litres}L Limit
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-48">
                        <div className="flex-1 h-2 bg-cream-100 rounded-full border border-border/40 overflow-hidden">
                          <div 
                            style={{ width: `${Math.min(pct, 100)}%` }} 
                            className={cn(
                              "h-full rounded-full",
                              pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-green-500"
                            )}
                          />
                        </div>
                        <span className={cn(
                          "text-[9px] font-black font-mono border px-2 py-0.5 rounded-full whitespace-nowrap",
                          pct >= 90 ? "bg-red-50 text-red-500 border-red-200" :
                          pct >= 75 ? "bg-amber-50 text-amber-500 border-amber-200" :
                          "bg-green-50 text-green-600 border-green-200"
                        )}>
                          {pct}% Filled
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
