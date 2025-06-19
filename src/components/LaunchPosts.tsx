
import { useState } from 'react';
import { useSocialPostsByLaunch, useCreateSocialPost, useUpdateSocialPost } from '@/hooks/useSocialPosts';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Calendar, User, Package, Edit, Rocket } from 'lucide-react';
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
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const { data: posts, isLoading: postsLoading } = useSocialPostsByLaunch(launchId);
  const { data: profiles } = useSocialProfiles();
  const { data: products } = useProducts();
  const createPost = useCreateSocialPost();
  const updatePost = useUpdateSocialPost();

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

  const handleCreatePost = async (postData: any) => {
    try {
      await createPost.mutateAsync({
        ...postData,
        launch_id: launchId // Ensure launch connection
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (postData: any) => {
    if (!editingPost) return;
    
    try {
      await updatePost.mutateAsync({ 
        id: editingPost.id, 
        updates: {
          ...postData,
          launch_id: launchId // Maintain launch connection
        }
      });
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
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
              <Rocket className="h-5 w-5 text-blue-600" />
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
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={createPost.isPending}
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
              // Support both legacy single profile and new multi-profile
              const profileIds = post.profile_ids && post.profile_ids.length > 0 
                ? post.profile_ids 
                : (post.profile_id ? [post.profile_id] : []);
              
              const postProfiles = profiles?.filter(p => profileIds.includes(p.id)) || [];
              const product = products?.find(p => p.id === post.product_id);
              const isMultiProfile = profileIds.length > 1;
              
              return (
                <div key={post.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                        {isMultiProfile && (
                          <Badge variant="outline" className="bg-blue-50">
                            Multi-perfil ({profileIds.length})
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(post.post_date), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                        </div>
                        {postProfiles.length > 0 && (
                          <div className="flex items-start gap-2">
                            <User className="h-3 w-3 mt-0.5" />
                            <div>
                              {isMultiProfile ? (
                                <div className="space-y-1">
                                  {postProfiles.map(profile => (
                                    <div key={profile.id} className="text-xs">
                                      {profile.name} (@{profile.handle}) - {profile.platform}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span>{postProfiles[0]?.name} (@{postProfiles[0]?.handle}) - {postProfiles[0]?.platform}</span>
                              )}
                            </div>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPost(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
            <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay publicaciones conectadas</h3>
            <p className="text-muted-foreground mb-4">
              Aún no se han creado publicaciones para este lanzamiento
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primera Publicación
            </Button>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Publicación del Lanzamiento</DialogTitle>
              <DialogDescription>
                Modifica la publicación manteniendo su conexión con "{launchName}"
              </DialogDescription>
            </DialogHeader>
            {editingPost && (
              <PostForm
                activeProfiles={activeProfiles}
                products={products || []}
                initialData={editingPost}
                onSubmit={handleUpdatePost}
                onCancel={() => setEditingPost(null)}
                isLoading={updatePost.isPending}
                defaultLaunchId={launchId}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LaunchPosts;
