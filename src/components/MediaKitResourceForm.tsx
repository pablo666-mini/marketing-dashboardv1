
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCreateMediaKitResource, useUpdateMediaKitResource, MediaKitResource } from '@/hooks/useMediaKitResources';
import { FolderOpen, Plus, X } from 'lucide-react';

interface MediaKitResourceFormProps {
  resource?: MediaKitResource;
  trigger?: React.ReactNode;
  onClose?: () => void;
}

const resourceCategories = [
  { value: 'press_convocation', label: 'Convocatoria de Prensa' },
  { value: 'press_note', label: 'Nota de Prensa' },
  { value: 'banners', label: 'Banners' },
  { value: 'photos', label: 'Fotografías' },
  { value: 'videos', label: 'Videos' },
  { value: 'custom', label: 'Categoría personalizada...' },
];

const commonFormats = [
  'JPG', 'PNG', 'SVG', 'PDF', 'MP4', 'MOV', 'AVI', 'PSD', 'AI', 'FIGMA', 'ZIP'
];

export const MediaKitResourceForm = ({ resource, trigger, onClose }: MediaKitResourceFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(resource?.name || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [category, setCategory] = useState<string>(resource?.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(
    resource?.category ? !resourceCategories.some(cat => cat.value === resource.category && cat.value !== 'custom') : false
  );
  const [url, setUrl] = useState(resource?.url || '');
  const [format, setFormat] = useState(resource?.format || '');
  const [fileSize, setFileSize] = useState(resource?.file_size?.toString() || '');
  const [tags, setTags] = useState<string[]>(resource?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [active, setActive] = useState(resource?.active ?? true);

  const createResource = useCreateMediaKitResource();
  const updateResource = useUpdateMediaKitResource();

  const isEditing = !!resource;
  const isLoading = createResource.isPending || updateResource.isPending;

  // Initialize custom category if editing an existing resource with a custom category
  useState(() => {
    if (resource?.category && !resourceCategories.some(cat => cat.value === resource.category && cat.value !== 'custom')) {
      setCustomCategory(resource.category);
      setIsCustomCategory(true);
      setCategory('custom');
    }
  });

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value === 'custom') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    
    if (!name.trim() || !finalCategory || !url.trim()) {
      return;
    }

    const formData = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: finalCategory as any,
      url: url.trim(),
      format: format.trim() || undefined,
      file_size: fileSize ? parseInt(fileSize) : undefined,
      tags: tags.length > 0 ? tags : undefined,
      active,
    };

    try {
      if (isEditing) {
        await updateResource.mutateAsync({ id: resource.id, updates: formData });
      } else {
        await createResource.mutateAsync(formData);
      }
      
      setOpen(false);
      onClose?.();
      
      if (!isEditing) {
        setName('');
        setDescription('');
        setCategory('');
        setCustomCategory('');
        setIsCustomCategory(false);
        setUrl('');
        setFormat('');
        setFileSize('');
        setTags([]);
        setTagInput('');
        setActive(true);
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Nuevo Recurso
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {isEditing ? 'Editar Recurso' : 'Nuevo Recurso'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los detalles del recurso del kit de medios.'
              : 'Añade un nuevo recurso al kit de medios.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Recurso *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Logo Principal Horizontal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              {!isCustomCategory ? (
                <Select value={category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Escribe la categoría del recurso"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setCustomCategory('');
                      setCategory('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL del Recurso *</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com/recurso.jpg o /media/logos/logo.png"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el recurso y su uso recomendado..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el formato" />
                </SelectTrigger>
                <SelectContent>
                  {commonFormats.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {fmt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileSize">Tamaño (KB)</Label>
              <Input
                id="fileSize"
                type="number"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="1024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Añadir tag"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Añadir
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Recurso activo</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Recurso
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
