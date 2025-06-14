
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateProtocol, useUpdateProtocol, Protocol } from '@/hooks/useProtocols';
import { FileText, Plus } from 'lucide-react';

interface ProtocolFormProps {
  protocol?: Protocol;
  trigger?: React.ReactNode;
  onClose?: () => void;
}

const protocolTypes = [
  { value: 'image_naming', label: 'Nomenclatura de Imágenes' },
  { value: 'briefing', label: 'Estructura de Briefing' },
  { value: 'hashtags', label: 'Estrategia de Hashtags' },
  { value: 'general', label: 'General' },
  { value: 'custom', label: 'Tipo personalizado...' },
];

export const ProtocolForm = ({ protocol, trigger, onClose }: ProtocolFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(protocol?.title || '');
  const [description, setDescription] = useState(protocol?.description || '');
  const [type, setType] = useState<string>(protocol?.type || '');
  const [customType, setCustomType] = useState('');
  const [isCustomType, setIsCustomType] = useState(
    protocol?.type ? !protocolTypes.some(pt => pt.value === protocol.type && pt.value !== 'custom') : false
  );
  const [content, setContent] = useState(protocol?.content || '');
  const [active, setActive] = useState(protocol?.active ?? true);

  const createProtocol = useCreateProtocol();
  const updateProtocol = useUpdateProtocol();

  const isEditing = !!protocol;
  const isLoading = createProtocol.isPending || updateProtocol.isPending;

  // Initialize custom type if editing an existing protocol with a custom type
  useState(() => {
    if (protocol?.type && !protocolTypes.some(pt => pt.value === protocol.type && pt.value !== 'custom')) {
      setCustomType(protocol.type);
      setIsCustomType(true);
      setType('custom');
    }
  });

  const handleTypeChange = (value: string) => {
    setType(value);
    if (value === 'custom') {
      setIsCustomType(true);
    } else {
      setIsCustomType(false);
      setCustomType('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalType = isCustomType ? customType.trim() : type;
    
    if (!title.trim() || !finalType || !content.trim()) {
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      type: finalType,
      content: content.trim(),
      active,
    };

    try {
      if (isEditing) {
        await updateProtocol.mutateAsync({ id: protocol.id, updates: formData });
      } else {
        await createProtocol.mutateAsync(formData);
      }
      
      setOpen(false);
      onClose?.();
      
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setType('');
        setCustomType('');
        setIsCustomType(false);
        setContent('');
        setActive(true);
      }
    } catch (error) {
      console.error('Error saving protocol:', error);
    }
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Nuevo Protocolo
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
            <FileText className="h-5 w-5" />
            {isEditing ? 'Editar Protocolo' : 'Nuevo Protocolo'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los detalles del protocolo de comunicación.'
              : 'Crea un nuevo protocolo de comunicación para tu equipo.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Nomenclatura de Imágenes"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Protocolo *</Label>
              {!isCustomType ? (
                <Select value={type} onValueChange={handleTypeChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {protocolTypes.map((protocolType) => (
                      <SelectItem key={protocolType.value} value={protocolType.value}>
                        {protocolType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Escribe el tipo de protocolo"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCustomType(false);
                      setCustomType('');
                      setType('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del protocolo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido del Protocolo *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe detalladamente el protocolo, incluye ejemplos y mejores prácticas..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Protocolo activo</Label>
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
              {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Protocolo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
