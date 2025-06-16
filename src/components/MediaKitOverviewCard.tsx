
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderOpen, Settings, Megaphone, Image, Video, FileText } from 'lucide-react';
import type { MediaKitResource } from '@/hooks/useMediaKitResources';

interface MediaKitOverviewCardProps {
  mediaResources: MediaKitResource[] | undefined;
}

export const MediaKitOverviewCard = ({ mediaResources }: MediaKitOverviewCardProps) => {
  const activeMediaResources = mediaResources?.filter(r => r.active) || [];

  const getMediaIcon = (category: string) => {
    switch (category) {
      case 'press_convocation':
      case 'press_note':
        return <Megaphone className="h-4 w-4" />;
      case 'banners':
      case 'photos':
        return <Image className="h-4 w-4" />;
      case 'videos':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'press_convocation': return 'Convocatorias de Prensa';
      case 'press_note': return 'Notas de Prensa';
      case 'banners': return 'Banners';
      case 'photos': return 'Fotografías';
      case 'videos': return 'Videos';
      default: return category;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Kit de Medios ({activeMediaResources.length})
            </CardTitle>
            <CardDescription>
              Recursos disponibles para campañas
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="#media-kit">
              <Settings className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeMediaResources.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {activeMediaResources.slice(0, 6).map((resource) => (
              <div key={resource.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-primary/10 rounded">
                    {getMediaIcon(resource.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs truncate">{resource.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {getCategoryName(resource.category)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {activeMediaResources.length > 6 && (
              <div className="col-span-2 text-center">
                <Badge variant="secondary">+{activeMediaResources.length - 6} más</Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay recursos activos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
