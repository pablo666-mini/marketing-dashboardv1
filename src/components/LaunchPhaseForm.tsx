
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateLaunchPhase, useUpdateLaunchPhase } from '@/hooks/useLaunchPhases';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LaunchPhase, CreateLaunchPhaseInput, UpdateLaunchPhaseInput, PhaseStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchPhaseFormProps {
  launchId: string;
  phase?: LaunchPhase;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  status: PhaseStatus;
  start_date: Date | undefined;
  end_date: Date | undefined;
  responsible: string;
  notes: string;
}

const LaunchPhaseForm = ({ launchId, phase, onClose, onSuccess }: LaunchPhaseFormProps) => {
  const isEditing = !!phase;
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const createPhase = useCreateLaunchPhase();
  const updatePhase = useUpdateLaunchPhase();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      name: phase?.name || '',
      status: phase?.status || 'Not Started',
      start_date: phase ? new Date(phase.start_date) : undefined,
      end_date: phase ? new Date(phase.end_date) : undefined,
      responsible: phase?.responsible || '',
      notes: phase?.notes || '',
    }
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  const onSubmit = (data: FormData) => {
    if (!data.start_date || !data.end_date) return;

    const phaseData = {
      name: data.name,
      status: data.status,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
      responsible: data.responsible,
      notes: data.notes || null,
    };

    if (isEditing) {
      updatePhase.mutate(
        { id: phase.id, updates: phaseData as UpdateLaunchPhaseInput },
        { onSuccess }
      );
    } else {
      createPhase.mutate(
        { launch_id: launchId, ...phaseData } as CreateLaunchPhaseInput,
        { onSuccess }
      );
    }
  };

  const isLoading = createPhase.isPending || updatePhase.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Fase' : 'Crear Nueva Fase'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los detalles de la fase'
              : 'Completa los detalles para crear una nueva fase del lanzamiento'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Fase *</Label>
            <Input
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              placeholder="Ej: Investigación de Mercado"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <Select
              value={watch('status')}
              onValueChange={(value: PhaseStatus) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Sin Comenzar</SelectItem>
                <SelectItem value="In Progress">En Progreso</SelectItem>
                <SelectItem value="Completed">Completada</SelectItem>
                <SelectItem value="Blocked">Bloqueada</SelectItem>
              </SelectContent>
            </Select>
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
              placeholder="Ej: Equipo Creativo"
            />
            {errors.responsible && (
              <p className="text-sm text-destructive">{errors.responsible.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Agrega notas, comentarios o detalles adicionales..."
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
              {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Fase')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchPhaseForm;
