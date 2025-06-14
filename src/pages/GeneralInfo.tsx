
// General Information page - displays products, protocols, and media kit
import { useGeneralInfo } from '@/hooks/useGeneralInfo';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, Image, Video, Megaphone, FolderOpen, Play, Plus, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import ProductForm from '@/components/ProductForm';

const GeneralInfo = () => {
  const { data: generalInfo, isLoading: generalLoading } = useGeneralInfo();
  const { data: products, isLoading: productsLoading } = useProducts();
  const [showCreateProductForm, setShowCreateProductForm] = useState(false);

  if (generalLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const getMediaIcon = (category: string) => {
    switch (category) {
      case 'press_convocation':
      case 'press_note':
        return <Megaphone className="h-4 w-4" />;
      case 'banners':
        return <Image className="h-4 w-4" />;
      case 'photos':
        return <Image className="h-4 w-4" />;
      case 'videos':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'press_convocation': return 'Convocatorias de Prensa';
      case 'press_note': return 'Notas de Prensa';
      case 'banners': return 'Banners';
      case 'photos': return 'Fotografías';
      case 'videos': return 'Videos';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Información General</h1>
        <p className="text-muted-foreground">
          Gestiona productos, protocolos y recursos para campañas de redes sociales
        </p>
      </div>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos
              </CardTitle>
              <CardDescription>
                Productos disponibles para lanzamientos y campañas
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateProductForm(true)} className="gap-2">
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
                  {product.landing_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={product.landing_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Producto
                      </a>
                    </Button>
                  )}
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
              <Button onClick={() => setShowCreateProductForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear Producto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocols Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Protocolos de Comunicación
            </CardTitle>
            <CardDescription>
              Guías y estándares para la gestión de contenido en redes sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(generalInfo?.protocols) && generalInfo.protocols.length > 0 ? (
              <div className="space-y-4">
                {generalInfo.protocols.map((protocol: any, index: number) => (
                  <div key={protocol.id || index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{protocol.title}</h3>
                      <Badge variant="outline">{protocol.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {protocol.description}
                    </p>
                    <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                      {protocol.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay protocolos configurados</h3>
                <p className="text-muted-foreground">
                  Los protocolos se configuran desde el panel de administración
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media Kit Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Kit de Medios
            </CardTitle>
            <CardDescription>
              Recursos disponibles para campañas y comunicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(generalInfo?.media_kit) && generalInfo.media_kit.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generalInfo.media_kit.map((resource: any, index: number) => (
                  <div key={resource.id || index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {resource.category === 'press_convocation' && <FileText className="h-5 w-5 text-primary" />}
                        {resource.category === 'press_note' && <FileText className="h-5 w-5 text-primary" />}
                        {resource.category === 'banners' && <Image className="h-5 w-5 text-primary" />}
                        {resource.category === 'photos' && <Image className="h-5 w-5 text-primary" />}
                        {resource.category === 'videos' && <Play className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {resource.category.replace('_', ' ')}
                        </p>
                        {resource.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        )}
                        <Button variant="ghost" size="sm" className="mt-2 h-8 px-2">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Abrir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay recursos disponibles</h3>
                <p className="text-muted-foreground">
                  Los recursos del kit de medios se configuran desde el panel de administración
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Product Form Modal */}
      {showCreateProductForm && (
        <ProductForm
          onClose={() => setShowCreateProductForm(false)}
          onSuccess={() => setShowCreateProductForm(false)}
        />
      )}
    </div>
  );
};

export default GeneralInfo;
