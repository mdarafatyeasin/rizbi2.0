"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { X, Plus, DollarSign, Package, Tag, ImageIcon, Ruler, Star } from "lucide-react"
import { api } from "../../convex/_generated/api"

export default function AddProduct({ onClose }) {
  const createProduct = useMutation(api.products.createProduct)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    size: "",
    rating: "",
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
      rating: formData.rating ? Number(formData.rating) : undefined,
      size: formData.size.split(",").map((s) => s.trim()),
    }

    await createProduct(productData)
    alert("Product added successfully!")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-full p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
            <TextareaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                placeholder="0.00"
              />
              <InputField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                icon={<Package className="w-5 h-5 text-gray-400" />}
                placeholder="Quantity"
              />
            </div>
            <InputField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              icon={<Tag className="w-5 h-5 text-gray-400" />}
            />
            <InputField
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              icon={<ImageIcon className="w-5 h-5 text-gray-400" />}
              placeholder="https://example.com/image.jpg"
            />
            <InputField
              label="Sizes"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              icon={<Ruler className="w-5 h-5 text-gray-400" />}
              placeholder="S, M, L, XL"
            />
            <InputField
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              icon={<Star className="w-5 h-5 text-gray-400" />}
              min="0"
              max="5"
              step="0.1"
              placeholder="Optional"
            />
          </div>
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-300"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InputField({ label, name, type = "text", value, onChange, required, icon, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type={type}
          name={name}
          id={name}
          className="block w-full rounded-md border-gray-300 pl-10 focus:ring-black focus:border-black sm:text-sm"
          value={value}
          onChange={onChange}
          required={required}
          {...props}
        />
      </div>
    </div>
  )
}

function TextareaField({ label, name, value, onChange, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        rows="3"
        className="block w-full rounded-md border-gray-300 focus:ring-black focus:border-black sm:text-sm"
        value={value}
        onChange={onChange}
        {...props}
      ></textarea>
    </div>
  )
}

