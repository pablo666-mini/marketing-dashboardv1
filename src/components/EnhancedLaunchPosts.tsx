
import { useState } from 'react';
import { useSocialPostsByLaunch } from '@/hooks/useSocialPosts';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Calendar, User, Package, Eye, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PostForm } from '@/components/PostForm';
import { TooltipWrapper } from '@/components/TooltipWrapper';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SocialPost, PostStatus } from '@/types';

interface EnhancedLaunchPostsProps {
  launchId: string;
  launchName: string;
}

const EnhancedLaunchPosts = ({ launchId, launchName }: EnhancedLaunchPostsProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const { data: posts, isLoading: postsLoading } = useSocialPostsByLaunch(launchId);
  const { data: profiles } = useSocialProfiles();
  const { data: products } = useProducts();

  const activeProfiles = profiles?.filter(p => p.active) || [];

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Approved': return 'bg-blue-500';
      case 'Published': return 'bg-green-500';
      case 'Canceled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: PostStatus) => {
    switch (status) {
      case 'Draft': return 'Borrador';
      case 'Pending': return 'Pendiente';
      case 'Approved': return 'Aprobada';
      case 'Published': return 'Publicada';
      case 'Canceled': return 'Cancelada';
      default: return status;
    }
  };

  if (postsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Publicaciones del Lanzamiento ({posts?.length || 0})
              <TooltipWrapper
                content="Publicaciones programadas específicamente para este lanzamiento. Se pueden configurar con múltiples perfiles sociales y contenido personalizado."
                showIcon
                iconClassName="h-4 w-4 text-muted-foreground"
              />
            </CardTitle>
            <CardDescription>
              Publicaciones programadas para "{launchName}"
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <TooltipWrapper content="Crear nueva publicación asociada a este lanzamiento">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Publicación
                </Button>
              </TooltipWrapper>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Publicación para {launchName}</DialogTitle>
                <DialogDescription>
                  Esta publicación será asociada automáticamente con este lanzamiento
                </DialogDescription>
              </DialogHeader>
              <PostForm
                activeProfiles={activeProfiles}
                products={products || []}
                onSubmit={(postData) => {
                  setShowCreateDialog(false);
                }}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={false}
                defaultLaunchId={launchId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => {
              const profile = profiles?.find(p => p.id === post.profile_id);
              const product = products?.find(p => p.id === post.product_id);
              
              return (
                <div key={post.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <TooltipWrapper content={`Estado actual: ${getStatusText(post.status || 'Draft')}`}>
                          <Badge className={getStatusColor(post.status || 'Draft')}>
                            {getStatusText(post.status || 'Draft')}
                          </Badge>
                        </TooltipWrapper>
                        <TooltipWrapper content={`Tipo de contenido: ${post.content_type}`}>
                          <Badge variant="outline">
                            {post.content_type}
                          </Badge>
                        </TooltipWrapper>
                        {post.content_format && (
                          <TooltipWrapper content={`Formato específico: ${post.content_format}`}>
                            <Badge variant="secondary">
                              {post.content_format}
                            </Badge>
                          </TooltipWrapper>
                        )}
                        {post.profile_ids && post.profile_ids.length > 1 && (
                          <TooltipWrapper content={`Publicación multi-perfil: ${post.profile_ids.length} perfiles`}>
                            <Badge variant="outline" className="bg-blue-50">
                              Multi-perfil ({post.profile_ids.length})
                            </Badge>
                          </TooltipWrapper>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(post.post_date), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                        </div>
                        {profile && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{profile.name} (@{profile.handle})</span>
                          </div>
                        )}
                        {product && (
                          <div className="flex items-center gap-2">
                            <Package className="h-3 w-3" />
                            <span>{product.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <TooltipWrapper content="Ver detalles completos de la publicación">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPost(post)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipWrapper>
                  </div>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags.map((hashtag, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay publicaciones</h3>
            <p className="text-muted-foreground mb-4">
              Aún no se han creado publicaciones para este lanzamiento
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Publicación
            </Button>
          </div>
        )}

        {/* Modal de detalles de publicación */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de la Publicación</DialogTitle>
              <DialogDescription>
                Información completa de la publicación seleccionada
              </DialogDescription>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedPost.status || 'Draft')}>
                        {getStatusText(selectedPost.status || 'Draft')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo de Contenido</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPost.content_type}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de Publicación</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedPost.post_date), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                </div>
                {selectedPost.copies && (
                  <div>
                    <label className="text-sm font-medium">Copys por Plataforma</label>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(selectedPost.copies) ? 
                        selectedPost.copies.map((copy: any, index: number) => (
                          <div key={index} className="border rounded p-2">
                            <div className="font-medium text-sm">{copy.platform}</div>
                            <div className="text-sm text-muted-foreground mt-1">{copy.content}</div>
                          </div>
                        )) : 
                        <p className="text-sm text-muted-foreground">No hay copys configurados</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EnhancedLaunchPosts;
