
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { CalendarFilters as CalendarFiltersType, SocialProfile } from '@/types';

interface CalendarFiltersProps {
  filters: CalendarFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<CalendarFiltersType>>;
  activeProfiles: SocialProfile[] | undefined;
}

export const CalendarFilters = ({ filters, setFilters, activeProfiles }: CalendarFiltersProps) => {
  const clearFilters = () => {
    setFilters({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Perfil</label>
          <Select 
            value={filters.profileId || 'all'} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, profileId: value === 'all' ? undefined : value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los perfiles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los perfiles</SelectItem>
              {activeProfiles?.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name} ({profile.platform})
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
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Draft">Borrador</SelectItem>
              <SelectItem value="Pending">Pendiente</SelectItem>
              <SelectItem value="Approved">Aprobada</SelectItem>
              <SelectItem value="Published">Publicada</SelectItem>
              <SelectItem value="Canceled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Tipo</label>
          <Select 
            value={filters.contentType || 'all'} 
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              contentType: value === 'all' ? undefined : value as any
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Post">Post</SelectItem>
              <SelectItem value="Reel">Reel</SelectItem>
              <SelectItem value="Story">Story</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={clearFilters} className="w-full">
          Limpiar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};
