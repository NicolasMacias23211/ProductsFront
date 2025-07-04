import ProductList from "@/components/ProductList"

interface Props {
  params: { id: string }
}

export default async function CategoryProductsPage({ params }: Props) {
  const categoryId = Number(params.id)
  // Aquí podrías hacer fetch si lo necesitas
  return <ProductList categoryId={categoryId} />
}
