
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { Platform, PREDEFINED_PLATFORMS } from '@/types';
import { useCreateSocialProfile } from '@/hooks/useSocialProfiles';

export const CreateProfileDialog = () => {
  const [open, setOpen] = useState(false);
  const [showCustomPlatform, setShowCustomPlatform] = useState(false);
  const [customPlatform, setCustomPlatform] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    platform: '' as Platform,
    active: true
  });

  const createProfile = useCreateSocialProfile();

  const handlePlatformChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomPlatform(true);
      setFormData(prev => ({ ...prev, platform: '' }));
    } else {
      setShowCustomPlatform(false);
      setCustomPlatform('');
      setFormData(prev => ({ ...prev, platform: value as Platform }));
    }
  };

  const handleCustomPlatformChange = (value: string) => {
    setCustomPlatform(value);
    setFormData(prev => ({ ...prev, platform: value as Platform }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPlatform = showCustomPlatform ? customPlatform : formData.platform;
    
    if (!formData.name || !formData.handle || !finalPlatform) {
      return;
    }

    createProfile.mutate({
      name: formData.name,
      handle: formData.handle,
      platform: finalPlatform as Platform,
      active: formData.active
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          name: '',
          handle: '',
          platform: '' as Platform,
          active: true
        });
        setShowCustomPlatform(false);
        setCustomPlatform('');
      }
    });
  };

  const isFormValid = formData.name && formData.handle && 
    (showCustomPlatform ? customPlatform : formData.platform);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Perfil Social</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="platform">Plataforma</Label>
            <Select 
              value={showCustomPlatform ? 'custom' : formData.platform} 
              onValueChange={handlePlatformChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plataforma" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_PLATFORMS.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  + Otra plataforma
                </SelectItem>
              </SelectContent>
            </Select>
            
            {showCustomPlatform && (
              <div className="mt-2">
                <Input
                  placeholder="Nombre de la plataforma"
                  value={customPlatform}
                  onChange={(e) => handleCustomPlatformChange(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="name">Nombre del Perfil</Label>
            <Input
              id="name"
              placeholder="ej: Miniland España"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="handle">Handle/Usuario</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                @
              </span>
              <Input
                id="handle"
                placeholder="miniland_es"
                value={formData.handle}
                onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                className="rounded-l-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Perfil activo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createProfile.isPending || !isFormValid}
            >
              {createProfile.isPending ? 'Creando...' : 'Crear Perfil'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
