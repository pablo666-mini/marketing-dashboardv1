
// General Information page - displays products, protocols, and media kit
import { useProducts } from '@/hooks/useProducts';
import { useProtocols } from '@/hooks/useProtocols';
import { useMediaKitResources } from '@/hooks/useMediaKitResources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, FileText, Image, Video, Megaphone, FolderOpen, Play, Plus, Package, Settings, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import ProductForm from '@/components/ProductForm';
import { ProtocolsManager } from '@/components/ProtocolsManager';
import { MediaKitManager } from '@/components/MediaKitManager';
import type { Product } from '@/types/supabase';

const GeneralInfo = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: protocols, isLoading: protocolsLoading } = useProtocols();
  const { data: mediaResources, isLoading: mediaLoading } = useMediaKitResources();
  const [showCreateProductForm, setShowCreateProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (productsLoading || protocolsLoading || mediaLoading) {
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

  const activeProtocols = protocols?.filter(p => p.active) || [];
  const activeMediaResources = mediaResources?.filter(r => r.active) || [];

  const getMediaIcon = (category: string) => {
    switch (category) {
      case 'press_convocation':
      case 'press_note':
        return <Megaphone className="h-4 w-4" />;
      case 'banners':
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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseEditForm = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Información General</h1>
        <p className="text-muted-foreground">
          Gestiona productos, protocolos y recursos para campañas de redes sociales
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="protocols">Protocolos</TabsTrigger>
          <TabsTrigger value="media-kit">Kit de Medios</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Products Section */}
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
                <Button onClick={() => setShowCreateProductForm(true)} className="gap-2">
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
                            onClick={() => handleEditProduct(product)}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Protocolos ({activeProtocols.length})
                    </CardTitle>
                    <CardDescription>
                      Guías y estándares para la gestión de contenido
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#protocols">
                      <Settings className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeProtocols.length > 0 ? (
                  <div className="space-y-3">
                    {activeProtocols.slice(0, 4).map((protocol) => (
                      <div key={protocol.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm">{protocol.title}</h3>
                          <Badge variant="outline" className="text-xs">{protocol.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {protocol.description}
                        </p>
                      </div>
                    ))}
                    {activeProtocols.length > 4 && (
                      <div className="text-center">
                        <Badge variant="secondary">+{activeProtocols.length - 4} más</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No hay protocolos activos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Kit Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Kit de Medios ({activeMediaResources.length})
                    </CardTitle>
                    <CardDescription>
                      Recursos disponibles para campañas
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#media-kit">
                      <Settings className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeMediaResources.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {activeMediaResources.slice(0, 6).map((resource) => (
                      <div key={resource.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-2">
                          <div className="p-1 bg-primary/10 rounded">
                            {getMediaIcon(resource.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs truncate">{resource.name}</h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {getCategoryName(resource.category)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {activeMediaResources.length > 6 && (
                      <div className="col-span-2 text-center">
                        <Badge variant="secondary">+{activeMediaResources.length - 6} más</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No hay recursos activos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="protocols">
          <ProtocolsManager />
        </TabsContent>

        <TabsContent value="media-kit">
          <MediaKitManager />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Products Section */}
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
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditProduct(product)}
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
                  <Button onClick={() => setShowCreateProductForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Producto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Product Form Modal */}
      {showCreateProductForm && (
        <ProductForm
          onClose={() => setShowCreateProductForm(false)}
          onSuccess={() => setShowCreateProductForm(false)}
        />
      )}

      {/* Edit Product Form Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseEditForm}
          onSuccess={handleCloseEditForm}
        />
      )}
    </div>
  );
};

export default GeneralInfo;
