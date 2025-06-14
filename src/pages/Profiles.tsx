// Social Profiles management page
import { useSocialProfiles, useUpdateSocialProfile } from '@/hooks/useSocialProfiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Platform, SocialProfile, PREDEFINED_PLATFORMS } from '@/types';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { CreateProfileDialog } from '@/components/CreateProfileDialog';

const Profiles = () => {
  const { data: profiles, isLoading } = useSocialProfiles();
  const updateProfile = useUpdateSocialProfile();

  const handleToggleProfile = async (id: string, active: boolean) => {
    console.log(`Toggling profile ${id} to ${active ? 'active' : 'inactive'}`);
    updateProfile.mutate({ id, updates: { active } });
  };

  const getPlatformColor = (platform: Platform) => {
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

  const getPlatformIcon = (platform: Platform) => {
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

  // Group profiles by platform for better organization
  const profilesByPlatform = profiles?.reduce((acc, profile) => {
    if (!acc[profile.platform]) {
      acc[profile.platform] = [];
    }
    acc[profile.platform].push(profile);
    return acc;
  }, {} as Record<Platform, SocialProfile[]>) || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Perfiles Sociales</h1>
          <p className="text-muted-foreground">
            Gestiona las cuentas oficiales de Miniland en redes sociales
          </p>
        </div>
        <CreateProfileDialog />
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
          </div>
        </CardContent>
      </Card>

      {/* Profiles by Platform */}
      {Object.entries(profilesByPlatform).map(([platform, platformProfiles]) => {
        const typedPlatformProfiles = platformProfiles as SocialProfile[];
        return (
          <Card key={platform}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${getPlatformColor(platform as Platform)} flex items-center justify-center text-white`}>
                  {getPlatformIcon(platform as Platform)}
                </div>
                {platform}
                <Badge variant="outline" className="ml-auto">
                  {typedPlatformProfiles.filter(p => p.active).length} de {typedPlatformProfiles.length} activos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typedPlatformProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <h4 className="font-medium">{profile.name}</h4>
                          <p className="text-sm text-muted-foreground">@{profile.handle}</p>
                        </div>
                      </div>
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
                    <Switch
                      checked={profile.active}
                      onCheckedChange={(checked) => handleToggleProfile(profile.id, checked)}
                      disabled={updateProfile.isPending}
                    />
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
