"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Tag, DollarSign, FileText } from "lucide-react"
import type { Product, Category } from "@/lib/api"

interface ProductDetailProps {
  product: Product
  category?: Category
  onClose: () => void
}

export default function ProductDetail({ product, category, onClose }: ProductDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="w-6 h-6" />
                {product.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {category?.name || "Sin categoría"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />${product.price.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        {product.description && (
          <>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Descripción
                </h3>
                <CardDescription className="text-base leading-relaxed">{product.description}</CardDescription>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {category && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de la Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nombre: </span>
                <span>{category.name}</span>
              </div>
              {category.description && (
                <div>
                  <span className="font-medium">Descripción: </span>
                  <span className="text-muted-foreground">{category.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  )
}
