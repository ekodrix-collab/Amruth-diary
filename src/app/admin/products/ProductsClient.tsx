'use client'

import { useState } from 'react'
import { Package, Plus, X, Milk } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { useRouter } from 'next/navigation'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock_available: number;
  is_active: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  quantity_litres: number;
  monthly_price: number;
  daily_rate: number;
  is_popular: boolean;
}

export function ProductsClient({ data, plans }: { data: Product[], plans: SubscriptionPlan[] }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    stock_available: '0'
  })

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          unit: formData.unit,
          stock_available: Number(formData.stock_available)
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to add product')

      setShowModal(false)
      setFormData({ name: '', category: '', price: '', unit: '', stock_available: '0' })
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const productColumns: ColumnDef<Product>[] = [
    { header: 'Product Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Unit', accessorKey: 'unit' },
    { header: 'Price', align: 'right', cell: (row) => `₹${row.price}` },
    { header: 'Stock', accessorKey: 'stock_available', align: 'right' },
    { header: 'Status', align: 'center', cell: (row) => <StatusBadge status={row.is_active ? 'Active' : 'Inactive'} /> },
  ]

  const planColumns: ColumnDef<SubscriptionPlan>[] = [
    { header: 'Plan Name', cell: (row) => <div className="font-bold text-[#0f172a] flex items-center gap-2"><Milk size={16} className="text-blue-600" /> {row.name}</div> },
    { header: 'Quantity/Day', cell: (row) => `${row.quantity_litres} L` },
    { header: 'Monthly Price', align: 'right', cell: (row) => `₹${row.monthly_price}` },
    { header: 'Daily Rate', align: 'right', cell: (row) => `₹${row.daily_rate}` },
    { header: 'Badge', align: 'center', cell: (row) => row.is_popular ? <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-700">POPULAR</span> : null },
  ]

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Products & Inventory" 
        description="Manage product catalog, pricing, and stock levels." 
        icon={Package} 
        actionLabel="Add Product" 
        onAction={() => setShowModal(true)}
      />

      {/* MILK SUBSCRIPTION PLANS */}
      <div>
        <h2 className="text-[16px] font-black text-[#0f172a] mb-4 flex items-center gap-2">
          Milk Subscription Plans
        </h2>
        <DataTable data={plans} columns={planColumns} />
      </div>

      {/* RETAIL PRODUCTS */}
      <div>
        <h2 className="text-[16px] font-black text-[#0f172a] mb-4">
          Retail Products
        </h2>
        <DataTable data={data} columns={productColumns} />
      </div>

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#fff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a' }}>
                <Plus size={24} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Add New Product</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. Farm Paneer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. dairy" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Unit</label>
                  <input required type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm" placeholder="e.g. 500g" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Price (₹)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Initial Stock</label>
                  <input required type="number" value={formData.stock_available} onChange={e => setFormData({...formData, stock_available: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm" placeholder="0" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '16px', background: '#2563eb', color: '#fff', border: 'none',
                  borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1, marginTop: '24px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                }}
              >
                {isSubmitting ? 'Saving Product...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
