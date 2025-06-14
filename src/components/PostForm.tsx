
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  SocialProfile, 
  Product, 
  SocialPost, 
  ContentType, 
  ContentFormat, 
  PlatformCopy,
  Platform 
} from '@/types';
import { MultiPlatformSelector } from '@/components/MultiPlatformSelector';
import { PlatformCopiesEditor } from '@/components/PlatformCopiesEditor';

interface PostFormProps {
  activeProfiles: SocialProfile[];
  products: Product[];
  initialData?: SocialPost;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultLaunchId?: string;
}

const contentTypes: ContentType[] = ['Post', 'Reel', 'Story', 'Video'];
const contentFormats: ContentFormat[] = ['9:16', '4:5', '1:1', 'None'];

export const PostForm = ({ 
  activeProfiles, 
  products, 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading,
  defaultLaunchId
}: PostFormProps) => {
  const [formData, setFormData] = useState({
    productId: initialData?.product_id || '',
    date: initialData ? new Date(initialData.post_date) : new Date(),
    profileId: initialData?.profile_id || '',
    contentType: initialData?.content_type || 'Post' as ContentType,
    contentFormat: initialData?.content_format || '1:1' as ContentFormat,
    hashtags: initialData?.hashtags || [],
    launchId: initialData?.launch_id || defaultLaunchId || ''
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [copies, setCopies] = useState<PlatformCopy[]>([]);

  // Initialize platform selection and copies from initial data
  useEffect(() => {
    if (initialData?.copies && Array.isArray(initialData.copies)) {
      const platforms = initialData.copies.map(copy => copy.platform);
      setSelectedPlatforms(platforms);
      setCopies(initialData.copies);
    } else if (formData.profileId) {
      // If no initial data but profile selected, use profile's platform
      const profile = activeProfiles.find(p => p.id === formData.profileId);
      if (profile) {
        setSelectedPlatforms([profile.platform]);
        setCopies([{ platform: profile.platform, content: '', hashtags: [] }]);
      }
    }
  }, [initialData, formData.profileId, activeProfiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      product_id: formData.productId,
      post_date: formData.date.toISOString(),
      profile_id: formData.profileId,
      content_type: formData.contentType,
      content_format: formData.contentFormat,
      hashtags: formData.hashtags,
      copies: copies.length > 0 ? copies : [],
      launch_id: formData.launchId || null
    };

    console.log('Submitting post data:', submitData);
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="product">Producto</Label>
            <Select 
              value={formData.productId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profile">Perfil Social</Label>
            <Select 
              value={formData.profileId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, profileId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un perfil" />
              </SelectTrigger>
              <SelectContent>
                {activeProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name} ({profile.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fecha de Publicación</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: es }) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="contentType">Tipo de Contenido</Label>
            <Select 
              value={formData.contentType} 
              onValueChange={(value: ContentType) => setFormData(prev => ({ ...prev, contentType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contentFormat">Formato de Contenido</Label>
            <Select 
              value={formData.contentFormat} 
              onValueChange={(value: ContentFormat) => setFormData(prev => ({ ...prev, contentFormat: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <MultiPlatformSelector
            selectedPlatforms={selectedPlatforms}
            onChange={setSelectedPlatforms}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Copies per Platform */}
      <PlatformCopiesEditor
        selectedPlatforms={selectedPlatforms}
        copies={copies}
        onChange={setCopies}
      />

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || selectedPlatforms.length === 0}>
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'} Publicación
        </Button>
      </div>
    </form>
  );
};
