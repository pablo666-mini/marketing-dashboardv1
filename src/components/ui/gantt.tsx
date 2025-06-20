
import React, { createContext, useContext, useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isToday, differenceInDays, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';

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
  group?: GanttGroup;
  posts?: GanttPost[];
}

export interface GanttPost {
  id: string;
  name: string;
  postDate: Date;
  profileIds: string[];
}

type GanttContextType = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  features: GanttFeature[];
  onFeatureClick?: (feature: GanttFeature) => void;
  range: 'monthly' | 'weekly';
  zoom: number;
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
  range?: 'monthly' | 'weekly';
  zoom?: number;
}

export const GanttProvider: React.FC<GanttProviderProps> = ({ 
  children, 
  features, 
  onFeatureClick,
  className,
  range = 'monthly',
  zoom = 100
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <GanttContext.Provider value={{ currentDate, setCurrentDate, features, onFeatureClick, range, zoom }}>
      <TooltipProvider>
        <div className={cn("flex flex-col border rounded-lg bg-white", className)}>
          {children}
        </div>
      </TooltipProvider>
    </GanttContext.Provider>
  );
};

export const GanttHeader: React.FC = () => {
  const { currentDate, setCurrentDate, range } = useGantt();

  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Timeline de Lanzamientos
      </h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium min-w-[120px] text-center">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </span>
        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const GanttSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col">
      <div className="p-3 border-b bg-gray-100">
        <h4 className="font-medium text-sm text-gray-700">Lanzamientos</h4>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export const GanttTimeline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDate, features } = useGantt();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="flex-1 overflow-auto">
      {/* Days header */}
      <div className="grid grid-cols-1 border-b sticky top-0 bg-white z-10">
        <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={cn(
                "p-2 text-xs text-center bg-white border-r",
                isToday(day) && "bg-blue-50 font-medium text-blue-700"
              )}
            >
              <div className="font-medium">{format(day, 'd')}</div>
              <div className="text-gray-500">{format(day, 'EEE', { locale: es })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature rows */}
      <div className="space-y-px bg-gray-100">
        {features.map(feature => (
          <GanttFeatureRow key={feature.id} feature={feature} days={days} />
        ))}
      </div>

      {children}
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

    const actualEndIndex = endIndex === -1 ? days.length - 1 : endIndex;
    const width = actualEndIndex - startIndex + 1;

    return {
      left: `${(startIndex / days.length) * 100}%`,
      width: `${(width / days.length) * 100}%`,
    };
  };

  const getPostPositions = () => {
    if (!feature.posts) return [];
    
    return feature.posts.map(post => {
      const postIndex = days.findIndex(day => isSameDay(day, post.postDate));
      if (postIndex === -1) return null;
      
      return {
        post,
        left: `${(postIndex / days.length) * 100}%`,
        width: `${(1 / days.length) * 100}%`,
      };
    }).filter(Boolean);
  };

  const position = getFeaturePosition();
  const postPositions = getPostPositions();
  const duration = feature.endAt ? differenceInDays(feature.endAt, feature.startAt) + 1 : 1;

  return (
    <div className="bg-white border-b hover:bg-gray-50 transition-colors">
      <div className="h-16 relative">
        {/* Launch bar */}
        {position && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="absolute top-2 h-8 rounded px-3 flex items-center cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
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
                <div className="ml-auto flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: feature.status.color }}
                  />
                  <span className="text-xs text-gray-600">{duration}d</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div className="font-medium">{feature.name}</div>
                <div className="text-gray-500">
                  {format(feature.startAt, 'dd/MM/yyyy', { locale: es })} - {' '}
                  {feature.endAt ? format(feature.endAt, 'dd/MM/yyyy', { locale: es }) : 'Ongoing'}
                </div>
                <div className="text-gray-500">{feature.status.name}</div>
                {feature.posts && feature.posts.length > 0 && (
                  <div className="text-gray-500 mt-1">
                    {feature.posts.length} posts programados
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Post markers */}
        {postPositions.map((postPos: any, index) => (
          <Tooltip key={postPos.post.id}>
            <TooltipTrigger asChild>
              <div
                className="absolute top-11 h-3 rounded cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  left: postPos.left, 
                  width: postPos.width,
                  backgroundColor: feature.status.color,
                  minWidth: '8px'
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div className="font-medium">Post</div>
                <div className="text-gray-500">
                  {format(postPos.post.postDate, 'dd/MM/yyyy', { locale: es })}
                </div>
                <div className="text-gray-500">
                  {postPos.post.profileIds.length} perfiles
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export const GanttFeatureListGroup: React.FC<{ 
  name: string; 
  children: React.ReactNode 
}> = ({ name, children }) => {
  return (
    <div className="p-3 border-b">
      <div className="text-sm font-medium text-gray-800 mb-2">{name}</div>
      <div className="text-xs text-gray-500 space-y-1">
        {children}
      </div>
    </div>
  );
};

export const GanttFeatureItem: React.FC<{
  id: string;
  name: string;
  startAt: Date;
  endAt: Date | null;
  status: GanttStatus;
  posts?: GanttPost[];
}> = ({ name, startAt, endAt, status, posts }) => {
  const duration = endAt ? differenceInDays(endAt, startAt) + 1 : 1;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="font-medium text-xs">{name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: status.color }}
          />
          <span>{status.name}</span>
          <span>• {duration} días</span>
          {posts && posts.length > 0 && (
            <span>• {posts.length} posts</span>
          )}
        </div>
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
      className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
      style={{ left: `${(todayIndex / days.length) * 100}%` }}
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
    </div>
  );
};
