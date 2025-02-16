"use client"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  category: string
  image: string
  price: number
  originalPrice?: number
  label?: "Hot" | "Sale" | "New"
  stock: number
}

export default function ProductGrid() {
  const products = useQuery(api.products.getAllProducts)

  if (products === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="nav-align">
      <div className="bg-white min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const labelVariants = {
    Hot: "bg-red-500",
    Sale: "bg-blue-500",
    New: "bg-green-500",
  }

  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square">
        {product.label && (
          <Badge
            className={`absolute top-2 left-2 z-10 ${
              labelVariants[product.label as keyof typeof labelVariants]
            }`}
          >
            {product.label}
          </Badge>
        )}
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {/* Price & Buy Now */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          <Link href={`/products/${product._id}`}>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
