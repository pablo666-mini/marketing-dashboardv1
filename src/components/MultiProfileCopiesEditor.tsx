
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Hash } from 'lucide-react';
import { SocialProfile, PlatformCopy, Platform } from '@/types';

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
  const [hashtagInput, setHashtagInput] = useState<Record<string, string>>({});

  const selectedProfiles = profiles.filter(p => selectedProfileIds.includes(p.id));
  const platformGroups = selectedProfiles.reduce((acc, profile) => {
    if (!acc[profile.platform]) {
      acc[profile.platform] = [];
    }
    acc[profile.platform].push(profile);
    return acc;
  }, {} as Record<Platform, SocialProfile[]>);

  const getCopyForPlatform = (platform: Platform, profileId?: string): PlatformCopy | undefined => {
    return copies.find(copy => 
      copy.platform === platform && 
      (profileId ? copy.profileId === profileId : !copy.profileId)
    );
  };

  const updateCopy = (platform: Platform, content: string, profileId?: string) => {
    const existingCopyIndex = copies.findIndex(copy => 
      copy.platform === platform && 
      (profileId ? copy.profileId === profileId : !copy.profileId)
    );

    const newCopy: PlatformCopy = {
      platform,
      content,
      hashtags: getCopyForPlatform(platform, profileId)?.hashtags || [],
      ...(profileId && { profileId })
    };

    const newCopies = [...copies];
    if (existingCopyIndex >= 0) {
      newCopies[existingCopyIndex] = newCopy;
    } else {
      newCopies.push(newCopy);
    }

    onChange(newCopies);
  };

  const updateHashtags = (platform: Platform, hashtags: string[], profileId?: string) => {
    const existingCopyIndex = copies.findIndex(copy => 
      copy.platform === platform && 
      (profileId ? copy.profileId === profileId : !copy.profileId)
    );

    if (existingCopyIndex >= 0) {
      const newCopies = [...copies];
      newCopies[existingCopyIndex] = {
        ...newCopies[existingCopyIndex],
        hashtags
      };
      onChange(newCopies);
    }
  };

  const addHashtag = (platform: Platform, profileId?: string) => {
    const key = `${platform}-${profileId || 'default'}`;
    const newHashtag = hashtagInput[key]?.trim();
    if (!newHashtag) return;

    const currentCopy = getCopyForPlatform(platform, profileId);
    const currentHashtags = currentCopy?.hashtags || [];
    
    if (!currentHashtags.includes(newHashtag)) {
      updateHashtags(platform, [...currentHashtags, newHashtag], profileId);
    }

    setHashtagInput(prev => ({ ...prev, [key]: '' }));
  };

  const removeHashtag = (platform: Platform, hashtag: string, profileId?: string) => {
    const currentCopy = getCopyForPlatform(platform, profileId);
    const currentHashtags = currentCopy?.hashtags || [];
    updateHashtags(platform, currentHashtags.filter(h => h !== hashtag), profileId);
  };

  const copyContent = (fromPlatform: Platform, toPlatform: Platform, fromProfileId?: string, toProfileId?: string) => {
    const sourceCopy = getCopyForPlatform(fromPlatform, fromProfileId);
    if (sourceCopy) {
      updateCopy(toPlatform, sourceCopy.content, toProfileId);
      updateHashtags(toPlatform, [...sourceCopy.hashtags], toProfileId);
    }
  };

  if (selectedProfileIds.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Selecciona al menos un perfil para crear el contenido
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">Contenido por Plataforma</Label>
        <Badge variant="outline">
          {Object.keys(platformGroups).length} plataforma{Object.keys(platformGroups).length > 1 ? 's' : ''}
        </Badge>
      </div>

      {Object.entries(platformGroups).map(([platform, platformProfiles]) => {
        const platformKey = platform as Platform;
        const hasMultipleProfiles = platformProfiles.length > 1;

        return (
          <Card key={platform}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {platform}
                  <Badge variant="secondary" className="text-xs">
                    {platformProfiles.length} perfil{platformProfiles.length > 1 ? 'es' : ''}
                  </Badge>
                </div>
                {Object.keys(platformGroups).length > 1 && (
                  <div className="flex gap-2">
                    {Object.keys(platformGroups)
                      .filter(p => p !== platform)
                      .map(otherPlatform => (
                        <Button
                          key={otherPlatform}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyContent(otherPlatform as Platform, platformKey)}
                          className="text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar de {otherPlatform}
                        </Button>
                      ))}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasMultipleProfiles ? (
                // Multiple profiles: show content per profile
                platformProfiles.map(profile => {
                  const profileCopy = getCopyForPlatform(platformKey, profile.id);
                  const hashtagKey = `${platform}-${profile.id}`;

                  return (
                    <div key={profile.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">
                          {profile.name} ({profile.handle})
                        </div>
                        {platformProfiles.length > 1 && (
                          <div className="flex gap-1">
                            {platformProfiles
                              .filter(p => p.id !== profile.id)
                              .map(otherProfile => (
                                <Button
                                  key={otherProfile.id}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyContent(platformKey, platformKey, otherProfile.id, profile.id)}
                                  className="text-xs"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  {otherProfile.name}
                                </Button>
                              ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`content-${profile.id}`}>Contenido</Label>
                        <Textarea
                          id={`content-${profile.id}`}
                          placeholder={`Escribe el contenido para ${profile.name}...`}
                          value={profileCopy?.content || ''}
                          onChange={(e) => updateCopy(platformKey, e.target.value, profile.id)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label>Hashtags</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Añadir hashtag (sin #)"
                            value={hashtagInput[hashtagKey] || ''}
                            onChange={(e) => setHashtagInput(prev => ({ 
                              ...prev, 
                              [hashtagKey]: e.target.value 
                            }))}
                            onKeyPress={(e) => e.key === 'Enter' && addHashtag(platformKey, profile.id)}
                          />
                          <Button 
                            type="button" 
                            onClick={() => addHashtag(platformKey, profile.id)}
                            size="sm"
                          >
                            <Hash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {profileCopy?.hashtags?.map((hashtag, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs cursor-pointer"
                              onClick={() => removeHashtag(platformKey, hashtag, profile.id)}
                            >
                              #{hashtag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Single profile: show platform-level content
                (() => {
                  const platformCopy = getCopyForPlatform(platformKey);
                  const hashtagKey = `${platform}-default`;

                  return (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`content-${platform}`}>Contenido</Label>
                        <Textarea
                          id={`content-${platform}`}
                          placeholder={`Escribe el contenido para ${platform}...`}
                          value={platformCopy?.content || ''}
                          onChange={(e) => updateCopy(platformKey, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label>Hashtags</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Añadir hashtag (sin #)"
                            value={hashtagInput[hashtagKey] || ''}
                            onChange={(e) => setHashtagInput(prev => ({ 
                              ...prev, 
                              [hashtagKey]: e.target.value 
                            }))}
                            onKeyPress={(e) => e.key === 'Enter' && addHashtag(platformKey)}
                          />
                          <Button 
                            type="button" 
                            onClick={() => addHashtag(platformKey)}
                            size="sm"
                          >
                            <Hash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {platformCopy?.hashtags?.map((hashtag, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs cursor-pointer"
                              onClick={() => removeHashtag(platformKey, hashtag)}
                            >
                              #{hashtag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
