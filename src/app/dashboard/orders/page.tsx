"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"
import { Loader2, Search, Trash2, Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast, Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type Order = {
  _id: Id<"orders">
  customerName: string
  phoneNumber: string
  address: string
  productID: Id<"products">
  quantity: number
  totalAmount: number
  status: "pending" | "shipped" | "delivered" | "canceled"
  createdAt: number
  updatedAt?: number
}

export default function AdminOrdersPage() {
  const allOrders = useQuery(api.orders.getAllOrders)
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)
  const deleteOrder = useMutation(api.orders.deleteOrder)

  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Id<"orders"> | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const product = useQuery(api.products.getProductById, selectedOrder ? { productID: selectedOrder.productID } : "skip")

  useEffect(() => {
    if (allOrders) {
      setOrders(allOrders)
    }
  }, [allOrders])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || order.phoneNumber.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: Id<"orders">, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus({ orderID: orderId, status: newStatus })
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)))
      toast.success("Order status updated successfully")
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    }
  }

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder({ orderID: orderToDelete })
        setOrders(orders.filter((order) => order._id !== orderToDelete))
        toast.success("Order deleted successfully")
        setIsDeleteDialogOpen(false)
      } catch (error) {
        console.error("Error deleting order:", error)
        toast.error("Failed to delete order")
      }
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "canceled":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  if (!allOrders) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-6">
        Order Management Dashboard
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((order) => order.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
            <Truck className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((order) => order.status === "shipped").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((order) => order.status === "delivered").length}</div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4"
      >
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search by name or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Order["status"] | "all")}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.phoneNumber}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, value as Order["status"])}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <Badge
                            variant={
                              order.status === "canceled"
                                ? "destructive"
                                : order.status === "delivered"
                                  ? "default"
                                  : "outline"
                            }
                            className="flex items-center space-x-1"
                          >
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setOrderToDelete(order._id)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[800px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-2">
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span>{selectedOrder.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-600">Address:</span>
                      <span className="text-right">{selectedOrder.address}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-2">
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Order ID:</span>
                      <span>{selectedOrder._id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Status:</span>
                      <Badge variant="outline" className="ml-1">
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Quantity:</span>
                      <span>{selectedOrder.quantity}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Total Amount:</span>
                      <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="font-medium text-gray-600">Created At:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedOrder.updatedAt && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Updated At:</span>
                        <span>{new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {product && (
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="font-medium text-lg">{product.name}</div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="font-medium text-gray-600">Price:</span>
                          <span>${product.price.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600">{product.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

