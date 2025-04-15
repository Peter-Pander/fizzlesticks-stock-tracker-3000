import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  // 🔔 NEW: Low stock threshold and setter
  lowStockThreshold: 5,
  setLowStockThreshold: (value) => set({ lowStockThreshold: value }),

  createProduct: async (newProduct) => {
    // Basic validation (you might also want to convert price to a number etc.)
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }

    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();

    // Update the store with the newly created product
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },

  fetchProducts: async () => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    const res = await fetch("/api/products", {
      headers: {
        "Authorization": token ? `Bearer ${token}` : ""
      }
    });
    const data = await res.json();
    // Update the store with products specific to this user
    set({ products: data.data });
  },

  deleteProduct: async (pid) => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
      headers: {
        "Authorization": token ? `Bearer ${token}` : ""
      }
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // Immediately update the UI by removing the product from the store
    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));

    return { success: true, message: data.message };
  },

  updateProduct: async (pid, updatedProduct) => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
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
