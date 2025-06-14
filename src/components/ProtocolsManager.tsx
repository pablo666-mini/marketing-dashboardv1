
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useProtocols, useDeleteProtocol } from '@/hooks/useProtocols';
import { ProtocolForm } from './ProtocolForm';
import { FileText, Edit, Trash2, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProtocolsManager = () => {
  const { data: protocols, isLoading } = useProtocols();
  const deleteProtocol = useDeleteProtocol();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');

  const protocolTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'image_naming', label: 'Nomenclatura de Imágenes' },
    { value: 'briefing', label: 'Estructura de Briefing' },
    { value: 'hashtags', label: 'Estrategia de Hashtags' },
    { value: 'general', label: 'General' },
  ];

  const getTypeLabel = (type: string) => {
    return protocolTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'image_naming': return 'default';
      case 'briefing': return 'secondary';
      case 'hashtags': return 'outline';
      case 'general': return 'destructive';
      default: return 'default';
    }
  };

  const filteredProtocols = protocols?.filter(protocol => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || protocol.type === filterType;
    const matchesActive = filterActive === 'all' || 
                         (filterActive === 'active' && protocol.active) ||
                         (filterActive === 'inactive' && !protocol.active);
    
    return matchesSearch && matchesType && matchesActive;
  }) || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteProtocol.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting protocol:', error);
    }
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
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Protocolos</h2>
          <p className="text-muted-foreground">
            Administra las guías y estándares de comunicación
          </p>
        </div>
        <ProtocolForm />
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar protocolos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {protocolTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

      {/* Lista de protocolos */}
      {filteredProtocols.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay protocolos</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== 'all' || filterActive !== 'all'
                ? 'No se encontraron protocolos con los filtros aplicados.'
                : 'Crea tu primer protocolo de comunicación.'
              }
            </p>
            {!searchQuery && filterType === 'all' && filterActive === 'all' && <ProtocolForm />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProtocols.map((protocol) => (
            <Card key={protocol.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{protocol.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {protocol.description || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {protocol.active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getTypeBadgeVariant(protocol.type)}>
                    {getTypeLabel(protocol.type)}
                  </Badge>
                  <Badge variant={protocol.active ? 'default' : 'secondary'}>
                    {protocol.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="bg-muted p-3 rounded text-sm h-32 overflow-hidden relative">
                  <div className="whitespace-pre-wrap line-clamp-5">
                    {protocol.content}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted to-transparent" />
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  Actualizado: {format(new Date(protocol.updated_at), 'dd MMM yyyy', { locale: es })}
                </div>
              </CardContent>

              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <ProtocolForm
                    protocol={protocol}
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
                          el protocolo "{protocol.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(protocol.id)}
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
