
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Settings } from 'lucide-react';
import type { Protocol } from '@/hooks/useProtocols';

interface ProtocolsOverviewCardProps {
  protocols: Protocol[] | undefined;
}

export const ProtocolsOverviewCard = ({ protocols }: ProtocolsOverviewCardProps) => {
  const activeProtocols = protocols?.filter(p => p.active) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Protocolos ({activeProtocols.length})
            </CardTitle>
            <CardDescription>
              Guías y estándares para la gestión de contenido
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="#protocols">
              <Settings className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeProtocols.length > 0 ? (
          <div className="space-y-3">
            {activeProtocols.slice(0, 4).map((protocol) => (
              <div key={protocol.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{protocol.title}</h3>
                  <Badge variant="outline" className="text-xs">{protocol.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {protocol.description}
                </p>
              </div>
            ))}
            {activeProtocols.length > 4 && (
              <div className="text-center">
                <Badge variant="secondary">+{activeProtocols.length - 4} más</Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay protocolos activos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
