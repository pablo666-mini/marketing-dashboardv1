
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Edit, Plus, Package } from 'lucide-react';
import type { Product } from '@/types/supabase';

interface ProductsManagementTabProps {
  products: Product[] | undefined;
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export const ProductsManagementTab = ({ products, onCreateProduct, onEditProduct }: ProductsManagementTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestión de Productos
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
      <CardContent className="space-y-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.description && (
                    <p className="text-muted-foreground">{product.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditProduct(product)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  {product.landing_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={product.landing_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Producto
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              {product.creative_concept && (
                <div className="space-y-2">
                  <h4 className="font-medium">Concepto Creativo:</h4>
                  <p className="text-sm text-muted-foreground">{product.creative_concept}</p>
                </div>
              )}
              
              {product.countries && product.countries.length > 0 && (
                <div>
                  <h4 className="font-medium">Países:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.countries.map((country) => (
                      <Badge key={country} variant="secondary">{country}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {product.hashtags && product.hashtags.length > 0 && (
                <div>
                  <h4 className="font-medium">Hashtags:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="outline">{hashtag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.sales_objectives && product.sales_objectives.length > 0 && (
                <div>
                  <h4 className="font-medium">Objetivos de Venta:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.sales_objectives.map((objective) => (
                      <Badge key={objective} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.briefing && (
                <div className="space-y-2">
                  <h4 className="font-medium">Briefing:</h4>
                  <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                    {product.briefing}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {product.communication_kit_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={product.communication_kit_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Kit de Comunicación
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))
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
