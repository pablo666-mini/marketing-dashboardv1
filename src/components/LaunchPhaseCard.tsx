
import { useState } from 'react';
import { useUpdateLaunchPhase, useDeleteLaunchPhase } from '@/hooks/useLaunchPhases';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaunchPhase, PhaseStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play
} from 'lucide-react';
import LaunchPhaseForm from './LaunchPhaseForm';

interface LaunchPhaseCardProps {
  phase: LaunchPhase;
}

const LaunchPhaseCard = ({ phase }: LaunchPhaseCardProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const updatePhase = useUpdateLaunchPhase();
  const deletePhase = useDeleteLaunchPhase();

  const getStatusColor = (status: PhaseStatus) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-500 hover:bg-gray-600';
      case 'In Progress': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Completed': return 'bg-green-500 hover:bg-green-600';
      case 'Blocked': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: PhaseStatus) => {
    switch (status) {
      case 'Not Started': return <Clock className="h-4 w-4" />;
      case 'In Progress': return <Play className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Blocked': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: PhaseStatus) => {
    switch (status) {
      case 'Not Started': return 'Sin Comenzar';
      case 'In Progress': return 'En Progreso';
      case 'Completed': return 'Completada';
      case 'Blocked': return 'Bloqueada';
      default: return status;
    }
  };

  const handleStatusChange = (newStatus: PhaseStatus) => {
    updatePhase.mutate({
      id: phase.id,
      updates: { status: newStatus }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta fase? Esta acción no se puede deshacer.')) {
      deletePhase.mutate(phase.id);
    }
  };

  return (
    <>
      <Card className="relative group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(phase.status).replace('hover:', '')}`}>
                <div className="text-white">
                  {getStatusIcon(phase.status)}
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">{phase.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(phase.status)}>
                    {getStatusText(phase.status)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditForm(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deletePhase.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Responsable:</span>
              <span className="font-medium">{phase.responsible}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Período:</span>
              <span className="font-medium">
                {format(new Date(phase.start_date), 'dd/MM', { locale: es })} - {' '}
                {format(new Date(phase.end_date), 'dd/MM/yyyy', { locale: es })}
              </span>
            </div>
          </div>

          {/* Quick Status Change */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Cambiar estado:</span>
            <Select
              value={phase.status}
              onValueChange={handleStatusChange}
              disabled={updatePhase.isPending}
            >
              <SelectTrigger className="w-40 h-8">
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

          {phase.notes && (
            <CardDescription className="mt-3 pt-3 border-t border-border">
              <strong>Notas:</strong> {phase.notes}
            </CardDescription>
          )}
        </CardContent>
      </Card>

      {/* Edit Form Modal */}
      {showEditForm && (
        <LaunchPhaseForm
          launchId={phase.launch_id}
          phase={phase}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => setShowEditForm(false)}
        />
      )}
    </>
  );
};

export default LaunchPhaseCard;
