import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new product
export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    stock: v.number(),
    category: v.string(),
    image: v.string(),
    size: v.array(v.string()),
    rating: v.optional(v.number()),
  },
  handler: async ({ db }, args) => {
    return await db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get all products
export const getAllProducts = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query("products").collect();
  },
});

// Get a product by ID
export const getProductById = query({
  args: {
    productID: v.id("products"),
  },
  handler: async ({ db }, { productID }) => {
    return await db.get(productID);
  },
});

// Update a product by ID
export const updateProduct = mutation({
  args: {
    productID: v.id("products"),
    updatedFields: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      price: v.optional(v.number()),
      stock: v.optional(v.number()),
      category: v.optional(v.string()),
      image: v.optional(v.string()),
      size: v.optional(v.array(v.string())),
      rating: v.optional(v.number()),
    }),
  },
  handler: async ({ db }, { productID, updatedFields }) => {
    return await db.patch(productID, updatedFields);
  },
});

// Delete a product by ID
export const deleteProduct = mutation({
  args: {
    productID: v.id("products"),
  },
  handler: async ({ db }, { productID }) => {
    return await db.delete(productID);
  },
});
