
// General Information page - displays products, protocols, and media kit
import { useProducts } from '@/hooks/useProducts';
import { useProtocols } from '@/hooks/useProtocols';
import { useMediaKitResources } from '@/hooks/useMediaKitResources';
import { useLaunchesWithPosts } from '@/hooks/useLaunchesWithPosts';
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
import { 
  GanttProvider, 
  GanttSidebar, 
  GanttTimeline, 
  GanttHeader, 
  GanttFeatureListGroup, 
  GanttFeatureItem, 
  GanttToday 
} from '@/components/ui/gantt';
import type { Product, GanttFeature } from '@/types';
import LaunchTimeline from '@/components/LaunchTimeline';

const GeneralInfo = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: protocols, isLoading: protocolsLoading } = useProtocols();
  const { data: mediaResources, isLoading: mediaLoading } = useMediaKitResources();
  const { data: launches, isLoading: launchesLoading } = useLaunchesWithPosts();
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

  // Transform launches data for Gantt component
  const ganttFeatures: GanttFeature[] = launches?.map(launch => ({
    id: launch.id,
    name: launch.name,
    startAt: new Date(launch.startDate),
    endAt: new Date(launch.endDate),
    status: launch.status,
    posts: launch.posts.map(post => ({
      id: post.id,
      name: `Post`,
      postDate: new Date(post.postDate),
      profileIds: post.profileIds
    }))
  })) || [];

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

          {/* Campaign Timeline Section */}
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Timeline de Campañas</h2>
              <p className="text-muted-foreground text-sm">
                Visualización de lanzamientos y posts programados
              </p>
            </div>
            
            {launchesLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : launches && launches.length > 0 ? (
              <div className="flex border rounded-lg bg-white h-[500px]">
                <GanttProvider features={ganttFeatures} range="monthly" zoom={100}>
                  <GanttSidebar>
                    {launches.map(launch => (
                      <GanttFeatureListGroup key={launch.id} name={launch.name}>
                        <GanttFeatureItem
                          id={launch.id}
                          name={launch.name}
                          startAt={new Date(launch.startDate)}
                          endAt={new Date(launch.endDate)}
                          status={launch.status}
                          posts={launch.posts.map(post => ({
                            id: post.id,
                            name: 'Post',
                            postDate: new Date(post.postDate),
                            profileIds: post.profileIds
                          }))}
                        />
                      </GanttFeatureListGroup>
                    ))}
                  </GanttSidebar>
                  <div className="flex-1 flex flex-col">
                    <GanttHeader />
                    <div className="flex-1 relative">
                      <GanttTimeline>
                        <GanttToday />
                      </GanttTimeline>
                    </div>
                  </div>
                </GanttProvider>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <p className="text-muted-foreground">
                  No hay lanzamientos programados. Crea tu primera campaña para ver el timeline.
                </p>
              </div>
            )}
          </section>
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
