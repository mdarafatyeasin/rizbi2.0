"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ArrowLeft, Star, Minus, Plus, Truck, ShieldCheck, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import type { Id } from "../../../../convex/_generated/dataModel"

export default function ProductDetails() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as Id<"products">
  const product = useQuery(api.products.getProductById, {
    productID: productId,
  })
  const createOrder = useMutation(api.orders.createOrder)

  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    quantity: 1,
  })

  useEffect(() => {
    if (product) {
      setOrderForm((prev) => ({ ...prev, quantity: 1 }))
    }
  }, [product])

  if (product === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
      </div>
    )
  }

  if (!product) {
    return <div className="text-center text-gray-800 mt-8">Product not found</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrderForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Math.min(Number.parseInt(value, 10) || 1, product.stock)) : value,
    }))
  }

  const handleQuantityChange = (increment: number) => {
    setOrderForm((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(prev.quantity + increment, product.stock)),
    }))
  }

  const handlePlaceOrder = async () => {
    try {
      await createOrder({
        customerName: orderForm.customerName,
        phoneNumber: orderForm.phoneNumber,
        address: orderForm.address,
        productID: product._id,
        quantity: orderForm.quantity,
        totalAmount: product.price * orderForm.quantity,
      })
      setIsOrderDialogOpen(false)
      toast.success("Order placed successfully!")
      setTimeout(() => {
        router.push("/products")
      }, 2000)
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Error placing order. Please try again.")
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="pt-12 container mx-auto px-4 w-[80%]">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Link
          href="/products"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-gray-500">({product.rating})</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
              {product.price && (
                <div className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</div>
              )}
              <p className="text-gray-700">{product.description}</p>
              <div>
                <span className="font-semibold text-gray-700">Category:</span>{" "}
                <span className="text-gray-600">{product.category}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">In Stock:</span>{" "}
                <span className="text-gray-600">{product.stock}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={orderForm.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={orderForm.quantity}
                    onChange={(e) => handleInputChange(e)}
                    className="w-20 text-center mx-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={orderForm.quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-grow bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300"
                  onClick={() => setIsOrderDialogOpen(true)}
                >
                  Add to Cart
                </Button>
              </div>
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Product Highlights</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Free shipping on orders over $100</span>
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-gray-600" />
                    <span>1-year warranty included</span>
                  </li>
                  <li className="flex items-center">
                    <RefreshCcw className="w-5 h-5 mr-2 text-gray-600" />
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <p className="text-gray-700 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
          <h3 className="text-xl font-semibold mb-2">Specifications</h3>
          <ul className="list-disc pl-5 mb-6">
            <li>Feature 1: Lorem ipsum dolor sit amet</li>
            <li>Feature 2: Consectetur adipiscing elit</li>
            <li>Feature 3: Sed do eiusmod tempor incididunt</li>
            <li>Feature 4: Ut labore et dolore magna aliqua</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Care Instructions</h3>
          <p className="text-gray-700">
            To ensure the longevity of your product, please follow these care instructions: Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Place Your Order</DialogTitle>
            <DialogDescription>Please fill in your details to place the order for {product.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                value={orderForm.customerName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={orderForm.phoneNumber}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={orderForm.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3 flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={orderForm.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={orderForm.quantity}
                  onChange={handleInputChange}
                  className="w-20 text-center mx-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={orderForm.quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Price</Label>
              <div className="col-span-3 font-semibold text-lg">${(product.price * orderForm.quantity).toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300"
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

