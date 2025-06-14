
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaKitResources, useDeleteMediaKitResource } from '@/hooks/useMediaKitResources';
import { MediaKitResourceForm } from './MediaKitResourceForm';
import { FolderOpen, Edit, Trash2, Search, Filter, ExternalLink, Download, Eye, EyeOff, Image, Video, FileText, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const MediaKitManager = () => {
  const { data: resources, isLoading } = useMediaKitResources();
  const deleteResource = useDeleteMediaKitResource();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');

  const resourceCategories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'press_convocation', label: 'Convocatorias de Prensa' },
    { value: 'press_note', label: 'Notas de Prensa' },
    { value: 'banners', label: 'Banners' },
    { value: 'photos', label: 'Fotografías' },
    { value: 'videos', label: 'Videos' },
  ];

  const getCategoryLabel = (category: string) => {
    return resourceCategories.find(c => c.value === category)?.label || category;
  };

  const getCategoryIcon = (category: string) => {
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

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'press_convocation': return 'default';
      case 'press_note': return 'secondary';
      case 'banners': return 'outline';
      case 'photos': return 'destructive';
      case 'videos': return 'default';
      default: return 'secondary';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredResources = resources?.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    const matchesActive = filterActive === 'all' || 
                         (filterActive === 'active' && resource.active) ||
                         (filterActive === 'inactive' && !resource.active);
    
    return matchesSearch && matchesCategory && matchesActive;
  }) || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteResource.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleDownload = (url: string, name: string) => {
    // En un entorno real, esto abriría el archivo para descarga
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión del Kit de Medios</h2>
          <p className="text-muted-foreground">
            Administra todos los recursos multimedia para campañas
          </p>
        </div>
        <MediaKitResourceForm />
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resourceCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de recursos */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay recursos</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterCategory !== 'all' || filterActive !== 'all'
                ? 'No se encontraron recursos con los filtros aplicados.'
                : 'Añade tu primer recurso al kit de medios.'
              }
            </p>
            {!searchQuery && filterCategory === 'all' && filterActive === 'all' && <MediaKitResourceForm />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{resource.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {resource.description || 'Sin descripción'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {resource.active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getCategoryBadgeVariant(resource.category)}>
                    {getCategoryLabel(resource.category)}
                  </Badge>
                  <Badge variant={resource.active ? 'default' : 'secondary'}>
                    {resource.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {resource.format && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Formato:</span>
                      <Badge variant="outline">{resource.format}</Badge>
                    </div>
                  )}
                  
                  {resource.file_size && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tamaño:</span>
                      <span>{formatFileSize(resource.file_size)}</span>
                    </div>
                  )}
                  
                  {resource.tags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  Actualizado: {format(new Date(resource.updated_at), 'dd MMM yyyy', { locale: es })}
                </div>
              </CardContent>

              <CardContent className="pt-0">
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(resource.url, resource.name)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(resource.url, resource.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <MediaKitResourceForm
                    resource={resource}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="px-3">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente
                          el recurso "{resource.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(resource.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
