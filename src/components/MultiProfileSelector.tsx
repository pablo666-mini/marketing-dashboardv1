
import { useState, useEffect } from 'react';
import { SocialProfile, Platform, MultiProfileSelection, ProfilesByPlatform } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Users } from 'lucide-react';

interface MultiProfileSelectorProps {
  profiles: SocialProfile[];
  selectedProfileIds: string[];
  onChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export const MultiProfileSelector = ({ 
  profiles, 
  selectedProfileIds, 
  onChange, 
  disabled 
}: MultiProfileSelectorProps) => {
  const [profileSelection, setProfileSelection] = useState<MultiProfileSelection>({});

  // Group profiles by platform
  const profilesByPlatform: ProfilesByPlatform = profiles.reduce((acc, profile) => {
    if (!acc[profile.platform]) {
      acc[profile.platform] = [];
    }
    acc[profile.platform].push(profile);
    return acc;
  }, {} as ProfilesByPlatform);

  // Initialize selection state from props
  useEffect(() => {
    const newSelection: MultiProfileSelection = {};
    Object.keys(profilesByPlatform).forEach(platform => {
      const platformProfiles = profilesByPlatform[platform];
      newSelection[platform] = platformProfiles
        .filter(profile => selectedProfileIds.includes(profile.id))
        .map(profile => profile.id);
    });
    setProfileSelection(newSelection);
  }, [selectedProfileIds, profiles]);

  const toggleProfile = (profileId: string, platform: Platform) => {
    const currentPlatformSelection = profileSelection[platform] || [];
    const newPlatformSelection = currentPlatformSelection.includes(profileId)
      ? currentPlatformSelection.filter(id => id !== profileId)
      : [...currentPlatformSelection, profileId];

    const newSelection = {
      ...profileSelection,
      [platform]: newPlatformSelection
    };

    setProfileSelection(newSelection);

    // Flatten selection to array of profile IDs
    const allSelectedIds = Object.values(newSelection).flat();
    onChange(allSelectedIds);
  };

  const toggleAllPlatform = (platform: Platform) => {
    const platformProfiles = profilesByPlatform[platform] || [];
    const currentPlatformSelection = profileSelection[platform] || [];
    const allSelected = platformProfiles.length === currentPlatformSelection.length;

    const newPlatformSelection = allSelected ? [] : platformProfiles.map(p => p.id);
    const newSelection = {
      ...profileSelection,
      [platform]: newPlatformSelection
    };

    setProfileSelection(newSelection);

    const allSelectedIds = Object.values(newSelection).flat();
    onChange(allSelectedIds);
  };

  const getSelectedProfilesCount = () => selectedProfileIds.length;
  const getPlatformsWithSelection = () => {
    return Object.keys(profileSelection).filter(platform => 
      (profileSelection[platform] || []).length > 0
    ).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Perfiles Sociales</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{getSelectedProfilesCount()} perfiles en {getPlatformsWithSelection()} plataformas</span>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.entries(profilesByPlatform).map(([platform, platformProfiles]) => {
          const platformSelection = profileSelection[platform] || [];
          const allSelected = platformProfiles.length === platformSelection.length;
          const someSelected = platformSelection.length > 0;

          return (
            <Card key={platform}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {platform}
                    <Badge variant="outline" className="text-xs">
                      {platformSelection.length}/{platformProfiles.length}
                    </Badge>
                  </CardTitle>
                  <Button
                    type="button"
                    variant={allSelected ? "default" : "outline"}
                    size="sm"
                    disabled={disabled}
                    onClick={() => toggleAllPlatform(platform as Platform)}
                    className="h-7 text-xs"
                  >
                    {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-2">
                  {platformProfiles.map(profile => {
                    const isSelected = platformSelection.includes(profile.id);
                    return (
                      <div
                        key={profile.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isSelected 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled}
                          onCheckedChange={() => toggleProfile(profile.id, platform as Platform)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{profile.name}</div>
                            <div className="text-xs text-muted-foreground">@{profile.handle}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Seleccionado
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedProfileIds.length > 0 && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Resumen de selección:</div>
          <div className="flex flex-wrap gap-1">
            {selectedProfileIds.map(profileId => {
              const profile = profiles.find(p => p.id === profileId);
              return profile ? (
                <Badge key={profile.id} variant="secondary" className="text-xs">
                  {profile.platform}: {profile.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
