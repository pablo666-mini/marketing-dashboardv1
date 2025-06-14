
// Form component for creating and editing social media posts
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
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
    copies: initialData?.copies || [] as PlatformCopy[],
    launchId: initialData?.launch_id || defaultLaunchId || ''
  });

  const [newHashtag, setNewHashtag] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<SocialProfile | null>(null);

  useEffect(() => {
    if (formData.profileId) {
      const profile = activeProfiles.find(p => p.id === formData.profileId);
      setSelectedProfile(profile || null);
    }
  }, [formData.profileId, activeProfiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      date: formData.date.toISOString(),
      copies: Array.isArray(formData.copies) && formData.copies.length > 0 ? formData.copies : [
        {
          platform: selectedProfile?.platform || 'Instagram',
          content: '',
          hashtags: formData.hashtags
        }
      ]
    };

    console.log('Submitting post data:', submitData);
    onSubmit(submitData);
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !formData.hashtags.includes(newHashtag.trim())) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag.trim()]
      }));
      setNewHashtag('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const updateCopy = (platform: Platform, content: string) => {
    setFormData(prev => {
      const copies = Array.isArray(prev.copies) ? prev.copies : [];
      const existingCopyIndex = copies.findIndex(c => c.platform === platform);
      
      if (existingCopyIndex >= 0) {
        const updatedCopies = [...copies];
        updatedCopies[existingCopyIndex] = {
          ...updatedCopies[existingCopyIndex],
          content,
          hashtags: prev.hashtags
        };
        return { ...prev, copies: updatedCopies };
      } else {
        return {
          ...prev,
          copies: [...copies, { platform, content, hashtags: prev.hashtags }]
        };
      }
    });
  };

  const getCopyForPlatform = (platform: Platform) => {
    if (!Array.isArray(formData.copies)) return '';
    return formData.copies.find(c => c.platform === platform)?.content || '';
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

        {/* Hashtags */}
        <div className="space-y-4">
          <div>
            <Label>Hashtags</Label>
            <div className="flex gap-2">
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="#hashtag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
              />
              <Button type="button" onClick={addHashtag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hashtags.map((hashtag) => (
                <Badge key={hashtag} variant="secondary" className="gap-1">
                  {hashtag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeHashtag(hashtag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copy per Platform */}
      {selectedProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Contenido para {selectedProfile.platform}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="copy">Texto de la publicación</Label>
              <Textarea
                value={getCopyForPlatform(selectedProfile.platform)}
                onChange={(e) => updateCopy(selectedProfile.platform, e.target.value)}
                placeholder="Escribe el contenido de la publicación..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'} Publicación
        </Button>
      </div>
    </form>
  );
};
