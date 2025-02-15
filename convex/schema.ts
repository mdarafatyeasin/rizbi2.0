import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(), // Product name
    description: v.optional(v.string()), // Optional product description
    price: v.number(), // Product price
    stock: v.number(), // Stock quantity
    category: v.string(), // Category of the product
    image: v.string(), // Single image URL
    size: v.array(v.string()), // Product sizes
    rating: v.optional(v.number()), // Average product rating
    createdAt: v.number(), // Timestamp for product creation
  })
    .index("by_category", ["category"])
    .index("by_price", ["price"])
    .index("by_name", ["name"]),

  orders: defineTable({
    customerName: v.string(), // Customer's name
    phoneNumber: v.string(), // Contact number
    address: v.string(), // Delivery address
    productID: v.id("products"), // Relational Product ID (linked to 'products' table)
    quantity: v.number(), // Quantity ordered
    totalAmount: v.number(), // Total price
    status: v.union(
      v.literal("pending"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("canceled")
    ), // Order status
    createdAt: v.number(), // Order placement timestamp
    updatedAt: v.optional(v.number()), // Last update timestamp
  })
    .index("by_phone", ["phoneNumber"]) // Fetch orders by phone number
    .index("by_status", ["status"]) // Retrieve orders by status
    .index("by_product", ["productID"]), // Get all orders of a specific product
});
