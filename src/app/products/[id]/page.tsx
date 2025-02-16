"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
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
import { Id } from "../../../../convex/_generated/dataModel"

// interface Product {
//   _id: string
//   name: string
//   category: string
//   image: string
//   rating: number
//   brand: string
//   price: number
//   originalPrice?: number
//   label?: "Hot" | "Sale" | "New"
//   stock: number
//   description: string
// }

export default function ProductDetails() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as Id<"products">
  const product = useQuery(api.products.getProductById, { productID: productId })
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  // const labelVariants = {
  //   Hot: "bg-red-500",
  //   Sale: "bg-blue-500",
  //   New: "bg-green-500",
  // }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrderForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Math.min(Number.parseInt(value, 10) || 1, product.stock)) : value,
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
    <div className="container mx-auto px-4 py-8">
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
      <Link href="/products" className="flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          {/* {product.label && (
            <Badge
              className={`absolute top-2 left-2 z-10 ${labelVariants[product.label as keyof typeof labelVariants]}`}
            >
              {product.label}
            </Badge>
          )} */}
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            {/* <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div> */}
            <span className="text-gray-500">({product.rating})</span>
          </div>
          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
          {product.price && (
            <div className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</div>
          )}
          <p className="text-gray-700">{product.description}</p>
          <div>
            <span className="font-semibold">Category:</span> {product.category}
          </div>
          <div>
            <span className="font-semibold">Brand:</span> {product.category}
          </div>
          <div>
            <span className="font-semibold">In Stock:</span> {product.stock}
          </div>
          <Button
            size="lg"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsOrderDialogOpen(true)}
          >
            Place Order
          </Button>
        </div>
      </div>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent>
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
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={orderForm.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Price</Label>
              <div className="col-span-3 font-semibold">${(product.price * orderForm.quantity).toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}