"use client"
import { useQuery } from "convex/react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "../../convex/_generated/api"

// interface Product {
//   _id: string
//   name: string
//   image: string
//   price: number
//   rating: number
//   label?: "New" | "Sale" | "Hot"
// }

export default function NewArrivals() {
  const products = useQuery(api.products.getAllProducts)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 w-[80%]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

