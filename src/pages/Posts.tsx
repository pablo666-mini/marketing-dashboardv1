
// Posts management page - create, edit, and manage social media posts
import { useState } from 'react';
import { usePosts, useActiveProfiles, useProducts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PostForm } from '@/components/PostForm';
import { PostTable } from '@/components/PostTable';
import { SocialPost, PostStatus, ContentType } from '@/types';

const Posts = () => {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: activeProfiles, isLoading: profilesLoading } = useActiveProfiles();
  const { data: products, isLoading: productsLoading } = useProducts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');

  if (postsLoading || profilesLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const handleCreatePost = async (postData: any) => {
    try {
      await createPost.mutateAsync(postData);
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
        updates: postData 
      });
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        await deletePost.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, status: PostStatus) => {
    try {
      await updatePost.mutateAsync({ id, updates: { status } });
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  // Filter posts
  const filteredPosts = posts?.filter(post => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (typeFilter !== 'all' && post.contentType !== typeFilter) return false;
    return true;
  }) || [];

  // Stats
  const stats = {
    total: posts?.length || 0,
    pending: posts?.filter(p => p.status === 'Pending').length || 0,
    approved: posts?.filter(p => p.status === 'Approved').length || 0,
    published: posts?.filter(p => p.status === 'Published').length || 0,
    canceled: posts?.filter(p => p.status === 'Canceled').length || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publicaciones</h1>
          <p className="text-muted-foreground">
            Gestiona el contenido para redes sociales
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Publicación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Publicación</DialogTitle>
              <DialogDescription>
                Completa la información para programar una nueva publicación en redes sociales
              </DialogDescription>
            </DialogHeader>
            <PostForm
              activeProfiles={activeProfiles || []}
              products={products || []}
              onSubmit={handleCreatePost}
              onCancel={() => setShowCreateDialog(false)}
              isLoading={createPost.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Aprobadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-muted-foreground">Publicadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
              <div className="text-sm text-muted-foreground">Canceladas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Publicaciones</CardTitle>
          <CardDescription>
            Gestiona y organiza todas las publicaciones programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostTable
            posts={filteredPosts}
            profiles={activeProfiles || []}
            products={products || []}
            onEdit={setEditingPost}
            onDelete={handleDeletePost}
            onStatusChange={handleStatusChange}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Publicación</DialogTitle>
            <DialogDescription>
              Modifica la información de la publicación
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <PostForm
              activeProfiles={activeProfiles || []}
              products={products || []}
              initialData={editingPost}
              onSubmit={handleUpdatePost}
              onCancel={() => setEditingPost(null)}
              isLoading={updatePost.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Posts;
