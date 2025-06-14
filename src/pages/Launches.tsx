
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunches } from '@/hooks/useLaunches';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaunchFilters, LaunchStatus, LaunchCategory } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Search, Filter, Rocket, Calendar, User } from 'lucide-react';
import LaunchForm from '@/components/LaunchForm';

const Launches = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LaunchFilters>({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: launches, isLoading } = useLaunches(filters);
  const { data: products } = useProducts();

  const getStatusColor = (status: LaunchStatus) => {
    switch (status) {
      case 'Planned': return 'bg-blue-500 hover:bg-blue-600';
      case 'In Progress': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'Canceled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getCategoryColor = (category: LaunchCategory) => {
    switch (category) {
      case 'Product Launch': return 'bg-purple-100 text-purple-800';
      case 'Campaign': return 'bg-orange-100 text-orange-800';
      case 'Update': return 'bg-blue-100 text-blue-800';
      case 'Other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLaunches = launches?.filter(launch =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    launch.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    total: launches?.length || 0,
    planned: launches?.filter(l => l.status === 'Planned').length || 0,
    inProgress: launches?.filter(l => l.status === 'In Progress').length || 0,
    completed: launches?.filter(l => l.status === 'Completed').length || 0,
    canceled: launches?.filter(l => l.status === 'Canceled').length || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Lanzamientos</h1>
          <p className="text-muted-foreground">
            Planifica y gestiona lanzamientos de productos y campañas
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Lanzamiento
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planificados</CardTitle>
            <div className="text-2xl font-bold text-blue-600">{stats.planned}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Progreso</CardTitle>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completados</CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelados</CardTitle>
            <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lanzamientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status?.[0] || 'all'}
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  status: value !== 'all' ? [value as LaunchStatus] : undefined 
                }))
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Planned">Planificado</SelectItem>
                <SelectItem value="In Progress">En Progreso</SelectItem>
                <SelectItem value="Completed">Completado</SelectItem>
                <SelectItem value="Canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category?.[0] || 'all'}
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  category: value !== 'all' ? [value as LaunchCategory] : undefined 
                }))
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Product Launch">Lanzamiento de Producto</SelectItem>
                <SelectItem value="Campaign">Campaña</SelectItem>
                <SelectItem value="Update">Actualización</SelectItem>
                <SelectItem value="Other">Otro</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.productId || 'all'}
              onValueChange={(value) => 
                setFilters(prev => ({ 
                  ...prev, 
                  productId: value !== 'all' ? value : undefined 
                }))
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Launches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLaunches.map((launch) => {
          const product = products?.find(p => p.id === launch.product_id);
          
          return (
            <Card key={launch.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg line-clamp-1">{launch.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(launch.status)}>
                    {launch.status === 'Planned' && 'Planificado'}
                    {launch.status === 'In Progress' && 'En Progreso'}
                    {launch.status === 'Completed' && 'Completado'}
                    {launch.status === 'Canceled' && 'Cancelado'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getCategoryColor(launch.category)}>
                    {launch.category === 'Product Launch' && 'Lanzamiento de Producto'}
                    {launch.category === 'Campaign' && 'Campaña'}
                    {launch.category === 'Update' && 'Actualización'}
                    {launch.category === 'Other' && 'Otro'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {product && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Producto:</strong> {product.name}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Responsable: {launch.responsible}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(launch.start_date), 'dd/MM/yyyy', { locale: es })} - {' '}
                    {format(new Date(launch.end_date), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>

                {launch.description && (
                  <CardDescription className="line-clamp-2">
                    {launch.description}
                  </CardDescription>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => navigate(`/lanzamientos/${launch.id}`)}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLaunches.length === 0 && (
        <Card className="p-8 text-center">
          <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron lanzamientos</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza creando tu primer lanzamiento'
            }
          </p>
          {!searchTerm && Object.keys(filters).length === 0 && (
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Lanzamiento
            </Button>
          )}
        </Card>
      )}

      {/* Create Launch Form Modal */}
      {showCreateForm && (
        <LaunchForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Launches;
