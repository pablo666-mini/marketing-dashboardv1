
// Social Profiles management page
import { useSocialProfiles, useUpdateSocialProfile } from '@/hooks/useSocialProfiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Platform, SocialProfile, PREDEFINED_PLATFORMS } from '@/types';
import { Instagram, Linkedin, Youtube, ExternalLink, Users, TrendingUp, Heart, BarChart3 } from 'lucide-react';
import { CreateProfileDialog } from '@/components/CreateProfileDialog';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Profiles = () => {
  const { data: profiles, isLoading } = useSocialProfiles();
  const updateProfile = useUpdateSocialProfile();

  const handleToggleProfile = async (id: string, active: boolean) => {
    console.log(`Toggling profile ${id} to ${active ? 'active' : 'inactive'}`);
    updateProfile.mutate({ id, updates: { active } });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'TikTok': return 'bg-black';
      case 'LinkedIn': return 'bg-blue-600';
      case 'X': return 'bg-black';
      case 'Pinterest': return 'bg-red-600';
      case 'YouTube': return 'bg-red-500';
      default: return 'bg-gray-500'; // Para plataformas personalizadas
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="h-4 w-4" />;
      case 'TikTok': return <span className="text-xs font-bold">TT</span>;
      case 'LinkedIn': return <Linkedin className="h-4 w-4" />;
      case 'X': return <span className="text-xs font-bold">X</span>;
      case 'Pinterest': return <span className="text-xs font-bold">PT</span>;
      case 'YouTube': return <Youtube className="h-4 w-4" />;
      default: 
        // Para plataformas personalizadas, usar las primeras 2 letras
        const initials = platform.slice(0, 2).toUpperCase();
        return <span className="text-xs font-bold">{initials}</span>;
    }
  };

  const formatNumber = (num: number | null) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const activeCount = profiles?.filter(p => p.active).length || 0;
  const totalCount = profiles?.length || 0;
  const totalFollowers = profiles?.reduce((sum, p) => sum + (p.followers_count || 0), 0) || 0;

  // Group profiles by platform for better organization
  const profilesByPlatform = profiles?.reduce((acc, profile) => {
    if (!acc[profile.platform]) {
      acc[profile.platform] = [];
    }
    acc[profile.platform].push(profile);
    return acc;
  }, {} as Record<string, SocialProfile[]>) || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Perfiles Sociales</h1>
          <p className="text-muted-foreground">
            Gestiona las cuentas oficiales de Miniland en redes sociales
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/metricas">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard Métricas
            </Link>
          </Button>
          <CreateProfileDialog />
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Perfiles Oficiales</CardTitle>
          <CardDescription>
            Estado actual de las cuentas oficiales de Miniland en redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{totalCount - activeCount}</div>
              <div className="text-sm text-muted-foreground">Inactivos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(profilesByPlatform).length}</div>
              <div className="text-sm text-muted-foreground">Plataformas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(totalFollowers)}</div>
              <div className="text-sm text-muted-foreground">Seguidores Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profiles by Platform */}
      {Object.entries(profilesByPlatform).map(([platform, platformProfiles]) => {
        const typedPlatformProfiles = platformProfiles as SocialProfile[];
        const platformFollowers = typedPlatformProfiles.reduce((sum, p) => sum + (p.followers_count || 0), 0);
        
        return (
          <Card key={platform}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${getPlatformColor(platform)} flex items-center justify-center text-white`}>
                  {getPlatformIcon(platform)}
                </div>
                {platform}
                <Badge variant="outline" className="ml-auto">
                  {typedPlatformProfiles.filter(p => p.active).length} de {typedPlatformProfiles.length} activos
                </Badge>
                {platformFollowers > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {formatNumber(platformFollowers)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {typedPlatformProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{profile.name}</h4>
                            {profile.url && (
                              <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                                <a href={profile.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{profile.handle}</p>
                          {profile.description && (
                            <p className="text-xs text-muted-foreground mt-1">{profile.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={profile.active ? "default" : "secondary"}
                            className={profile.active ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {profile.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {!profile.active && (
                            <span className="text-xs text-orange-600">
                              {profile.handle.includes('international') || profile.handle.includes('aus') ? 
                                'En desuso' : 'Requiere reactivación'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 text-sm">
                        {profile.followers_count && profile.followers_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{formatNumber(profile.followers_count)}</span>
                          </div>
                        )}
                        {profile.growth_rate && profile.growth_rate !== 0 && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span className={profile.growth_rate > 0 ? 'text-green-600' : 'text-red-600'}>
                              {profile.growth_rate > 0 ? '+' : ''}{profile.growth_rate}%
                            </span>
                          </div>
                        )}
                        {profile.engagement_rate && profile.engagement_rate > 0 && (
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{profile.engagement_rate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/perfiles/${profile.id}`}>
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Métricas
                        </Link>
                      </Button>
                      <EditProfileDialog profile={profile} />
                      <Switch
                        checked={profile.active}
                        onCheckedChange={(checked) => handleToggleProfile(profile.id, checked)}
                        disabled={updateProfile.isPending}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Active Profiles Summary for Content Creation */}
      {activeCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perfiles Activos para Publicaciones</CardTitle>
            <CardDescription>
              Estos perfiles están disponibles para la creación de contenido y campañas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {profiles?.filter(p => p.active).map((profile) => (
                <div key={profile.id} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-lg">
                  <div className={`w-8 h-8 rounded ${getPlatformColor(profile.platform)} flex items-center justify-center text-white`}>
                    {getPlatformIcon(profile.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{profile.name}</div>
                    <div className="text-xs text-muted-foreground truncate">@{profile.handle}</div>
                    {profile.followers_count && profile.followers_count > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(profile.followers_count)} seguidores
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profiles;
