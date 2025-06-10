
// Table component for displaying and managing social media posts
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  SocialPost, 
  SocialProfile, 
  Product, 
  PostStatus, 
  ContentType 
} from '@/types';

interface PostTableProps {
  posts: SocialPost[];
  profiles: SocialProfile[];
  products: Product[];
  onEdit: (post: SocialPost) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: PostStatus) => void;
  statusFilter: PostStatus | 'all';
  typeFilter: ContentType | 'all';
  onStatusFilterChange: (status: PostStatus | 'all') => void;
  onTypeFilterChange: (type: ContentType | 'all') => void;
}

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Approved': 'bg-blue-100 text-blue-800',
  'Published': 'bg-green-100 text-green-800',
  'Canceled': 'bg-red-100 text-red-800'
};

const statusLabels = {
  'Pending': 'Pendiente',
  'Approved': 'Aprobada',
  'Published': 'Publicada',
  'Canceled': 'Cancelada'
};

export const PostTable = ({
  posts,
  profiles,
  products,
  onEdit,
  onDelete,
  onStatusChange,
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange
}: PostTableProps) => {
  
  const getProfileName = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? `${profile.name} (${profile.platform})` : 'Perfil no encontrado';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Pending">Pendientes</SelectItem>
              <SelectItem value="Approved">Aprobadas</SelectItem>
              <SelectItem value="Published">Publicadas</SelectItem>
              <SelectItem value="Canceled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-48">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Post">Post</SelectItem>
              <SelectItem value="Reel">Reel</SelectItem>
              <SelectItem value="Story">Story</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay publicaciones que coincidan con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {format(new Date(post.date), 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(post.date), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{getProductName(post.productId)}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{getProfileName(post.profileId)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">{post.contentType}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary">{post.contentFormat}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Select 
                      value={post.status} 
                      onValueChange={(value: PostStatus) => onStatusChange(post.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[post.status]}>
                          {statusLabels[post.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pendiente</SelectItem>
                        <SelectItem value="Approved">Aprobada</SelectItem>
                        <SelectItem value="Published">Publicada</SelectItem>
                        <SelectItem value="Canceled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
