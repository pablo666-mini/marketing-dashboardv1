
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  SocialProfile, 
  Product, 
  SocialPost, 
  ContentType, 
  ContentFormat, 
  PlatformCopy 
} from '@/types';
import { MultiProfileSelector } from '@/components/MultiProfileSelector';
import { MultiProfileCopiesEditor } from '@/components/MultiProfileCopiesEditor';

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
    contentType: initialData?.content_type || 'Post' as ContentType,
    contentFormat: initialData?.content_format || '1:1' as ContentFormat,
    hashtags: initialData?.hashtags || [],
    launchId: initialData?.launch_id || defaultLaunchId || ''
  });

  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [copies, setCopies] = useState<PlatformCopy[]>([]);

  // Initialize multi-profile selection and copies from initial data
  useEffect(() => {
    if (initialData) {
      // Handle multi-profile initialization
      const profileIds = initialData.profile_ids && initialData.profile_ids.length > 0 
        ? initialData.profile_ids 
        : (initialData.profile_id ? [initialData.profile_id] : []);
      
      setSelectedProfileIds(profileIds);

      if (initialData.copies && Array.isArray(initialData.copies)) {
        setCopies(initialData.copies);
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProfileIds.length === 0) {
      alert('Debes seleccionar al menos un perfil social');
      return;
    }

    const submitData = {
      product_id: formData.productId,
      post_date: formData.date.toISOString(),
      profile_ids: selectedProfileIds, // Multi-profile support
      content_type: formData.contentType,
      content_format: formData.contentFormat,
      hashtags: formData.hashtags,
      copies: copies.length > 0 ? copies : [],
      launch_id: formData.launchId || null
    };

    console.log('Submitting multi-profile post data:', submitData);
    onSubmit(submitData);
  };

  const selectedProfilesCount = selectedProfileIds.length;
  const selectedPlatforms = [...new Set(
    activeProfiles
      .filter(profile => selectedProfileIds.includes(profile.id))
      .map(profile => profile.platform)
  )];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with selection summary */}
      {selectedProfilesCount > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">
                Publicación multi-perfil: {selectedProfilesCount} perfil{selectedProfilesCount > 1 ? 'es' : ''} 
                en {selectedPlatforms.length} plataforma{selectedPlatforms.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedPlatforms.map(platform => (
                <span key={platform} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {platform}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

        {/* Multi-Profile Selection */}
        <div className="space-y-4">
          <MultiProfileSelector
            profiles={activeProfiles}
            selectedProfileIds={selectedProfileIds}
            onChange={setSelectedProfileIds}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Multi-Profile Copies Editor */}
      <MultiProfileCopiesEditor
        selectedProfileIds={selectedProfileIds}
        profiles={activeProfiles}
        copies={copies}
        onChange={setCopies}
      />

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || selectedProfileIds.length === 0}
          className="min-w-[120px]"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'} Publicación
          {selectedProfilesCount > 1 && (
            <span className="ml-1 text-xs opacity-75">
              ({selectedProfilesCount})
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};
