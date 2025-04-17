// src/store/product.js
import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  resetProducts: () => set({ products: [] }), // ← Clear all products on logout or unauthenticated

  // 🔔 NEW: Low‑stock threshold and setter
  lowStockThreshold: 5,
  setLowStockThreshold: (value) => set({ lowStockThreshold: value }),

  // ---------------------------
  // CREATE  (multipart upload)
  // ---------------------------
  createProduct: async (formData) => {
    // Basic validation – now based on FormData, not JSON
    if (
      !formData.get("name") ||
      !formData.get("price") ||
      !formData.get("image")
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    // Retrieve JWT token from localStorage
    const token = localStorage.getItem("token");

    // NOTE: do NOT set Content‑Type; fetch will add the multipart boundary
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Upload failed." };
    }

    // Update the store with the newly created product
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },

  // ---------------------------
  // READ  (fetch all products)
  // ---------------------------
  fetchProducts: async () => {
    const token = localStorage.getItem("token");

    // If no token, clear products and don’t attempt fetch
    if (!token) {
      set({ products: [] });
      return;
    }

    try {
      const res = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Treat non‑OK (401, etc.) as “no products”
      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      set({ products: data.data || [] }); // only this user’s products
    } catch (error) {
      console.warn("fetchProducts failed:", error);
      set({ products: [] });
    }
  },

  // ---------------------------
  // DELETE
  // ---------------------------
  deleteProduct: async (pid) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // Immediately update the UI by removing the product from the store
    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));

    return { success: true, message: data.message };
  },

  // ---------------------------
  // UPDATE
  // ---------------------------
  updateProduct: async (pid, updatedProduct) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(updatedProduct),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // Update the store with the updated product
    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product
      ),
    }));

    return { success: true, message: data.message };
  },
}));
