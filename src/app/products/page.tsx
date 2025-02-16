"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    if (products) {
      const filtered = products
        .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reverse() // Reverse the order of products
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])

  if (products === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-8 pt-20">
      <div className="container mx-auto px-4 w-[90%]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Our Latest Products</h1>
          <p className="text-gray-600 mb-6">
            Explore our curated collection of high-quality items, from trendy fashion to must-have gadgets.
          </p>
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7"
            layout
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-8">No products found. Try a different search term.</p>
        )}
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
          <Badge className={`absolute top-2 left-2 z-10 ${labelVariants[product.label as keyof typeof labelVariants]}`}>
            {product.label}
          </Badge>
        )}
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>

      {/* Content Container */}
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{product.name}</h3>

        {/* Price & Buy Now */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</div>
            )}
          </div>
          <Link href={`/products/${product._id}`}>
            <Button
              size="sm"
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300"
            >
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

