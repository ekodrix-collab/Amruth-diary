'use client'

import { useState, useEffect } from 'react'
import {
  Save, Settings, Package, ShoppingBag, Clock, Store, Bell, Check, Loader2, Plus, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('pricing')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Settings State
  const [settings, setSettings] = useState<any>({
    price_per_litre: { amount: 82.67, currency: 'INR' },
    daily_milk_production: { default_litres: 100 },
    cutoff_time: { hour: 21, minute: 0 },
    max_extra_milk_days: { days: 7 },
    store_info: { name: 'Amruth Milk', phone: '+91 98765 43210', email: 'hello@amruth.com', address: 'Mangalore' },
    notification_settings: { whatsapp_enabled: true, auto_reminders: true },
    delivery_settings: { start_time: '06:00', delivery_fee: 0 },
    waitlist_settings: { response_hours_deadline: 24, auto_notify: true },
    business_settings: { timezone: 'Asia/Kolkata', billing_cycle_start_day: 1 }
  })

  // Products State
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch settings
      const settingsRes = await fetch('/api/admin/settings')
      const settingsData = await settingsRes.json()
      
      // Fetch products
      const productsRes = await fetch('/api/admin/products')
      const productsData = await productsRes.json()

      if (settingsData.success && settingsData.settings) {
        const mergedSettings = { ...settings }
        settingsData.settings.forEach((item: any) => {
          mergedSettings[item.key] = item.value
        })
        setSettings(mergedSettings)
      }

      if (productsData.success && productsData.products) {
        setProducts(productsData.products)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveSettings() {
    setSaving(true)
    setSaveMessage('')
    try {
      // Prepare payload as array of {key, value}
      const payload = Object.keys(settings).map(key => ({
        key,
        value: settings[key]
      }))

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        setSaveMessage('Settings saved successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        alert(data.message || 'Failed to save settings')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (key: string, subKey: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: value
      }
    }))
  }

  // Handle Product CRUD
  const [newProduct, setNewProduct] = useState({ name: '', price: '', unit: '', category: 'other' })
  
  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.unit) return alert('Fill required fields')
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          unit: newProduct.unit,
          category: newProduct.category,
          is_active: true
        })
      })
      const data = await res.json()
      if (data.success) {
        setProducts([data.product, ...products])
        setNewProduct({ name: '', price: '', unit: '', category: 'other' })
        setSaveMessage('Product added!')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setProducts(products.filter(p => p.id !== id))
        setSaveMessage('Product deleted!')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brown-600" />
      </div>
    )
  }

  const tabs = [
    { id: 'pricing', label: 'Pricing & Products', icon: ShoppingBag },
    { id: 'operations', label: 'Operations', icon: Settings },
    { id: 'store', label: 'Business & Store', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-brown-900 tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8 text-amber-500" />
            Global Settings
          </h1>
          <p className="text-sm text-brown-600/70 mt-1 font-medium">
            Manage application configuration, rules, and store products.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <Check className="w-4 h-4" /> {saveMessage}
            </span>
          )}
          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="h-11 px-6 rounded-xl bg-brown-900 hover:bg-brown-800 text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all text-left",
                  isActive 
                    ? "bg-amber-400 text-brown-900 shadow-md shadow-amber-400/20" 
                    : "bg-white text-brown-600 hover:bg-cream-100 border border-border/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-brown-900" : "text-brown-400")} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 space-y-6">
          
          {/* PRICING & PRODUCTS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" /> Base Subscription Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Price Per Litre (₹)</label>
                    <input 
                      type="number" 
                      value={settings.price_per_litre.amount}
                      onChange={(e) => handleSettingChange('price_per_litre', 'amount', parseFloat(e.target.value))}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/50" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Currency</label>
                    <input 
                      type="text" 
                      value={settings.price_per_litre.currency}
                      disabled
                      className="w-full h-12 bg-cream-100 border border-border rounded-xl px-4 text-brown-900/50 font-bold cursor-not-allowed" 
                    />
                  </div>
                </div>
                <p className="text-xs text-brown-500 mt-3 font-medium bg-amber-50 p-3 rounded-xl border border-amber-100">
                  Monthly subscription amounts are calculated as: <code className="font-bold">Price Per Litre × Litres/Day × Days in Month</code>.
                </p>
              </div>

              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" /> Extra Products
                </h3>
                
                {/* Add New Product */}
                <div className="flex flex-col md:flex-row gap-3 mb-6 bg-cream-50 p-4 rounded-2xl border border-border">
                  <input 
                    type="text" placeholder="Product Name (e.g. Ghee)" 
                    value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="flex-1 h-11 bg-white border border-border rounded-xl px-3 text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                  <input 
                    type="number" placeholder="Price (₹)" 
                    value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-32 h-11 bg-white border border-border rounded-xl px-3 text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                  <input 
                    type="text" placeholder="Unit (e.g. 500ml)" 
                    value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-32 h-11 bg-white border border-border rounded-xl px-3 text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                  <button 
                    onClick={handleAddProduct}
                    className="h-11 px-4 bg-brown-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brown-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-xs font-bold text-brown-500 uppercase">Product</th>
                        <th className="pb-3 text-xs font-bold text-brown-500 uppercase">Unit</th>
                        <th className="pb-3 text-xs font-bold text-brown-500 uppercase text-right">Price</th>
                        <th className="pb-3 text-xs font-bold text-brown-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr><td colSpan={4} className="py-6 text-center text-sm text-brown-500">No products found.</td></tr>
                      ) : (
                        products.map(p => (
                          <tr key={p.id} className="border-b border-border/40 hover:bg-cream-50/50">
                            <td className="py-3 font-bold text-brown-900 text-sm">{p.name}</td>
                            <td className="py-3 text-brown-600 text-sm font-medium">{p.unit}</td>
                            <td className="py-3 font-black text-brown-900 text-right text-sm">₹{p.price}</td>
                            <td className="py-3 text-right">
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OPERATIONS */}
          {activeTab === 'operations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" /> Operational Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Daily Global Capacity (Litres)</label>
                    <input 
                      type="number" 
                      value={settings.daily_milk_production.default_litres}
                      onChange={(e) => handleSettingChange('daily_milk_production', 'default_litres', parseInt(e.target.value))}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                    <p className="text-[11px] text-brown-500 pl-1">Fallback capacity if no specific daily override exists.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Cutoff Time (Hour: 0-23)</label>
                    <input 
                      type="number" min="0" max="23"
                      value={settings.cutoff_time.hour}
                      onChange={(e) => handleSettingChange('cutoff_time', 'hour', parseInt(e.target.value))}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                    <p className="text-[11px] text-brown-500 pl-1">e.g., 21 means 9:00 PM the previous night.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Max Extra Milk Days</label>
                    <input 
                      type="number" 
                      value={settings.max_extra_milk_days.days}
                      onChange={(e) => handleSettingChange('max_extra_milk_days', 'days', parseInt(e.target.value))}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                    <p className="text-[11px] text-brown-500 pl-1">How many days in advance they can request extra milk.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Delivery Start Time</label>
                    <input 
                      type="time" 
                      value={settings.delivery_settings.start_time}
                      onChange={(e) => handleSettingChange('delivery_settings', 'start_time', e.target.value)}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>

                </div>
              </div>

              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4">Waitlist Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Response Deadline (Hours)</label>
                    <input 
                      type="number" 
                      value={settings.waitlist_settings.response_hours_deadline}
                      onChange={(e) => handleSettingChange('waitlist_settings', 'response_hours_deadline', parseInt(e.target.value))}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.waitlist_settings.auto_notify}
                        onChange={(e) => handleSettingChange('waitlist_settings', 'auto_notify', e.target.checked)}
                        className="w-5 h-5 rounded border-border text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm font-bold text-brown-900">Auto-Notify Waitlist on Capacity Freed</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STORE & BUSINESS */}
          {activeTab === 'store' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-500" /> Store Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Business Name</label>
                    <input 
                      type="text" 
                      value={settings.store_info.name}
                      onChange={(e) => handleSettingChange('store_info', 'name', e.target.value)}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={settings.store_info.phone}
                      onChange={(e) => handleSettingChange('store_info', 'phone', e.target.value)}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Support Email</label>
                    <input 
                      type="email" 
                      value={settings.store_info.email}
                      onChange={(e) => handleSettingChange('store_info', 'email', e.target.value)}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Address</label>
                    <input 
                      type="text" 
                      value={settings.store_info.address}
                      onChange={(e) => handleSettingChange('store_info', 'address', e.target.value)}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4">Business Logic Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Timezone</label>
                    <input 
                      type="text" 
                      value={settings.business_settings.timezone}
                      onChange={(e) => handleSettingChange('business_settings', 'timezone', e.target.value)}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brown-500 uppercase tracking-wider pl-1">Billing Cycle Start Day</label>
                    <input 
                      type="number" min="1" max="28"
                      value={settings.business_settings.billing_cycle_start_day}
                      onChange={(e) => handleSettingChange('business_settings', 'billing_cycle_start_day', parseInt(e.target.value))}
                      className="w-full h-12 bg-cream-50 border border-border rounded-xl px-4 text-brown-900 font-bold focus:outline-none" 
                    />
                    <p className="text-[11px] text-brown-500 pl-1">Day of the month when billing starts (e.g., 1).</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-border/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-brown-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" /> Alert Settings
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-cream-50 border border-border rounded-2xl cursor-pointer hover:bg-cream-100 transition-colors">
                    <div>
                      <p className="font-bold text-brown-900">WhatsApp Notifications</p>
                      <p className="text-xs text-brown-500 font-medium mt-0.5">Send updates, delivery alerts and billing links via WhatsApp</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.notification_settings.whatsapp_enabled}
                      onChange={(e) => handleSettingChange('notification_settings', 'whatsapp_enabled', e.target.checked)}
                      className="w-5 h-5 rounded border-border text-amber-500 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-cream-50 border border-border rounded-2xl cursor-pointer hover:bg-cream-100 transition-colors">
                    <div>
                      <p className="font-bold text-brown-900">Automated Reminders</p>
                      <p className="text-xs text-brown-500 font-medium mt-0.5">Automatically send payment reminders for unpaid bills</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.notification_settings.auto_reminders}
                      onChange={(e) => handleSettingChange('notification_settings', 'auto_reminders', e.target.checked)}
                      className="w-5 h-5 rounded border-border text-amber-500 focus:ring-amber-500"
                    />
                  </label>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
