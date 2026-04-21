import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import ProductDetailClient from '@/components/ProductDetailClient'
import Navbar from '@/components/Navbar'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug('powder-spices', params.slug)
  if (!product) return {}
  return {
    title: `${product.name} — Powder Spices | Rawat Organics`,
    description: product.longDescription,
  }
}

export default function PowderSpiceDetailPage({ params }: Props) {
  const product = getProductBySlug('powder-spices', params.slug)
  if (!product) notFound()

  const related = getRelatedProducts(product, 4)

  return (
    <>
      <Navbar />
      <ProductDetailClient
        product={product}
        related={related}
        categoryLabel="Powder Spices"
        categoryHref="/powder-spices"
      />
    </>
  )
}
