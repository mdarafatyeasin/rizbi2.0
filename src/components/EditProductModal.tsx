"use client"

import { useState, useEffect } from "react"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api } from "../../convex/_generated/api"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  stock: number
  image?: string
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onProductUpdated: () => void
}

export function EditProductModal({ isOpen, onClose, product, onProductUpdated }: EditProductModalProps) {
  const updateProduct = useMutation(api.products.updateProduct)
  const [editedProduct, setEditedProduct] = useState<Product | null>(product)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setEditedProduct(product)
  }, [product])

  const handleUpdateProduct = async () => {
    if (!editedProduct) return

    setIsUpdating(true)
    try {
      await updateProduct({
        id: editedProduct._id,
        name: editedProduct.name,
        price: editedProduct.price,
        category: editedProduct.category,
        stock: editedProduct.stock,
        image: editedProduct.image,
      })
      onProductUpdated()
      onClose()
    } catch (error) {
      console.error("Error updating product:", error)
      // You can add a toast notification here for the error
    } finally {
      setIsUpdating(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={editedProduct?.name || ""}
              onChange={(e) => setEditedProduct((prev) => prev ? { ...prev, name: e.target.value } : null)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              className="col-span-3"
              value={editedProduct?.price || 0}
              onChange={(e) => setEditedProduct((prev) => prev ? { ...prev, price: Number(e.target.value) } : null)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              className="col-span-3"
              value={editedProduct?.category || ""}
              onChange={(e) => setEditedProduct((prev) => prev ? { ...prev, category: e.target.value } : null)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              className="col-span-3"
              value={editedProduct?.stock || 0}
              onChange={(e) => setEditedProduct((prev) => prev ? { ...prev, stock: Number(e.target.value) } : null)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input
              id="image"
              className="col-span-3"
              value={editedProduct?.image || ""}
              onChange={(e) => setEditedProduct((prev) => prev ? { ...prev, image: e.target.value } : null)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateProduct} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
