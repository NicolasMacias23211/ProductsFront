const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  Categorias_id: number
  category?: Category
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories/`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  getById: async (id: number): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`)
    if (!response.ok) throw new Error("Failed to fetch category")
    return response.json()
  },

  create: async (category: Omit<Category, "id">): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error("Failed to create category")
    return response.json()
  },

  update: async (id: number, category: Omit<Category, "id">): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error("Failed to update category")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete category")
  },
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) throw new Error("Failed to fetch products")
    return response.json()
  },

  getById: async (id: number): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products/${id}`)
    if (!response.ok) throw new Error("Failed to fetch product")
    return response.json()
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error("Failed to create product")
    return response.json()
  },

  update: async (id: number, product: Omit<Product, "id">): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error("Failed to update product")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete product")
  },
}
