
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileMetrics } from '@/hooks/useProfileMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProfileMetricsChartProps {
  profileId: string;
  profileName: string;
  days?: number;
}

export const ProfileMetricsChart = ({ profileId, profileName, days = 30 }: ProfileMetricsChartProps) => {
  const { data: metrics, isLoading, error } = useProfileMetrics(profileId, days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas de {profileName}</CardTitle>
          <CardDescription>Error al cargar las métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No se pudieron cargar las métricas. Por favor, intenta de nuevo.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas de {profileName}</CardTitle>
          <CardDescription>Últimos {days} días</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay datos de métricas disponibles para este perfil.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = metrics.map(metric => ({
    date: format(new Date(metric.timestamp), 'dd/MM', { locale: es }),
    followers: metric.followers_count || 0,
    engagement: metric.engagement_rate || 0,
    impressions: metric.impressions || 0,
    reach: metric.reach || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de {profileName}</CardTitle>
        <CardDescription>Últimos {days} días - {metrics.length} puntos de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
              <Tooltip 
                labelFormatter={(label) => `Fecha: ${label}`}
                formatter={(value: number, name: string) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name === 'followers' ? 'Seguidores' :
                  name === 'engagement' ? 'Engagement (%)' :
                  name === 'impressions' ? 'Impresiones' :
                  name === 'reach' ? 'Alcance' : name
                ]}
              />
              <Legend 
                formatter={(value) => 
                  value === 'followers' ? 'Seguidores' :
                  value === 'engagement' ? 'Engagement (%)' :
                  value === 'impressions' ? 'Impresiones' :
                  value === 'reach' ? 'Alcance' : value
                }
              />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="reach" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
