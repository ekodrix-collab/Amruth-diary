import { createClient } from '@/utils/supabase/server'
import { ProductsClient } from './ProductsClient'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  if (error) return <div className="text-red-500">Error: {error.message}</div>

  return <ProductsClient data={data || []} />
}
