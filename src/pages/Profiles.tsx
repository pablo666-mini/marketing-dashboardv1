
// Social Profiles management page
import { useProfiles, useUpdateProfile } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Platform } from '@/types';

const Profiles = () => {
  const { data: profiles, isLoading } = useProfiles();
  const updateProfile = useUpdateProfile();

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
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    // Using simple text icons for platforms
    switch (platform) {
      case 'Instagram': return 'IG';
      case 'TikTok': return 'TT';
      case 'LinkedIn': return 'LI';
      case 'X': return 'X';
      case 'Pinterest': return 'PT';
      case 'YouTube': return 'YT';
      default: return '??';
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Perfiles Sociales</h1>
        <p className="text-muted-foreground">
          Gestiona las cuentas de redes sociales activas para campañas
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Perfiles</CardTitle>
          <CardDescription>
            Estado actual de las cuentas de redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles?.map((profile) => (
          <Card key={profile.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getPlatformColor(profile.platform)} flex items-center justify-center text-white font-bold text-sm`}>
                    {getPlatformIcon(profile.platform)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.handle}</p>
                  </div>
                </div>
                <Switch
                  checked={profile.active}
                  onCheckedChange={(checked) => handleToggleProfile(profile.id, checked)}
                  disabled={updateProfile.isPending}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={profile.active ? "default" : "secondary"}
                  className={profile.active ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {profile.active ? 'Activo' : 'Inactivo'}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {profile.platform}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  <p>Actualizado: {new Date(profile.updated_at).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Profiles Info */}
      {activeCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perfiles Activos para Publicaciones</CardTitle>
            <CardDescription>
              Estos perfiles estarán disponibles al crear nuevas publicaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profiles?.filter(p => p.active).map((profile) => (
                <div key={profile.id} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                  <div className={`w-6 h-6 rounded ${getPlatformColor(profile.platform)} flex items-center justify-center text-white font-bold text-xs`}>
                    {getPlatformIcon(profile.platform)}
                  </div>
                  <span className="text-sm font-medium">{profile.name}</span>
                  <span className="text-xs text-muted-foreground">{profile.handle}</span>
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
