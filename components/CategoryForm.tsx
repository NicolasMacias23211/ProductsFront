"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { categoriesApi, type Category } from "@/lib/api"

interface CategoryFormProps {
  category?: Category | null
  onSuccess: () => void
  onCancel: () => void
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category) {
        await categoriesApi.update(category.id, formData)
        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente",
        })
      } else {
        await categoriesApi.create(formData)
        toast({
          title: "Éxito",
          description: "Categoría creada correctamente",
        })
      }
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: category ? "No se pudo actualizar la categoría" : "No se pudo crear la categoría",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nombre de la categoría"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción de la categoría (opcional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : category ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
