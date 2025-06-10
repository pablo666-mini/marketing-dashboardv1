
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { SocialPost } from '@/types';

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
  'Pending': 'bg-yellow-500',
  'Approved': 'bg-blue-500',
  'Published': 'bg-green-500',
  'Canceled': 'bg-red-500'
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
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthPosts = filteredPosts.filter(post => {
    const postDate = new Date(post.date);
    return postDate >= monthStart && postDate <= monthEnd;
  });

  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {monthPosts.length} publicaciones programadas este mes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, index) => {
            const dayPosts = getPostsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                `}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post, postIndex) => (
                    <div
                      key={postIndex}
                      className={`w-full h-2 rounded-sm ${statusColors[post.status]}`}
                      title={`${post.contentType} - ${getProfileName(post.profileId)}`}
                    />
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-xs text-muted-foreground">
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
