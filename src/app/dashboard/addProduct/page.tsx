"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import Link from "next/link"
import { api } from "../../../../convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AddProductPage() {
  const createProduct = useMutation(api.products.createProduct)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    size: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      size: formData.size.split(",").map((s) => s.trim()),
    }

    await createProduct(productData)
    alert("Product added successfully!")
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: "",
      size: "",
    })
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Add New Product</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to add a new product to your inventory.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Category" name="category" value={formData.category} onChange={handleChange} required />
            <InputField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
            <InputField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              placeholder="Quantity"
            />
            <InputField
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
            />
            <InputField
              label="Sizes (comma-separated)"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              placeholder="S, M, L, XL"
            />
          </div>
          <InputField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            textarea
          />
          <div className="flex justify-between items-center pt-6">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Back to Products
            </Link>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InputField({ label, name, type = "text", value, onChange, required, textarea = false, ...props }) {
  const Component = textarea ? Textarea : Input

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Component
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-white border-gray-300 text-black placeholder-gray-400"
        {...props}
      />
    </div>
  )
}

