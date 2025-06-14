
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Filter, X, Info } from 'lucide-react';
import { CalendarFilters as CalendarFiltersType, SocialProfile } from '@/types';
import { useMemo } from 'react';

interface CalendarFiltersProps {
  filters: CalendarFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<CalendarFiltersType>>;
  activeProfiles: SocialProfile[] | undefined;
}

export const CalendarFilters = ({ filters, setFilters, activeProfiles }: CalendarFiltersProps) => {
  const hasActiveFilters = useMemo(() => {
    return !!(filters.profileId || filters.status || filters.contentType);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.profileId) count++;
    if (filters.status) count++;
    if (filters.contentType) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
  };

  const removeFilter = (filterKey: keyof CalendarFiltersType) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const statusLabels = {
    'Draft': 'Borrador',
    'Pending': 'Pendiente',
    'Approved': 'Aprobada',
    'Published': 'Publicada',
    'Canceled': 'Cancelada'
  };

  const contentTypeLabels = {
    'Post': 'Post',
    'Reel': 'Reel', 
    'Story': 'Story',
    'Video': 'Video'
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Filtra las publicaciones del calendario por perfil, estado o tipo de contenido</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Filtros activos:</label>
            <div className="flex flex-wrap gap-1">
              {filters.profileId && (
                <Badge variant="outline" className="text-xs gap-1">
                  {activeProfiles?.find(p => p.id === filters.profileId)?.name || 'Perfil'}
                  <button
                    onClick={() => removeFilter('profileId')}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="outline" className="text-xs gap-1">
                  {statusLabels[filters.status]}
                  <button
                    onClick={() => removeFilter('status')}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.contentType && (
                <Badge variant="outline" className="text-xs gap-1">
                  {contentTypeLabels[filters.contentType]}
                  <button
                    onClick={() => removeFilter('contentType')}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Perfil</label>
            <Select 
              value={filters.profileId || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                profileId: value === 'all' ? undefined : value 
              }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los perfiles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los perfiles</SelectItem>
                {activeProfiles?.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center gap-2">
                      <span>{profile.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {profile.platform}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Estado</label>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                status: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Draft">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    Borrador
                  </div>
                </SelectItem>
                <SelectItem value="Pending">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Pendiente
                  </div>
                </SelectItem>
                <SelectItem value="Approved">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Aprobada
                  </div>
                </SelectItem>
                <SelectItem value="Published">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Publicada
                  </div>
                </SelectItem>
                <SelectItem value="Canceled">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Cancelada
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo de Contenido</label>
            <Select 
              value={filters.contentType || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                contentType: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Post">📷 Post</SelectItem>
                <SelectItem value="Reel">🎬 Reel</SelectItem>
                <SelectItem value="Story">📱 Story</SelectItem>
                <SelectItem value="Video">🎥 Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            className="w-full flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
          >
            <X className="h-4 w-4" />
            Limpiar Todos los Filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
