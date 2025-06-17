
import React, { createContext, useContext, useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type GanttGroup = { 
  id: string; 
  name: string; 
};

export type GanttStatus = { 
  id: string; 
  name: string; 
  color: string; 
};

export interface GanttFeature {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date | null;
  status: GanttStatus;
  group: GanttGroup;
}

type GanttContextType = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  features: GanttFeature[];
  onFeatureClick?: (feature: GanttFeature) => void;
};

const GanttContext = createContext<GanttContextType | null>(null);

const useGantt = () => {
  const context = useContext(GanttContext);
  if (!context) {
    throw new Error('Gantt components must be used within GanttProvider');
  }
  return context;
};

interface GanttProviderProps {
  children: React.ReactNode;
  features: GanttFeature[];
  onFeatureClick?: (feature: GanttFeature) => void;
  className?: string;
}

export const GanttProvider: React.FC<GanttProviderProps> = ({ 
  children, 
  features, 
  onFeatureClick,
  className 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <GanttContext.Provider value={{ currentDate, setCurrentDate, features, onFeatureClick }}>
      <div className={cn("flex flex-col border rounded-lg bg-white", className)}>
        {children}
      </div>
    </GanttContext.Provider>
  );
};

export const GanttHeader: React.FC = () => {
  const { currentDate, setCurrentDate } = useGantt();

  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
      <h3 className="text-lg font-semibold">Timeline de Lanzamientos</h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium min-w-[120px] text-center">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const GanttTimeline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDate, features } = useGantt();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const groupedFeatures = useMemo(() => {
    return features.reduce<Record<string, GanttFeature[]>>((acc, feature) => {
      const groupName = feature.group.name;
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(feature);
      return acc;
    }, {});
  }, [features]);

  return (
    <div className="flex-1 overflow-auto">
      {/* Days header */}
      <div className="grid grid-cols-[200px_1fr] border-b">
        <div className="p-2 border-r bg-gray-50 font-medium">Elementos</div>
        <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={cn(
                "p-1 text-xs text-center bg-white",
                isToday(day) && "bg-blue-50 font-medium text-blue-700"
              )}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </div>

      {/* Feature rows */}
      <div className="space-y-px bg-gray-100">
        {Object.entries(groupedFeatures).map(([groupName, groupFeatures]) => (
          <GanttGroup key={groupName} name={groupName} features={groupFeatures} days={days} />
        ))}
      </div>

      {children}
    </div>
  );
};

interface GanttGroupProps {
  name: string;
  features: GanttFeature[];
  days: Date[];
}

const GanttGroup: React.FC<GanttGroupProps> = ({ name, features, days }) => {
  return (
    <div className="bg-white">
      {/* Group header */}
      <div className="grid grid-cols-[200px_1fr] border-b">
        <div className="p-2 border-r bg-gray-50 font-medium text-sm">{name}</div>
        <div className="bg-gray-50"></div>
      </div>
      
      {/* Group features */}
      {features.map(feature => (
        <GanttFeatureRow key={feature.id} feature={feature} days={days} />
      ))}
    </div>
  );
};

interface GanttFeatureRowProps {
  feature: GanttFeature;
  days: Date[];
}

const GanttFeatureRow: React.FC<GanttFeatureRowProps> = ({ feature, days }) => {
  const { onFeatureClick } = useGantt();

  const getFeaturePosition = () => {
    const startIndex = days.findIndex(day => isSameDay(day, feature.startAt));
    const endIndex = feature.endAt 
      ? days.findIndex(day => isSameDay(day, feature.endAt!))
      : startIndex;

    if (startIndex === -1) return null;

    const actualEndIndex = endIndex === -1 ? startIndex : endIndex;
    const width = actualEndIndex - startIndex + 1;

    return {
      left: `${(startIndex / days.length) * 100}%`,
      width: `${(width / days.length) * 100}%`,
    };
  };

  const position = getFeaturePosition();

  return (
    <div className="grid grid-cols-[200px_1fr] border-b hover:bg-gray-50">
      <div className="p-2 border-r">
        <div className="text-sm font-medium truncate">{feature.name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: feature.status.color }}
          />
          {feature.status.name}
        </div>
      </div>
      
      <div className="relative h-12 bg-white">
        {position && (
          <div
            className="absolute top-2 h-8 rounded px-2 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            style={{ 
              left: position.left, 
              width: position.width,
              backgroundColor: feature.status.color + '20',
              border: `2px solid ${feature.status.color}`
            }}
            onClick={() => onFeatureClick?.(feature)}
          >
            <span className="text-xs font-medium truncate text-gray-800">
              {feature.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const GanttToday: React.FC = () => {
  const { currentDate } = useGantt();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const todayIndex = days.findIndex(day => isToday(day));
  
  if (todayIndex === -1) return null;

  return (
    <div 
      className="absolute top-0 bottom-0 w-px bg-red-500 z-10 pointer-events-none"
      style={{ left: `calc(200px + ${(todayIndex / days.length) * 100}%)` }}
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
    </div>
  );
};
