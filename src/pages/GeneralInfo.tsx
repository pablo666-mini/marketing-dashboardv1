
// General Information page - displays products, protocols, and media kit
import { useGeneralInfo, useProducts } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, Image, Video, Megaphone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const GeneralInfo = () => {
  const { data: generalInfo, isLoading: generalLoading } = useGeneralInfo();
  const { data: products, isLoading: productsLoading } = useProducts();

  if (generalLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const getMediaIcon = (category: string) => {
    switch (category) {
      case 'press_convocation':
      case 'press_note':
        return <Megaphone className="h-4 w-4" />;
      case 'banners':
        return <Image className="h-4 w-4" />;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Información General</h1>
        <p className="text-muted-foreground">
          Gestiona productos, protocolos y recursos para campañas de redes sociales
        </p>
      </div>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Productos Activos
          </CardTitle>
          <CardDescription>
            Información de productos para campañas de lanzamiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {products?.map((product) => (
            <div key={product.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={product.landingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Producto
                  </a>
                </Button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium">Concepto Creativo:</h4>
                  <p className="text-sm text-muted-foreground">{product.creativeConcept}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Países:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.countries.map((country) => (
                      <Badge key={country} variant="secondary">{country}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Hashtags:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="outline">{hashtag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <a href={product.communicationKitUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Kit de Comunicación
                </a>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocols Section */}
        <Card>
          <CardHeader>
            <CardTitle>Protocolos de Comunicación</CardTitle>
            <CardDescription>
              Guías y estándares para la creación de contenido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generalInfo?.protocols.map((protocol) => (
              <div key={protocol.id} className="space-y-2">
                <h4 className="font-medium">{protocol.title}</h4>
                <p className="text-sm text-muted-foreground">{protocol.description}</p>
                <div className="bg-muted p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap font-mono">{protocol.content}</pre>
                </div>
                {protocol !== generalInfo.protocols[generalInfo.protocols.length - 1] && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Media Kit Section */}
        <Card>
          <CardHeader>
            <CardTitle>Kit de Medios</CardTitle>
            <CardDescription>
              Recursos multimedia y documentos corporativos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {generalInfo?.mediaKit.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  {getMediaIcon(resource.category)}
                  <div>
                    <h4 className="font-medium">{resource.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryName(resource.category)}
                    </p>
                    {resource.description && (
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralInfo;
