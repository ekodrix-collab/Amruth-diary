/**
 * ═══════════════════════════════════════════════════════════
 * AMRUTH DAIRY — Centralized Billing Module
 *
 * Per project rule: "Billing calculations ONLY go in src/lib/billing.ts"
 *
 * Price is ADMIN-MANAGED:
 *   - Admin sets `price_per_litre` via app_settings table
 *   - Monthly = price_per_litre × quantity × actual_days_in_month
 *   - Daily rate = price_per_litre × quantity
 *
 * All API routes and frontend pages MUST import from here.
 * ═══════════════════════════════════════════════════════════
 */

import { SETTINGS_KEY_PRICE_PER_LITRE } from '@/lib/constants'

// ─────────────────────────────────────────
// Calendar helpers
// ─────────────────────────────────────────

/**
 * Get actual number of days in a given month.
 * @param year - Full year (e.g. 2026)
 * @param month - 1-indexed month (1 = January, 12 = December)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Get days in month from a Date object.
 */
export function getDaysInMonthFromDate(date: Date): number {
  return getDaysInMonth(date.getFullYear(), date.getMonth() + 1)
}

/**
 * Get the first day of the month as YYYY-MM-DD string.
 */
export function getFirstOfMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}-01`
}

/**
 * Get remaining delivery days from a start date to end of that month.
 * Excludes any dates in the excludedDates set.
 *
 * @param startDate - YYYY-MM-DD string
 * @param excludedDates - Set of YYYY-MM-DD strings to exclude
 * @returns Number of delivery days
 */
export function getRemainingDeliveryDays(
  startDate: string,
  excludedDates: Set<string> = new Set()
): number {
  const start = new Date(startDate)
  const year = start.getFullYear()
  const month = start.getMonth() + 1
  const lastDay = getDaysInMonth(year, month)
  const startDay = start.getDate()

  let count = 0
  for (let d = startDay; d <= lastDay; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (!excludedDates.has(dateStr)) {
      count++
    }
  }
  return count
}

/**
 * Get all dates in a month as YYYY-MM-DD strings.
 */
export function getAllDatesInMonth(year: number, month: number): string[] {
  const daysInMonth = getDaysInMonth(year, month)
  const dates: string[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return dates
}

// ─────────────────────────────────────────
// Pricing calculations
// ─────────────────────────────────────────

/**
 * Calculate the daily rate for a given quantity.
 * Daily rate = price_per_litre × quantity_litres
 *
 * @param pricePerLitre - Admin-set price per litre per day (in rupees)
 * @param quantityLitres - Subscription quantity (0.5, 1.0, 1.5, 2.0)
 * @returns Daily rate in rupees (rounded to 2 decimals)
 */
export function calculateDailyRate(
  pricePerLitre: number,
  quantityLitres: number
): number {
  return Math.round(pricePerLitre * quantityLitres * 100) / 100
}

/**
 * Calculate the monthly amount for a subscription.
 * Monthly = daily_rate × actual_days_in_month
 *
 * @param dailyRate - Daily rate in rupees
 * @param year - Full year
 * @param month - 1-indexed month
 * @returns Monthly amount in rupees (rounded to 2 decimals)
 */
export function calculateMonthlyAmount(
  dailyRate: number,
  year: number,
  month: number
): number {
  const daysInMonth = getDaysInMonth(year, month)
  return Math.round(dailyRate * daysInMonth * 100) / 100
}

/**
 * Calculate monthly amount excluding specific dates.
 *
 * @param dailyRate - Daily rate in rupees
 * @param year - Full year
 * @param month - 1-indexed month
 * @param excludedDates - Set of YYYY-MM-DD strings to exclude from billing
 * @returns Monthly amount in rupees (rounded to 2 decimals)
 */
export function calculateMonthlyAmountWithExclusions(
  dailyRate: number,
  year: number,
  month: number,
  excludedDates: Set<string> = new Set()
): number {
  const daysInMonth = getDaysInMonth(year, month)
  let deliveryDays = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (!excludedDates.has(dateStr)) {
      deliveryDays++
    }
  }
  return Math.round(dailyRate * deliveryDays * 100) / 100
}

/**
 * Calculate pro-rata amount for a partial month subscription.
 *
 * @param dailyRate - Daily rate in rupees
 * @param startDate - YYYY-MM-DD subscription start date
 * @param excludedDates - Set of YYYY-MM-DD strings to exclude
 * @returns Pro-rata amount in rupees (rounded to 2 decimals)
 */
export function calculateProRataAmount(
  dailyRate: number,
  startDate: string,
  excludedDates: Set<string> = new Set()
): number {
  const deliveryDays = getRemainingDeliveryDays(startDate, excludedDates)
  return Math.round(dailyRate * deliveryDays * 100) / 100
}

/**
 * Calculate skip credit amount.
 * @param dailyRate - The subscription's daily rate
 * @returns Credit amount in rupees
 */
export function calculateSkipCredit(dailyRate: number): number {
  return Math.round(dailyRate * 100) / 100
}

/**
 * Calculate vacation credit amount.
 * @param dailyRate - The subscription's daily rate
 * @param totalDays - Number of vacation days
 * @returns Credit amount in rupees
 */
export function calculateVacationCredit(
  dailyRate: number,
  totalDays: number
): number {
  return Math.round(dailyRate * totalDays * 100) / 100
}

/**
 * Calculate extra milk charge.
 * Extra milk is priced proportionally to the subscription rate.
 *
 * @param extraLitres - Extra litres ordered
 * @param pricePerLitre - Admin-set price per litre
 * @returns Charge amount in rupees
 */
export function calculateExtraMilkCharge(
  extraLitres: number,
  pricePerLitre: number
): number {
  return Math.round(pricePerLitre * extraLitres * 100) / 100
}

// ─────────────────────────────────────────
// Server-side pricing fetch
// ─────────────────────────────────────────

/**
 * Fetch the current price_per_litre from app_settings table.
 * This MUST be called server-side (API routes only).
 *
 * @param adminClient - Supabase admin client
 * @returns Price per litre in rupees, or default fallback
 */
export async function fetchPricePerLitre(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: { from: (table: string) => any }
): Promise<number> {
  const { data, error } = await adminClient
    .from('app_settings')
    .select('value')
    .eq('key', SETTINGS_KEY_PRICE_PER_LITRE)
    .single()

  if (error || !data) {
    console.warn('[billing] Failed to fetch price_per_litre, using default 82.67')
    return 82.67 // Fallback — should never reach here in production
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = (data as any).value as { amount?: number }
  return parsed.amount ?? 82.67
}

// ─────────────────────────────────────────
// Client-side pricing fetch (for frontend pages)
// ─────────────────────────────────────────

/**
 * Fetch price_per_litre via the public API endpoint.
 * Used in frontend pages (onboarding, subscribe, dashboard).
 *
 * @returns Price per litre in rupees
 */
export async function fetchPricePerLitreClient(): Promise<number> {
  try {
    const res = await fetch('/api/admin/settings?key=price_per_litre')
    const data = await res.json()
    if (data.success && data.value?.amount) {
      return data.value.amount
    }
  } catch (err) {
    console.warn('[billing] Failed to fetch price from API, using default')
  }
  return 82.67 // Fallback
}
