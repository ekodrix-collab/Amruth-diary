'use client'

import { useState, useEffect } from 'react'
import { FileText, CreditCard, CheckCircle2, ShieldCheck, AlertCircle, TrendingUp, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BillingData {
  id?: string;
  billing_month: string;
  days_delivered: number;
  days_skipped: number;
  days_paused: number;
  extra_litres_ordered: number;
  skip_credit: number;
  pause_credit: number;
  extra_charges: number;
  carry_in_balance: number;
  net_due: number;
  amount_paid: number;
}

export default function BillsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bill, setBill] = useState<BillingData | null>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Payment States
  const [showPayModal, setShowPayModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details')
  const [mockPaid, setMockPaid] = useState(false)

  // Load billing data
  async function loadData() {
    try {
      setLoading(true)
      const res = await fetch('/api/customer/dashboard')
      const json = await res.json()
      if (json.success) {
        if (json.profile) {
          setProfile(json.profile)
        }
        if (json.current_month) {
          setBill(json.current_month)
        } else {
          // If no billing month generated in DB yet, create a default preview
          const daily = json.subscription ? json.subscription.daily_rate : 0
          const monthly = json.subscription ? json.subscription.monthly_amount : 0
          setBill({
            billing_month: new Date().toISOString().split('T')[0],
            days_delivered: 0,
            days_skipped: 0,
            days_paused: 0,
            extra_litres_ordered: 0,
            skip_credit: 0,
            pause_credit: 0,
            extra_charges: 0,
            carry_in_balance: 0,
            net_due: monthly,
            amount_paid: 0
          })
        }
      } else {
        setError(json.message || 'Failed to retrieve billing statements')
      }
    } catch (err) {
      setError('Network error loading statements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function startPayment() {
    if (!bill) return;
    try {
      setPaymentStep('processing');
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setPaymentStep('details');
        return;
      }

      // Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bill.net_due,
          billingMonthId: bill.id
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert(orderData.message || 'Failed to initialize payment order.');
        setPaymentStep('details');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Amruth Milk',
        description: `Milk Subscription Payment - ${monthName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setPaymentStep('processing');
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                billing_month_id: bill.id
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaymentStep('success');
              setMockPaid(true);
              loadData();
            } else {
              alert(verifyData.message || 'Payment verification failed.');
              setPaymentStep('details');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Error verifying payment.');
            setPaymentStep('details');
          }
        },
        prefill: {
          name: profile?.full_name || '',
          contact: profile?.phone || ''
        },
        theme: {
          color: '#FBBF24'
        },
        modal: {
          ondismiss: function () {
            setPaymentStep('details');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error('Payment start error:', err);
      alert('Failed to initiate payment.');
      setPaymentStep('details');
    }
  }

  if (loading) {
    return (
      <div className="max-w-xl space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-cream-200 rounded-lg" />
        <div className="h-56 bg-cream-200 rounded-3xl" />
      </div>
    )
  }

  if (error || !bill) {
    return (
      <div className="max-w-md mx-auto text-center py-12 bg-warm-white border border-border/85 rounded-3xl p-8 shadow-shadow shadow-md">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
        <h3 className="text-lg font-black text-brown-800">Statement Unavailable</h3>
        <p className="text-xs font-semibold text-brown-600 mt-2 mb-6">{error || 'No active statements found.'}</p>
        <button onClick={loadData} className="inline-flex items-center justify-center px-5 h-10 bg-amber-400 text-brown-800 font-extrabold rounded-xl text-xs shadow-sm hover:bg-amber-500 border-none cursor-pointer">
          Retry Loading
        </button>
      </div>
    )
  }

  const monthName = new Date(bill.billing_month).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric'
  })

  // Calculate values
  const hasPendingBill = bill.net_due > 0 && !mockPaid

  return (
    <div className="max-w-2xl space-y-6 relative">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-brown-800 font-display tracking-tight mb-1">My Bills & Statements</h1>
        <p className="text-xs font-semibold text-brown-600">Review monthly invoices, credit breakdowns, and billing logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column - Invoice details card (3/5) */}
        <div className="md:col-span-3 space-y-5">
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm overflow-hidden">
            
            {/* Invoice Header */}
            <div className="p-5 border-b border-border/40 bg-cream-50/20 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-brown-800 font-display">{monthName} Statement</h3>
                <p className="text-[10px] text-brown-400 font-bold mt-0.5">Amruth Dairy Farm Invoice</p>
              </div>
              <div>
                {mockPaid ? (
                  <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">Paid</span>
                ) : hasPendingBill ? (
                  <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">Pending</span>
                ) : (
                  <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">Cleared</span>
                )}
              </div>
            </div>

            {/* Bill Breakdown list */}
            <div className="p-5 space-y-3.5 text-xs font-semibold text-brown-600">
              <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                <span>Base Plan charges:</span>
                <span className="font-bold text-brown-800">₹{(bill.net_due + bill.skip_credit + bill.pause_credit - bill.extra_charges).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                <span className="flex items-center gap-1.5">
                  <span>Skip Day Credits:</span>
                  <span className="bg-cream-100 text-brown-600 text-[9px] px-1 py-0.5 rounded font-black">{bill.days_skipped} days</span>
                </span>
                <span className="font-bold text-green-600">-₹{bill.skip_credit.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                <span className="flex items-center gap-1.5">
                  <span>Vacation Pause Credits:</span>
                  <span className="bg-cream-100 text-brown-600 text-[9px] px-1 py-0.5 rounded font-black">{bill.days_paused} days</span>
                </span>
                <span className="font-bold text-green-600">-₹{bill.pause_credit.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                <span className="flex items-center gap-1.5">
                  <span>Extra Milk Orders:</span>
                  <span className="bg-cream-100 text-brown-600 text-[9px] px-1 py-0.5 rounded font-black">{bill.extra_litres_ordered}L</span>
                </span>
                <span className="font-bold text-amber-600">+₹{bill.extra_charges.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                <span>Carry in balance:</span>
                <span className={cn("font-bold", bill.carry_in_balance >= 0 ? "text-green-600" : "text-red-500")}>
                  {bill.carry_in_balance >= 0 ? '-' : '+'}₹{Math.abs(bill.carry_in_balance).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 text-sm font-black text-brown-800">
                <span>Total Net Due:</span>
                <span className="text-amber-600 font-mono text-base">₹{mockPaid ? '0.00' : bill.net_due.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay Button */}
            {hasPendingBill && (
              <div className="p-5 bg-cream-50/20 border-t border-border/40">
                <button
                  onClick={() => { setShowPayModal(true); setPaymentStep('details'); }}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-bold text-xs shadow-md transition-all border-none flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard size={14} />
                  <span>Pay Balance Due (₹{bill.net_due.toFixed(2)})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Billing support details (2/5) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-warm-white border border-border/80 rounded-2xl shadow-shadow shadow-sm p-4 space-y-4 text-xs font-semibold text-brown-600">
            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp size={13} /> Pricing Formula
            </h3>
            <div className="space-y-3">
              <p className="leading-relaxed">
                Pricing is set by the admin and calculated based on <span className="font-bold text-brown-800">actual days in the month</span>. Your daily rate is applied to each delivery day.
              </p>
              <p className="leading-relaxed">
                Skips and pauses accumulate credit at your subscription's daily rate, which automatically reduces your next monthly statement.
              </p>
            </div>
            <div className="h-[1px] bg-border/40" />
            <div className="flex gap-2">
              <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-brown-400 leading-relaxed font-bold">
                Online payment balances update instantly. For cash payments, contact delivery managers.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MOCK PAYMENT DIALOG MODAL */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => paymentStep !== 'processing' && setShowPayModal(false)}
              className="absolute inset-0 bg-[#292524]/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-warm-white border border-border rounded-3xl w-full max-w-sm p-6 shadow-2xl relative z-10 overflow-hidden text-brown-800"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />

              {paymentStep === 'details' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-black font-display text-brown-800">Secure Checkout</h3>
                    <p className="text-[11px] font-semibold text-brown-600 mt-1">Complete your subscription payment securely via Razorpay.</p>
                  </div>

                  <div className="bg-cream-50/50 border border-border p-3.5 rounded-xl text-[11px] font-semibold text-brown-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Statement Amount:</span>
                      <span className="font-bold">₹{bill.net_due.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-brown-800 border-t border-border/40 pt-1.5 mt-1.5">
                      <span>Paying Total:</span>
                      <span>₹{bill.net_due.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowPayModal(false)}
                      className="w-1/3 h-10 rounded-xl border border-border text-brown-600 font-bold text-xs transition-all cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startPayment}
                      className="w-2/3 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-brown-800 font-bold text-xs shadow-md border-none cursor-pointer transition-all"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <p className="text-sm font-black text-brown-800">Processing Payment...</p>
                    <p className="text-[10px] font-semibold text-brown-400 mt-1 flex items-center justify-center gap-1">
                      <ShieldCheck size={12} className="text-green-500" /> Secured by SSL encryption
                    </p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-500 animate-[float_3s_ease-in-out_infinite]">
                    <CheckCircle2 size={30} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-brown-800 font-display">Payment Successful!</h3>
                    <p className="text-xs font-semibold text-brown-600 mt-1">₹{bill.net_due.toFixed(2)} credited successfully.</p>
                  </div>
                  <button
                    onClick={() => setShowPayModal(false)}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-brown-800 font-bold text-xs border-none cursor-pointer mt-4"
                  >
                    Close Invoice
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
