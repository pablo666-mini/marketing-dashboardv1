
import { Platform } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const platforms: Platform[] = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'Pinterest', 'YouTube'];

interface MultiPlatformSelectorProps {
  selectedPlatforms: Platform[];
  onChange: (selected: Platform[]) => void;
  disabled?: boolean;
}

export const MultiPlatformSelector = ({ 
  selectedPlatforms, 
  onChange, 
  disabled 
}: MultiPlatformSelectorProps) => {
  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Plataformas</Label>
      <div className="flex flex-wrap gap-2">
        {platforms.map(platform => (
          <Button
            key={platform}
            type="button"
            variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => togglePlatform(platform)}
            className="h-8"
          >
            {platform}
          </Button>
        ))}
      </div>
      {selectedPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedPlatforms.map(platform => (
            <Badge key={platform} variant="secondary" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
