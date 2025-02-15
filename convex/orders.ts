import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 🛒 Create an Order
export const createOrder = mutation({
  args: {
    customerName: v.string(),
    phoneNumber: v.string(),
    address: v.string(),
    productID: v.id("products"), // Relational Product ID
    quantity: v.number(),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const orderID = await ctx.db.insert("orders", {
      ...args,
      status: "pending", // Default status when placing an order
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return orderID;
  },
});

// 📦 Get All Orders
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

// 📞 Get Orders by Phone Number
export const getOrdersByPhone = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", args.phoneNumber))
      .collect();
  },
});

// 🚚 Get Orders by Status (pending, shipped, delivered, canceled)
export const getOrdersByStatus = query({
  args: { status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered"), v.literal("canceled")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// 🔄 Update Order Status
export const updateOrderStatus = mutation({
  args: { orderID: v.id("orders"), status: v.union(v.literal("pending"), v.literal("shipped"), v.literal("delivered"), v.literal("canceled")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderID, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// ❌ Delete an Order
export const deleteOrder = mutation({
  args: { orderID: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.orderID);
  },
});
