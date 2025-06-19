
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLaunch, useUpdateLaunch, useDeleteLaunch } from '@/hooks/useLaunches';
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
  Rocket
} from 'lucide-react';
import LaunchForm from '@/components/LaunchForm';
import LaunchPosts from '@/components/LaunchPosts';

const LaunchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: launch, isLoading } = useLaunch(id!);
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

  const campaignDuration = Math.ceil((new Date(launch.end_date).getTime() - new Date(launch.start_date).getTime()) / (1000 * 60 * 60 * 24));

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
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Rocket className="h-8 w-8 text-blue-600" />
              {launch.name}
            </h1>
            <p className="text-muted-foreground">
              Gestión de campaña y contenido para redes sociales
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Launch details card */}
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
                <span className="font-medium">Período de Campaña:</span>
                <span>
                  {format(new Date(launch.start_date), 'dd/MM/yyyy', { locale: es })} - {' '}
                  {format(new Date(launch.end_date), 'dd/MM/yyyy', { locale: es })}
                  <span className="text-muted-foreground ml-2">({campaignDuration} días)</span>
                </span>
              </div>

              {launch.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Información de Contexto</h4>
                    <CardDescription className="whitespace-pre-wrap">
                      {launch.description}
                    </CardDescription>
                  </div>
                </>
              )}

              {product && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Información del Producto</h4>
                    <div className="space-y-2 text-sm">
                      {product.description && (
                        <div>
                          <span className="font-medium">Descripción:</span>
                          <p className="text-muted-foreground mt-1">{product.description}</p>
                        </div>
                      )}
                      {product.hashtags && product.hashtags.length > 0 && (
                        <div>
                          <span className="font-medium">Hashtags sugeridos:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.hashtags.map((hashtag, index) => (
                              <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                                #{hashtag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.landing_url && (
                        <div>
                          <span className="font-medium">Landing URL:</span>
                          <a 
                            href={product.landing_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-2"
                          >
                            {product.landing_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Social Posts Section */}
          <LaunchPosts launchId={launch.id} launchName={launch.name} />
        </div>

        {/* Sidebar - Campaign Info */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resumen de Campaña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{campaignDuration}</div>
                <div className="text-sm text-blue-800">días de campaña</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">
                    {format(new Date(launch.start_date), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fin:</span>
                  <span className="font-medium">
                    {format(new Date(launch.end_date), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge variant="outline" className={getStatusColor(launch.status)}>
                    {launch.status === 'Planned' && 'Planificado'}
                    {launch.status === 'In Progress' && 'En Progreso'}
                    {launch.status === 'Completed' && 'Completado'}
                    {launch.status === 'Canceled' && 'Cancelado'}
                  </Badge>
                </div>
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
                <span className="text-muted-foreground">Responsable:</span>
                <div className="font-medium">{launch.responsible}</div>
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
    </div>
  );
};

export default LaunchDetail;
