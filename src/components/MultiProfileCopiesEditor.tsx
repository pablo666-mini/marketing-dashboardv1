
import { useState, useEffect } from 'react';
import { SocialProfile, Platform, PlatformCopy } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Users } from 'lucide-react';

interface ProfileCopyContent {
  content: string;
  hashtags: string[];
}

type CopiesMap = {
  [profileId: string]: ProfileCopyContent;
};

interface MultiProfileCopiesEditorProps {
  selectedProfileIds: string[];
  profiles: SocialProfile[];
  copies: PlatformCopy[];
  onChange: (copies: PlatformCopy[]) => void;
}

export const MultiProfileCopiesEditor = ({ 
  selectedProfileIds, 
  profiles,
  copies, 
  onChange 
}: MultiProfileCopiesEditorProps) => {
  const [copiesMap, setCopiesMap] = useState<CopiesMap>({});

  // Get selected profiles with their details
  const selectedProfiles = profiles.filter(profile => 
    selectedProfileIds.includes(profile.id)
  );

  // Group selected profiles by platform
  const profilesByPlatform = selectedProfiles.reduce((acc, profile) => {
    if (!acc[profile.platform]) {
      acc[profile.platform] = [];
    }
    acc[profile.platform].push(profile);
    return acc;
  }, {} as { [platform: string]: SocialProfile[] });

  // Initialize copies map from props
  useEffect(() => {
    const newCopiesMap: CopiesMap = {};
    copies.forEach(copy => {
      if (copy.profileId) {
        newCopiesMap[copy.profileId] = {
          content: copy.content,
          hashtags: copy.hashtags
        };
      } else {
        // Handle platform-level copies by assigning to all profiles of that platform
        const platformProfiles = selectedProfiles.filter(p => p.platform === copy.platform);
        platformProfiles.forEach(profile => {
          if (!newCopiesMap[profile.id]) {
            newCopiesMap[profile.id] = {
              content: copy.content,
              hashtags: copy.hashtags
            };
          }
        });
      }
    });
    setCopiesMap(newCopiesMap);
  }, [copies, selectedProfiles]);

  // Sync copies map with selected profiles
  useEffect(() => {
    const newCopiesMap = { ...copiesMap };
    
    // Add new profiles with empty content
    selectedProfileIds.forEach(profileId => {
      if (!newCopiesMap[profileId]) {
        newCopiesMap[profileId] = { content: '', hashtags: [] };
      }
    });

    // Remove unselected profiles
    Object.keys(newCopiesMap).forEach(profileId => {
      if (!selectedProfileIds.includes(profileId)) {
        delete newCopiesMap[profileId];
      }
    });

    setCopiesMap(newCopiesMap);
  }, [selectedProfileIds]);

  // Convert copies map to array and notify parent
  useEffect(() => {
    const copiesArray: PlatformCopy[] = Object.entries(copiesMap).map(([profileId, data]) => {
      const profile = profiles.find(p => p.id === profileId);
      return {
        platform: profile?.platform as Platform,
        content: data?.content || '',
        hashtags: data?.hashtags || [],
        profileId: profileId
      };
    });
    onChange(copiesArray);
  }, [copiesMap, onChange, profiles]);

  const updateCopy = (profileId: string, field: 'content' | 'hashtags', value: string | string[]) => {
    setCopiesMap(prev => ({
      ...prev,
      [profileId]: {
        ...prev[profileId],
        [field]: value
      }
    }));
  };

  const copyToAllPlatform = (platform: Platform, sourceProfileId: string) => {
    const sourceData = copiesMap[sourceProfileId];
    if (!sourceData) return;

    const platformProfiles = profilesByPlatform[platform] || [];
    const newCopiesMap = { ...copiesMap };

    platformProfiles.forEach(profile => {
      if (profile.id !== sourceProfileId) {
        newCopiesMap[profile.id] = {
          content: sourceData.content,
          hashtags: [...sourceData.hashtags]
        };
      }
    });

    setCopiesMap(newCopiesMap);
  };

  if (selectedProfileIds.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Selecciona al menos un perfil para crear contenido</p>
      </div>
    );
  }

  if (selectedProfileIds.length === 1) {
    const profile = selectedProfiles[0];
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contenido para {profile.name} ({profile.platform})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`copy-${profile.id}`}>Texto de la publicación</Label>
            <Textarea
              id={`copy-${profile.id}`}
              rows={4}
              value={copiesMap[profile.id]?.content || ''}
              onChange={e => updateCopy(profile.id, 'content', e.target.value)}
              placeholder="Escribe el contenido de la publicación..."
            />
          </div>
          <div>
            <Label htmlFor={`hashtags-${profile.id}`}>Hashtags (separados por comas)</Label>
            <Input
              id={`hashtags-${profile.id}`}
              value={copiesMap[profile.id]?.hashtags.join(', ') || ''}
              onChange={e => updateCopy(profile.id, 'hashtags', e.target.value.split(',').map(h => h.trim()).filter(Boolean))}
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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Contenido Multi-Perfil
          <Badge variant="outline">
            {selectedProfileIds.length} perfiles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(profilesByPlatform)[0]} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(profilesByPlatform).length}, 1fr)` }}>
            {Object.keys(profilesByPlatform).map(platform => {
              const platformProfiles = profilesByPlatform[platform];
              return (
                <TabsTrigger key={platform} value={platform} className="text-sm">
                  {platform}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {platformProfiles.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {Object.entries(profilesByPlatform).map(([platform, platformProfiles]) => (
            <TabsContent key={platform} value={platform} className="space-y-6">
              {platformProfiles.map((profile, index) => (
                <div key={profile.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{profile.platform}</Badge>
                      <span className="font-medium">{profile.name}</span>
                      <span className="text-sm text-muted-foreground">@{profile.handle}</span>
                    </div>
                    {index === 0 && platformProfiles.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllPlatform(platform as Platform, profile.id)}
                        className="h-7 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar a todos
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor={`copy-${profile.id}`}>Texto de la publicación</Label>
                    <Textarea
                      id={`copy-${profile.id}`}
                      rows={4}
                      value={copiesMap[profile.id]?.content || ''}
                      onChange={e => updateCopy(profile.id, 'content', e.target.value)}
                      placeholder={`Escribe el contenido para ${profile.name}...`}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`hashtags-${profile.id}`}>Hashtags (separados por comas)</Label>
                    <Input
                      id={`hashtags-${profile.id}`}
                      value={copiesMap[profile.id]?.hashtags.join(', ') || ''}
                      onChange={e => updateCopy(profile.id, 'hashtags', e.target.value.split(',').map(h => h.trim()).filter(Boolean))}
                      placeholder="#hashtag1, #hashtag2"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
