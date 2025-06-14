
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProducts } from '@/hooks/useProducts';
import { useCreateLaunch, useUpdateLaunch } from '@/hooks/useLaunches';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Launch, CreateLaunchInput, UpdateLaunchInput, LaunchCategory, LaunchStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchFormProps {
  launch?: Launch;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  product_id: string;
  category: LaunchCategory;
  status: LaunchStatus;
  start_date: Date | undefined;
  end_date: Date | undefined;
  description: string;
  responsible: string;
}

const LaunchForm = ({ launch, onClose, onSuccess }: LaunchFormProps) => {
  const isEditing = !!launch;
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const { data: products } = useProducts();
  const createLaunch = useCreateLaunch();
  const updateLaunch = useUpdateLaunch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      name: launch?.name || '',
      product_id: launch?.product_id || 'none',
      category: launch?.category || 'Other',
      status: launch?.status || 'Planned',
      start_date: launch ? new Date(launch.start_date) : undefined,
      end_date: launch ? new Date(launch.end_date) : undefined,
      description: launch?.description || '',
      responsible: launch?.responsible || '',
    }
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  const onSubmit = (data: FormData) => {
    if (!data.start_date || !data.end_date) return;

    const launchData = {
      name: data.name,
      product_id: data.product_id !== 'none' ? data.product_id : null,
      category: data.category,
      status: data.status,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
      description: data.description || null,
      responsible: data.responsible,
    };

    if (isEditing) {
      updateLaunch.mutate(
        { id: launch.id, updates: launchData as UpdateLaunchInput },
        { onSuccess }
      );
    } else {
      createLaunch.mutate(launchData as CreateLaunchInput, { onSuccess });
    }
  };

  const isLoading = createLaunch.isPending || updateLaunch.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Lanzamiento' : 'Crear Nuevo Lanzamiento'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los detalles del lanzamiento'
              : 'Completa los detalles para crear un nuevo lanzamiento'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Lanzamiento *</Label>
            <Input
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              placeholder="Ej: Lanzamiento Baby Walker Q3"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Producto</Label>
            <Select
              value={watch('product_id')}
              onValueChange={(value) => setValue('product_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin producto específico</SelectItem>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={watch('category')}
                onValueChange={(value: LaunchCategory) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product Launch">Lanzamiento de Producto</SelectItem>
                  <SelectItem value="Campaign">Campaña</SelectItem>
                  <SelectItem value="Update">Actualización</SelectItem>
                  <SelectItem value="Other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: LaunchStatus) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planificado</SelectItem>
                  <SelectItem value="In Progress">En Progreso</SelectItem>
                  <SelectItem value="Completed">Completado</SelectItem>
                  <SelectItem value="Canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio *</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'dd/MM/yyyy', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setValue('start_date', date);
                      setStartDateOpen(false);
                    }}
                    locale={es}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Fin *</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, 'dd/MM/yyyy', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setValue('end_date', date);
                      setEndDateOpen(false);
                    }}
                    locale={es}
                    disabled={(date) => startDate ? date <= startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Responsible */}
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsable *</Label>
            <Input
              id="responsible"
              {...register('responsible', { required: 'El responsable es requerido' })}
              placeholder="Ej: María González"
            />
            {errors.responsible && (
              <p className="text-sm text-destructive">{errors.responsible.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe los objetivos y detalles del lanzamiento..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Lanzamiento')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchForm;
