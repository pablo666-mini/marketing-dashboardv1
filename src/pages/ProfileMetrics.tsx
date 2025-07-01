
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';
import { useFetchProfileMetrics } from '@/hooks/useFetchMetrics';
import { ProfileMetricsChart } from '@/components/ProfileMetricsChart';
import { SchedulePostForm } from '@/components/SchedulePostForm';
import { ScheduledPostsList } from '@/components/ScheduledPostsList';
import { RefreshCw, ArrowLeft, BarChart3, Calendar, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileMetrics = () => {
  const { id } = useParams<{ id: string }>();
  const { data: profiles, isLoading: profilesLoading } = useSocialProfiles();
  const fetchMetricsMutation = useFetchProfileMetrics();

  const profile = profiles?.find(p => p.id === id);

  const handleRefreshMetrics = () => {
    if (id) {
      fetchMetricsMutation.mutate(id);
    }
  };

  if (profilesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/profiles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Perfiles
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Perfil no encontrado</CardTitle>
            <CardDescription>
              El perfil solicitado no existe o ha sido eliminado.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/profiles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Perfiles
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {profile.name}
            </h1>
            <p className="text-muted-foreground">
              {profile.platform} • @{profile.handle}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleRefreshMetrics}
          disabled={fetchMetricsMutation.isPending}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${fetchMetricsMutation.isPending ? 'animate-spin' : ''}`} />
          {fetchMetricsMutation.isPending ? 'Actualizando...' : 'Actualizar Métricas'}
        </Button>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Programar Post
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Posts Programados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {profile.followers_count?.toLocaleString() || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Seguidores Actuales
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {profile.engagement_rate?.toFixed(1) || 'N/A'}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasa de Engagement
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {profile.last_updated 
                    ? new Date(profile.last_updated).toLocaleDateString('es-ES')
                    : 'Nunca'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Última Actualización
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Chart */}
          <ProfileMetricsChart 
            profileId={profile.id} 
            profileName={profile.name}
            days={30}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <SchedulePostForm />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledPostsList profileId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileMetrics;
