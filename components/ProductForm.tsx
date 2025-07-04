"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { productsApi, type Product, type Category } from "@/lib/api"

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  defaultCategoryId?: number
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, categories, defaultCategoryId, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        categoryId: product.categoryId.toString(),
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: defaultCategoryId ? defaultCategoryId.toString() : "",
      })
    }
  }, [product, defaultCategoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        categoryId: Number.parseInt(formData.categoryId),
      }

      if (product) {
        await productsApi.update(product.id, productData)
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        })
      } else {
        await productsApi.create(productData)
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: product ? "No se pudo actualizar el producto" : "No se pudo crear el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría *</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del producto (opcional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
