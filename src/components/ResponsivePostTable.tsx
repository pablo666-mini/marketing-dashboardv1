
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, User, Package, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TooltipWrapper } from '@/components/TooltipWrapper';
import type { SocialPost, SocialProfile, Product, Launch, PostStatus, ContentType } from '@/types';

interface ResponsivePostTableProps {
  posts: SocialPost[];
  profiles: SocialProfile[];
  products: Product[];
  launches: Launch[];
  onEdit: (post: SocialPost) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: PostStatus) => void;
  statusFilter: PostStatus | 'all';
  typeFilter: ContentType | 'all';
  onStatusFilterChange: (status: PostStatus | 'all') => void;
  onTypeFilterChange: (type: ContentType | 'all') => void;
}

export const ResponsivePostTable = ({ 
  posts, 
  profiles, 
  products, 
  launches,
  onEdit, 
  onDelete, 
  onStatusChange,
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange
}: ResponsivePostTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

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

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => {
    const profile = profiles.find(p => p.id === post.profile_id);
    const product = products.find(p => p.id === post.product_id);
    const launch = launches.find(l => l.id === post.launch_id);
    
    const searchString = `${profile?.name || ''} ${product?.name || ''} ${launch?.name || ''} ${post.content_type || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Draft">Borrador</SelectItem>
              <SelectItem value="Pending">Pendiente</SelectItem>
              <SelectItem value="Approved">Aprobada</SelectItem>
              <SelectItem value="Published">Publicada</SelectItem>
              <SelectItem value="Canceled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Post">Post</SelectItem>
              <SelectItem value="Story">Story</SelectItem>
              <SelectItem value="Reel">Reel</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <TooltipWrapper content="Vista de tarjetas (mejor para móviles)">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Tarjetas
            </Button>
          </TooltipWrapper>
          <TooltipWrapper content="Vista de tabla (mejor para escritorio)">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="hidden md:inline-flex"
            >
              Tabla
            </Button>
          </TooltipWrapper>
        </div>
      </div>

      {/* Posts Display */}
      {viewMode === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const profile = profiles.find(p => p.id === post.profile_id);
            const product = products.find(p => p.id === post.product_id);
            const launch = launches.find(l => l.id === post.launch_id);
            
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap gap-1">
                      <Badge className={getStatusColor(post.status || 'Draft')}>
                        {getStatusText(post.status || 'Draft')}
                      </Badge>
                      <Badge variant="outline">
                        {post.content_type}
                      </Badge>
                      {post.profile_ids && post.profile_ids.length > 1 && (
                        <Badge variant="secondary">
                          Multi-perfil
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <TooltipWrapper content="Editar publicación">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipWrapper>
                      <TooltipWrapper content="Eliminar publicación">
                        <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipWrapper>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(post.post_date), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                    </div>
                    {profile && (
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span className="truncate">{profile.name}</span>
                      </div>
                    )}
                    {product && (
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        <span className="truncate">{product.name}</span>
                      </div>
                    )}
                    {launch && (
                      <div className="text-xs text-muted-foreground">
                        Lanzamiento: {launch.name}
                      </div>
                    )}
                  </div>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                          #{hashtag}
                        </span>
                      ))}
                      {post.hashtags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.hashtags.length - 3} más
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // Table view for larger screens
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Perfil</th>
                <th className="text-left p-2">Producto</th>
                <th className="text-left p-2">Tipo</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => {
                const profile = profiles.find(p => p.id === post.profile_id);
                const product = products.find(p => p.id === post.product_id);
                
                return (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <Badge className={getStatusColor(post.status || 'Draft')}>
                        {getStatusText(post.status || 'Draft')}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">
                      {format(new Date(post.post_date), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="p-2 text-sm">
                      {profile ? `${profile.name} (@${profile.handle})` : 'N/A'}
                    </td>
                    <td className="p-2 text-sm">
                      {product?.name || 'N/A'}
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{post.content_type}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron publicaciones</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o el término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};
