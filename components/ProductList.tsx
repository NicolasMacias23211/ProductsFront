"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { productsApi, categoriesApi, type Product, type Category } from "@/lib/api"
import ProductForm from "./ProductForm"
import ProductDetail from "./ProductDetail"
import Link from "next/link"

interface ProductListProps {
  categoryId?: number
}

export default function ProductList({ categoryId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [categoryId])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([productsApi.getAll(), categoriesApi.getAll()])

      setCategories(categoriesData)

      if (categoryId) {
        const filteredProducts = productsData.filter((p) => p.Categorias_id === categoryId)
        setProducts(filteredProducts)
        const category = categoriesData.find((c) => c.id === categoryId)
        setCurrentCategory(category || null)
      } else {
        setProducts(productsData)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id)
      setProducts(products.filter((prod) => prod.id !== id))
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
    loadData()
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "Sin categoría"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {categoryId && (
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Categorías
                </Button>
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold">
            {currentCategory ? `Productos - ${currentCategory.name}` : "Todos los Productos"}
          </h1>
          <p className="text-muted-foreground">
            {currentCategory ? currentCategory.description : "Gestiona todos los productos"}
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories}
              defaultCategoryId={categoryId}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
            <p className="text-muted-foreground text-center mb-4">
              {currentCategory
                ? `No hay productos en la categoría "${currentCategory.name}"`
                : "Comienza creando tu primer producto"}
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Producto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{getCategoryName(product.Categorias_id)}</Badge>
                      <span className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</span>
                    </div>
                    {product.description && <CardDescription className="mt-2">{product.description}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setViewingProduct(product)
                      setIsDetailOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{product.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Producto</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <ProductDetail
              product={viewingProduct}
              category={categories.find((c) => c.id === viewingProduct.Categorias_id)}
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
