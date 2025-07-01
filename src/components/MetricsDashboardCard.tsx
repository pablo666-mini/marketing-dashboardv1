
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Heart } from 'lucide-react';
import type { Platform } from '@/types';

interface MetricsDashboardCardProps {
  profileName: string;
  platform: Platform;
  currentFollowers: number;
  followersChange: number;
  engagementRate: number;
  engagementChange: number;
  lastUpdated: string | null;
}

export const MetricsDashboardCard = ({
  profileName,
  platform,
  currentFollowers,
  followersChange,
  engagementRate,
  engagementChange,
  lastUpdated
}: MetricsDashboardCardProps) => {
  const platformColors = {
    Instagram: '#E4405F',
    TikTok: '#000000',
    LinkedIn: '#0077B5',
    X: '#1DA1F2',
    Pinterest: '#BD081C',
    YouTube: '#FF0000',
    Other: '#6B7280'
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatNumber(change)}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{profileName}</CardTitle>
          <Badge 
            variant="outline" 
            style={{ 
              borderColor: platformColors[platform],
              color: platformColors[platform]
            }}
          >
            {platform}
          </Badge>
        </div>
        {lastUpdated && (
          <CardDescription>
            Actualizado: {new Date(lastUpdated).toLocaleString('es-ES')}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Followers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Seguidores</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatNumber(currentFollowers)}</div>
            <div className={`text-xs flex items-center gap-1 ${
              followersChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {followersChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {formatChange(followersChange)}
            </div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-medium">Engagement</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">{engagementRate.toFixed(1)}%</div>
            <div className={`text-xs flex items-center gap-1 ${
              engagementChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {engagementChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {engagementChange >= 0 ? '+' : ''}{engagementChange.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
