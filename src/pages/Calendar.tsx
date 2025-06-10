
// Editorial Calendar page - monthly view of scheduled posts with filters
import { useState, useMemo } from 'react';
import { usePosts, useActiveProfiles, useProducts } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarFilters, SocialPost, PostStatus, ContentType, Platform } from '@/types';

const Calendar = () => {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: activeProfiles, isLoading: profilesLoading } = useActiveProfiles();
  const { data: products, isLoading: productsLoading } = useProducts();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<CalendarFilters>({});

  if (postsLoading || profilesLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    return posts?.filter(post => {
      if (filters.profileId && filters.profileId !== 'all' && post.profileId !== filters.profileId) return false;
      if (filters.status && filters.status !== 'all' && post.status !== filters.status) return false;
      if (filters.contentType && filters.contentType !== 'all' && post.contentType !== filters.contentType) return false;
      if (filters.platform && filters.platform !== 'all') {
        const profile = activeProfiles?.find(p => p.id === post.profileId);
        if (profile?.platform !== filters.platform) return false;
      }
      return true;
    }) || [];
  }, [posts, filters, activeProfiles]);

  // Get posts for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthPosts = filteredPosts.filter(post => {
    const postDate = new Date(post.date);
    return postDate >= monthStart && postDate <= monthEnd;
  });

  // Get posts for selected date
  const selectedDatePosts = selectedDate 
    ? filteredPosts.filter(post => isSameDay(new Date(post.date), selectedDate))
    : [];

  // Generate calendar days
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDay = (day: Date) => {
    return filteredPosts.filter(post => isSameDay(new Date(post.date), day));
  };

  const getProfileName = (profileId: string) => {
    const profile = activeProfiles?.find(p => p.id === profileId);
    return profile ? profile.name : 'Perfil no encontrado';
  };

  const getProductName = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  };

  const statusColors = {
    'Pending': 'bg-yellow-500',
    'Approved': 'bg-blue-500',
    'Published': 'bg-green-500',
    'Canceled': 'bg-red-500'
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendario Editorial</h1>
          <p className="text-muted-foreground">
            Planifica y visualiza el contenido programado para redes sociales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
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
        </div>

        {/* Sidebar with filters and details */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Perfil</label>
                <Select 
                  value={filters.profileId || 'all'} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, profileId: value === 'all' ? undefined : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los perfiles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los perfiles</SelectItem>
                    {activeProfiles?.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name} ({profile.platform})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Estado</label>
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={(value: PostStatus | 'all') => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value as PostStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="Pending">Pendiente</SelectItem>
                    <SelectItem value="Approved">Aprobada</SelectItem>
                    <SelectItem value="Published">Publicada</SelectItem>
                    <SelectItem value="Canceled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select 
                  value={filters.contentType || 'all'} 
                  onValueChange={(value: ContentType | 'all') => setFilters(prev => ({ ...prev, contentType: value === 'all' ? undefined : value as ContentType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Post">Post</SelectItem>
                    <SelectItem value="Reel">Reel</SelectItem>
                    <SelectItem value="Story">Story</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
                </CardTitle>
                <CardDescription>
                  {selectedDatePosts.length} publicaciones programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDatePosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay publicaciones programadas para esta fecha
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDatePosts.map((post) => (
                      <div key={post.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={statusColors[post.status].replace('bg-', 'bg-opacity-20 border-') + ' border'}>
                            {post.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(post.date), 'HH:mm')}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{getProductName(post.productId)}</p>
                          <p className="text-xs text-muted-foreground">{getProfileName(post.profileId)}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">{post.contentType}</Badge>
                            <Badge variant="secondary" className="text-xs">{post.contentFormat}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
