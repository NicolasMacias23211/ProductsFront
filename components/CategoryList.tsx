"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { categoriesApi, type Category } from "@/lib/api"
import CategoryForm from "./CategoryForm"
import Link from "next/link"

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await categoriesApi.delete(id)
      setCategories(categories.filter((cat) => cat.id !== id))
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
    loadCategories()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Administra las categorías de productos</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
            <p className="text-muted-foreground text-center mb-4">Comienza creando tu primera categoría de productos</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Categoría
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    {category.description && <CardDescription className="mt-2">{category.description}</CardDescription>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category)
                        setIsFormOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la categoría "{category.name}
                            ".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/categories/${category.id}`}>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Ver Productos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
