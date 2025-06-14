
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { SocialPost } from '@/types';
import { useMemo } from 'react';

interface CalendarGridProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  filteredPosts: SocialPost[];
  getPostsForDay: (day: Date) => SocialPost[];
  getProfileName: (profileId: string) => string;
}

const statusColors = {
  'Draft': 'bg-gray-500',
  'Pending': 'bg-yellow-500',
  'Approved': 'bg-blue-500',
  'Published': 'bg-green-500',
  'Canceled': 'bg-red-500'
};

const statusLabels = {
  'Draft': 'Borrador',
  'Pending': 'Pendiente',
  'Approved': 'Aprobada',
  'Published': 'Publicada',
  'Canceled': 'Cancelada'
};

export const CalendarGrid = ({ 
  currentDate, 
  setCurrentDate, 
  selectedDate, 
  setSelectedDate, 
  filteredPosts, 
  getPostsForDay,
  getProfileName 
}: CalendarGridProps) => {
  
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);
  
  const monthPosts = useMemo(() => {
    return filteredPosts.filter(post => {
      const postDate = new Date(post.post_date);
      return postDate >= monthStart && postDate <= monthEnd;
    });
  }, [filteredPosts, monthStart, monthEnd]);

  const monthDays = useMemo(() => {
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [monthStart, monthEnd]);

  const postsByStatus = useMemo(() => {
    return monthPosts.reduce((acc, post) => {
      acc[post.status] = (acc[post.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [monthPosts]);

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span className="hidden sm:inline">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
            <span className="sm:hidden">
              {format(currentDate, 'MMM yyyy', { locale: es })}
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="hidden sm:flex h-8 px-2"
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {monthPosts.length} publicaciones este mes
          </CardDescription>
          
          {/* Status indicators */}
          <div className="hidden md:flex items-center gap-2">
            {Object.entries(postsByStatus).map(([status, count]) => (
              <Tooltip key={status}>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs gap-1">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
                    {count}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{count} {statusLabels[status as keyof typeof statusLabels]}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Week days header */}
        <div className="grid grid-cols-7 border-b">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="text-center font-medium text-sm text-muted-foreground p-3 border-r last:border-r-0">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, index) => {
            const dayPosts = getPostsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isDayToday = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={index}
                className={`
                  min-h-[80px] sm:min-h-[100px] p-2 border-r border-b last:border-r-0 cursor-pointer transition-all duration-200
                  ${isSelected ? 'bg-primary text-primary-foreground shadow-inner' : 'hover:bg-muted/50'}
                  ${!isCurrentMonth ? 'text-muted-foreground bg-muted/20' : ''}
                  ${isDayToday && !isSelected ? 'bg-blue-50 border-blue-200' : ''}
                `}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`
                  text-sm font-medium mb-1 flex items-center justify-between
                  ${isDayToday && !isSelected ? 'text-blue-600 font-bold' : ''}
                `}>
                  <span>{format(day, 'd')}</span>
                  {dayPosts.length > 0 && (
                    <Badge 
                      variant={isSelected ? "secondary" : "outline"} 
                      className="text-xs h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {dayPosts.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post, postIndex) => {
                    const profileName = getProfileName(post.profile_id || '');
                    return (
                      <Tooltip key={postIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-full h-2 rounded-sm ${statusColors[post.status]} opacity-80 hover:opacity-100 transition-opacity`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{post.content_type}</p>
                            <p className="text-xs">{profileName}</p>
                            <p className="text-xs">{statusLabels[post.status]}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  
                  {dayPosts.length > 3 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <Users className="h-3 w-3 inline mr-1" />
                      +{dayPosts.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
