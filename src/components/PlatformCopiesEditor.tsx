
import { useState, useEffect } from 'react';
import { Platform, PlatformCopy } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlatformCopyContent {
  content: string;
  hashtags: string[];
}

type CopiesMap = {
  [K in Platform]?: PlatformCopyContent;
};

interface PlatformCopiesEditorProps {
  selectedPlatforms: Platform[];
  copies: PlatformCopy[];
  onChange: (copies: PlatformCopy[]) => void;
}

export const PlatformCopiesEditor = ({ 
  selectedPlatforms, 
  copies, 
  onChange 
}: PlatformCopiesEditorProps) => {
  const [copiesMap, setCopiesMap] = useState<CopiesMap>({});

  // Initialize copies map from props
  useEffect(() => {
    const newCopiesMap: CopiesMap = {};
    copies.forEach(copy => {
      newCopiesMap[copy.platform] = {
        content: copy.content,
        hashtags: copy.hashtags
      };
    });
    setCopiesMap(newCopiesMap);
  }, [copies]);

  // Sync copies map with selected platforms
  useEffect(() => {
    const newCopiesMap = { ...copiesMap };
    
    // Add new platforms with empty content
    selectedPlatforms.forEach(platform => {
      if (!newCopiesMap[platform]) {
        newCopiesMap[platform] = { content: '', hashtags: [] };
      }
    });

    // Remove unselected platforms
    Object.keys(newCopiesMap).forEach(key => {
      const platform = key as Platform;
      if (!selectedPlatforms.includes(platform)) {
        delete newCopiesMap[platform];
      }
    });

    setCopiesMap(newCopiesMap);
  }, [selectedPlatforms]);

  // Convert copies map to array and notify parent
  useEffect(() => {
    const copiesArray: PlatformCopy[] = Object.entries(copiesMap).map(([platform, data]) => ({
      platform: platform as Platform,
      content: data?.content || '',
      hashtags: data?.hashtags || []
    }));
    onChange(copiesArray);
  }, [copiesMap, onChange]);

  const updateCopy = (platform: Platform, field: 'content' | 'hashtags', value: string | string[]) => {
    setCopiesMap(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  if (selectedPlatforms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selecciona al menos una plataforma para crear contenido
      </div>
    );
  }

  if (selectedPlatforms.length === 1) {
    const platform = selectedPlatforms[0];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contenido para {platform}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`copy-${platform}`}>Texto de la publicación</Label>
            <Textarea
              id={`copy-${platform}`}
              rows={4}
              value={copiesMap[platform]?.content || ''}
              onChange={e => updateCopy(platform, 'content', e.target.value)}
              placeholder="Escribe el contenido de la publicación..."
            />
          </div>
          <div>
            <Label htmlFor={`hashtags-${platform}`}>Hashtags (separados por comas)</Label>
            <Input
              id={`hashtags-${platform}`}
              value={copiesMap[platform]?.hashtags.join(', ') || ''}
              onChange={e => updateCopy(platform, 'hashtags', e.target.value.split(',').map(h => h.trim()).filter(Boolean))}
              placeholder="#hashtag1, #hashtag2"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenido por Plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-auto" style={{ gridTemplateColumns: `repeat(${selectedPlatforms.length}, 1fr)` }}>
            {selectedPlatforms.map(platform => (
              <TabsTrigger key={platform} value={platform} className="text-sm">
                {platform}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedPlatforms.map(platform => (
            <TabsContent key={platform} value={platform} className="space-y-4">
              <div>
                <Label htmlFor={`copy-${platform}`}>Texto de la publicación</Label>
                <Textarea
                  id={`copy-${platform}`}
                  rows={4}
                  value={copiesMap[platform]?.content || ''}
                  onChange={e => updateCopy(platform, 'content', e.target.value)}
                  placeholder={`Escribe el contenido para ${platform}...`}
                />
              </div>
              <div>
                <Label htmlFor={`hashtags-${platform}`}>Hashtags (separados por comas)</Label>
                <Input
                  id={`hashtags-${platform}`}
                  value={copiesMap[platform]?.hashtags.join(', ') || ''}
                  onChange={e => updateCopy(platform, 'hashtags', e.target.value.split(',').map(h => h.trim()).filter(Boolean))}
                  placeholder="#hashtag1, #hashtag2"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
