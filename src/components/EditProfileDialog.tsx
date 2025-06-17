
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useUpdateSocialProfile } from '@/hooks/useSocialProfiles';
import { SocialProfile } from '@/types/supabase';
import { Edit2 } from 'lucide-react';

interface EditProfileDialogProps {
  profile: SocialProfile;
}

export const EditProfileDialog = ({ profile }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    handle: profile.handle,
    description: profile.description || '',
    url: profile.url || '',
    followers_count: profile.followers_count || 0,
    growth_rate: profile.growth_rate || 0,
    engagement_rate: profile.engagement_rate || 0,
    notes: profile.notes || '',
    active: profile.active || false,
  });

  const updateProfile = useUpdateSocialProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        updates: {
          name: formData.name,
          handle: formData.handle,
          description: formData.description || null,
          url: formData.url || null,
          followers_count: formData.followers_count,
          growth_rate: formData.growth_rate,
          engagement_rate: formData.engagement_rate,
          notes: formData.notes || null,
          active: formData.active,
        }
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil Social</DialogTitle>
          <DialogDescription>
            Actualiza la información del perfil de {profile.platform}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => handleInputChange('handle', e.target.value)}
                placeholder="@username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del perfil..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL del Perfil</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="followers">Seguidores</Label>
              <Input
                id="followers"
                type="number"
                min="0"
                value={formData.followers_count}
                onChange={(e) => handleInputChange('followers_count', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="growth">Crecimiento (%)</Label>
              <Input
                id="growth"
                type="number"
                step="0.01"
                value={formData.growth_rate}
                onChange={(e) => handleInputChange('growth_rate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engagement">Engagement (%)</Label>
              <Input
                id="engagement"
                type="number"
                step="0.01"
                value={formData.engagement_rate}
                onChange={(e) => handleInputChange('engagement_rate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas adicionales..."
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Perfil activo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
