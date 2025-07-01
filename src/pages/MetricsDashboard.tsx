
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllProfilesLatestMetrics } from '@/hooks/useProfileMetrics';
import { useFetchAllMetrics } from '@/hooks/useFetchMetrics';
import { MetricsDashboardCard } from '@/components/MetricsDashboardCard';
import { RefreshCw, BarChart3 } from 'lucide-react';

const MetricsDashboard = () => {
  const { data: profilesMetrics, isLoading } = useAllProfilesLatestMetrics();
  const fetchAllMetricsMutation = useFetchAllMetrics();

  const handleRefreshAll = () => {
    fetchAllMetricsMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Dashboard de Métricas
          </h1>
          <p className="text-muted-foreground">
            Resumen de métricas de todos los perfiles de redes sociales
          </p>
        </div>
        
        <Button 
          onClick={handleRefreshAll}
          disabled={fetchAllMetricsMutation.isPending}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${fetchAllMetricsMutation.isPending ? 'animate-spin' : ''}`} />
          {fetchAllMetricsMutation.isPending ? 'Actualizando...' : 'Actualizar Todo'}
        </Button>
      </div>

      {!profilesMetrics || profilesMetrics.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay perfiles activos</CardTitle>
            <CardDescription>
              Configura perfiles de redes sociales para ver las métricas aquí.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ve a la sección de "Perfiles" para agregar y configurar tus cuentas de redes sociales.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {profilesMetrics.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Perfiles Activos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {profilesMetrics.reduce((sum, p) => sum + p.currentFollowers, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Seguidores Total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {(profilesMetrics.reduce((sum, p) => sum + p.engagementRate, 0) / profilesMetrics.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Engagement Promedio
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {profilesMetrics.reduce((sum, p) => sum + p.followersChange, 0) >= 0 ? '+' : ''}
                  {profilesMetrics.reduce((sum, p) => sum + p.followersChange, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Crecimiento Semanal
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Individual Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profilesMetrics.map((profile) => (
              <MetricsDashboardCard
                key={profile.profileId}
                profileName={profile.profileName}
                platform={profile.platform}
                currentFollowers={profile.currentFollowers}
                followersChange={profile.followersChange}
                engagementRate={profile.engagementRate}
                engagementChange={profile.engagementChange}
                lastUpdated={profile.lastUpdated}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MetricsDashboard;
