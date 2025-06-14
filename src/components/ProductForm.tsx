
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Plus, Info, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product, CreateProduct, UpdateProduct } from '@/types/supabase';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  creative_concept: string;
  landing_url: string;
  communication_kit_url: string;
  briefing: string;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const isEditing = !!product;
  const { toast } = useToast();
  const [countries, setCountries] = useState<string[]>(product?.countries || []);
  const [hashtags, setHashtags] = useState<string[]>(product?.hashtags || []);
  const [objectives, setObjectives] = useState<string[]>(product?.sales_objectives || []);
  const [newCountry, setNewCountry] = useState('');
  const [newHashtag, setNewHashtag] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      creative_concept: product?.creative_concept || '',
      landing_url: product?.landing_url || '',
      communication_kit_url: product?.communication_kit_url || '',
      briefing: product?.briefing || '',
    }
  });

  const addCountry = () => {
    if (newCountry.trim() && !countries.includes(newCountry.trim())) {
      setCountries([...countries, newCountry.trim()]);
      setNewCountry('');
      toast({
        title: "País agregado",
        description: `Se agregó ${newCountry.trim()} a la lista`,
        duration: 2000,
      });
    }
  };

  const removeCountry = (country: string) => {
    setCountries(countries.filter(c => c !== country));
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      const hashtag = newHashtag.trim().startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
      setHashtags([...hashtags, hashtag]);
      setNewHashtag('');
      toast({
        title: "Hashtag agregado",
        description: `Se agregó ${hashtag} a la lista`,
        duration: 2000,
      });
    }
  };

  const removeHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter(h => h !== hashtag));
  };

  const addObjective = () => {
    if (newObjective.trim() && !objectives.includes(newObjective.trim())) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
      toast({
        title: "Objetivo agregado",
        description: `Se agregó el objetivo a la lista`,
        duration: 2000,
      });
    }
  };

  const removeObjective = (objective: string) => {
    setObjectives(objectives.filter(o => o !== objective));
  };

  const onSubmit = (data: FormData) => {
    const productData = {
      name: data.name,
      description: data.description || null,
      creative_concept: data.creative_concept || null,
      landing_url: data.landing_url || null,
      communication_kit_url: data.communication_kit_url || null,
      briefing: data.briefing || null,
      countries: countries.length > 0 ? countries : null,
      hashtags: hashtags.length > 0 ? hashtags : null,
      sales_objectives: objectives.length > 0 ? objectives : null,
    };

    if (isEditing) {
      updateProduct.mutate(
        { id: product.id, updates: productData as UpdateProduct },
        { 
          onSuccess: () => {
            toast({
              title: "Producto actualizado",
              description: "Los cambios se guardaron correctamente",
              duration: 3000,
            });
            onSuccess();
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Error al actualizar",
              description: "No se pudo actualizar el producto. Inténtalo nuevamente.",
            });
          }
        }
      );
    } else {
      createProduct.mutate(productData as CreateProduct, { 
        onSuccess: () => {
          toast({
            title: "Producto creado",
            description: "El nuevo producto se creó correctamente",
            duration: 3000,
          });
          onSuccess();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error al crear",
            description: "No se pudo crear el producto. Inténtalo nuevamente.",
          });
        }
      });
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Completa la información básica del producto para poder crear lanzamientos asociados</p>
              </TooltipContent>
            </Tooltip>
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica la información del producto'
              : 'Completa la información para crear un nuevo producto'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                Nombre del Producto *
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nombre comercial del producto que aparecerá en los lanzamientos</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'El nombre es requerido' })}
                placeholder="Ej: Miniland Baby Walker"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                Descripción
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Descripción detallada de las características principales del producto</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe las características principales del producto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creative_concept" className="flex items-center gap-2">
                Concepto Creativo
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define el enfoque creativo y la propuesta de valor única del producto</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Textarea
                id="creative_concept"
                {...register('creative_concept')}
                placeholder="Define el concepto creativo y la propuesta de valor..."
                rows={3}
              />
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="landing_url" className="flex items-center gap-2">
                URL del Producto
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enlace a la página oficial del producto o landing page</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="landing_url"
                {...register('landing_url')}
                placeholder="https://..."
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="communication_kit_url" className="flex items-center gap-2">
                URL Kit de Comunicación
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enlace al media kit, imágenes y recursos para influencers</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="communication_kit_url"
                {...register('communication_kit_url')}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Países
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Países donde se comercializa el producto</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex gap-2">
              <Input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="Añadir país..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                className="flex-1"
              />
              <Button type="button" onClick={addCountry} size="sm" disabled={!newCountry.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {countries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {countries.map((country) => (
                  <Badge key={country} variant="secondary" className="gap-1">
                    {country}
                    <button
                      type="button"
                      onClick={() => removeCountry(country)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Hashtags
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hashtags principales para las publicaciones del producto</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex gap-2">
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="Añadir hashtag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                className="flex-1"
              />
              <Button type="button" onClick={addHashtag} size="sm" disabled={!newHashtag.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((hashtag) => (
                  <Badge key={hashtag} variant="outline" className="gap-1">
                    {hashtag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(hashtag)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Sales Objectives */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Objetivos de Venta
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Objetivos específicos de ventas y KPIs para el producto</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex gap-2">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Añadir objetivo..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                className="flex-1"
              />
              <Button type="button" onClick={addObjective} size="sm" disabled={!newObjective.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {objectives.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {objectives.map((objective) => (
                  <Badge key={objective} variant="secondary" className="gap-1">
                    {objective}
                    <button
                      type="button"
                      onClick={() => removeObjective(objective)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Briefing */}
          <div className="space-y-2">
            <Label htmlFor="briefing" className="flex items-center gap-2">
              Briefing
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Información adicional, instrucciones especiales y guidelines</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              id="briefing"
              {...register('briefing')}
              placeholder="Información adicional, instrucciones especiales, guidelines..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isLoading || (!isDirty && !isEditing)}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {isEditing ? 'Actualizar' : 'Crear Producto'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
