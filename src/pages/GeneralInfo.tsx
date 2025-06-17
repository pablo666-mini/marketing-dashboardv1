// General Information page - displays products, protocols, and media kit
import { useProducts } from '@/hooks/useProducts';
import { useProtocols } from '@/hooks/useProtocols';
import { useMediaKitResources } from '@/hooks/useMediaKitResources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import ProductForm from '@/components/ProductForm';
import { ProtocolsManager } from '@/components/ProtocolsManager';
import { MediaKitManager } from '@/components/MediaKitManager';
import { ProductsOverviewCard } from '@/components/ProductsOverviewCard';
import { ProtocolsOverviewCard } from '@/components/ProtocolsOverviewCard';
import { MediaKitOverviewCard } from '@/components/MediaKitOverviewCard';
import { ProductsManagementTab } from '@/components/ProductsManagementTab';
import type { Product } from '@/types/supabase';
import LaunchTimeline from '@/components/LaunchTimeline';

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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseEditForm = () => {
    setEditingProduct(null);
  };

  const handleCreateProduct = () => {
    setShowCreateProductForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateProductForm(false);
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="protocols">Protocolos</TabsTrigger>
          <TabsTrigger value="media-kit">Kit de Medios</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProductsOverviewCard 
            products={products}
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProtocolsOverviewCard protocols={protocols} />
            <MediaKitOverviewCard mediaResources={mediaResources} />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <LaunchTimeline />
        </TabsContent>

        <TabsContent value="protocols">
          <ProtocolsManager />
        </TabsContent>

        <TabsContent value="media-kit">
          <MediaKitManager />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductsManagementTab 
            products={products}
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
          />
        </TabsContent>
      </Tabs>

      {/* Create Product Form Modal */}
      {showCreateProductForm && (
        <ProductForm
          onClose={handleCloseCreateForm}
          onSuccess={handleCloseCreateForm}
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
