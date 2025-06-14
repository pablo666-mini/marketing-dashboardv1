
import { useState } from 'react';
import { useSocialPostsByLaunch } from '@/hooks/useSocialPosts';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Calendar, User, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PostForm } from '@/components/PostForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SocialPost, PostStatus } from '@/types';

interface LaunchPostsProps {
  launchId: string;
  launchName: string;
}

const LaunchPosts = ({ launchId, launchName }: LaunchPostsProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
            </CardTitle>
            <CardDescription>
              Publicaciones programadas para "{launchName}"
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Publicación
              </Button>
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
                  // The PostForm will handle the creation with launch_id
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
                <div key={post.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(post.status || 'Draft')}>
                          {getStatusText(post.status || 'Draft')}
                        </Badge>
                        <Badge variant="outline">
                          {post.content_type}
                        </Badge>
                        {post.content_format && (
                          <Badge variant="secondary">
                            {post.content_format}
                          </Badge>
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
      </CardContent>
    </Card>
  );
};

export default LaunchPosts;
