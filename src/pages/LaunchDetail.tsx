
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLaunch, useUpdateLaunch, useDeleteLaunch } from '@/hooks/useLaunches';
import { useLaunchPhases } from '@/hooks/useLaunchPhases';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { LaunchStatus, LaunchCategory } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Package, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import LaunchForm from '@/components/LaunchForm';
import LaunchPhaseForm from '@/components/LaunchPhaseForm';
import LaunchPhaseCard from '@/components/LaunchPhaseCard';

const LaunchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreatePhaseForm, setShowCreatePhaseForm] = useState(false);

  const { data: launch, isLoading } = useLaunch(id!);
  const { data: phases, isLoading: phasesLoading } = useLaunchPhases(id!);
  const { data: products } = useProducts();
  const updateLaunch = useUpdateLaunch();
  const deleteLaunch = useDeleteLaunch();

  const product = products?.find(p => p.id === launch?.product_id);

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

  const handleDeleteLaunch = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lanzamiento? Esta acción no se puede deshacer.')) {
      deleteLaunch.mutate(id!, {
        onSuccess: () => {
          navigate('/lanzamientos');
        }
      });
    }
  };

  const getPhaseStats = () => {
    if (!phases) return { total: 0, notStarted: 0, inProgress: 0, completed: 0, blocked: 0 };
    
    return {
      total: phases.length,
      notStarted: phases.filter(p => p.status === 'Not Started').length,
      inProgress: phases.filter(p => p.status === 'In Progress').length,
      completed: phases.filter(p => p.status === 'Completed').length,
      blocked: phases.filter(p => p.status === 'Blocked').length,
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Lanzamiento no encontrado</h2>
        <p className="text-muted-foreground mb-6">
          El lanzamiento que buscas no existe o ha sido eliminado.
        </p>
        <Button onClick={() => navigate('/lanzamientos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Lanzamientos
        </Button>
      </div>
    );
  }

  const phaseStats = getPhaseStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/lanzamientos')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{launch.name}</h1>
            <p className="text-muted-foreground">
              Gestión detallada del lanzamiento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEditForm(true)}
            disabled={updateLaunch.isPending}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteLaunch}
            disabled={deleteLaunch.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Launch Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{launch.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(launch.status)}>
                      {launch.status === 'Planned' && 'Planificado'}
                      {launch.status === 'In Progress' && 'En Progreso'}
                      {launch.status === 'Completed' && 'Completado'}
                      {launch.status === 'Canceled' && 'Cancelado'}
                    </Badge>
                    <Badge variant="secondary" className={getCategoryColor(launch.category)}>
                      {launch.category === 'Product Launch' && 'Lanzamiento de Producto'}
                      {launch.category === 'Campaign' && 'Campaña'}
                      {launch.category === 'Update' && 'Actualización'}
                      {launch.category === 'Other' && 'Otro'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {product && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Producto:</span>
                  <span>{product.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Responsable:</span>
                <span>{launch.responsible}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Período:</span>
                <span>
                  {format(new Date(launch.start_date), 'dd/MM/yyyy', { locale: es })} - {' '}
                  {format(new Date(launch.end_date), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>

              {launch.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Descripción</h4>
                    <CardDescription className="whitespace-pre-wrap">
                      {launch.description}
                    </CardDescription>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Phases Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Fases del Lanzamiento ({phaseStats.total})
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowCreatePhaseForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Fase
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {phasesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : phases && phases.length > 0 ? (
                <div className="space-y-4">
                  {phases.map((phase) => (
                    <LaunchPhaseCard key={phase.id} phase={phase} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay fases definidas</h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza agregando las fases de este lanzamiento
                  </p>
                  <Button onClick={() => setShowCreatePhaseForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Fase
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Phase Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Fases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm">Sin Comenzar</span>
                </div>
                <span className="font-medium">{phaseStats.notStarted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">En Progreso</span>
                </div>
                <span className="font-medium">{phaseStats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm">Completadas</span>
                </div>
                <span className="font-medium">{phaseStats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm">Bloqueadas</span>
                </div>
                <span className="font-medium">{phaseStats.blocked}</span>
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Creado:</span>
                <div className="font-medium">
                  {format(new Date(launch.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Última actualización:</span>
                <div className="font-medium">
                  {format(new Date(launch.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Duración:</span>
                <div className="font-medium">
                  {Math.ceil((new Date(launch.end_date).getTime() - new Date(launch.start_date).getTime()) / (1000 * 60 * 60 * 24))} días
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Launch Form Modal */}
      {showEditForm && (
        <LaunchForm
          launch={launch}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => setShowEditForm(false)}
        />
      )}

      {/* Create Phase Form Modal */}
      {showCreatePhaseForm && (
        <LaunchPhaseForm
          launchId={launch.id}
          onClose={() => setShowCreatePhaseForm(false)}
          onSuccess={() => setShowCreatePhaseForm(false)}
        />
      )}
    </div>
  );
};

export default LaunchDetail;
