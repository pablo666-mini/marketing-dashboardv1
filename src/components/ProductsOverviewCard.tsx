
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Plus, Package } from 'lucide-react';
import type { Product } from '@/types/supabase';

interface ProductsOverviewCardProps {
  products: Product[] | undefined;
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export const ProductsOverviewCard = ({ products, onCreateProduct, onEditProduct }: ProductsOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos ({products?.length || 0})
            </CardTitle>
            <CardDescription>
              Productos disponibles para lanzamientos y campañas
            </CardDescription>
          </div>
          <Button onClick={onCreateProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditProduct(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {product.landing_url && (
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                        <a href={product.landing_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {product.hashtags?.slice(0, 3).map((hashtag) => (
                    <Badge key={hashtag} variant="outline" className="text-xs">{hashtag}</Badge>
                  ))}
                  {(product.hashtags?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs">+{(product.hashtags?.length || 0) - 3}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay productos configurados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer producto para poder asociarlo a lanzamientos
            </p>
            <Button onClick={onCreateProduct} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Producto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
