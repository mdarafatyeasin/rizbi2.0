"use client"

import { useState, useEffect } from "react"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api } from "../../convex/_generated/api"

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  onProductUpdated: () => void
}

export function EditProductModal({ isOpen, onClose, product, onProductUpdated }: EditProductModalProps) {
  const updateProduct = useMutation(api.products.updateProduct)
  const [editedProduct, setEditedProduct] = useState(product)
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
              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
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
              onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
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
              onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
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
              onChange={(e) => setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })}
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
              onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
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

