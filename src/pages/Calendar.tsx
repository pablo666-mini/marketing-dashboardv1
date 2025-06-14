
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useSocialPostsByDateRange } from '@/hooks/useSocialPosts';
import { useActiveSocialProfiles } from '@/hooks/useSocialProfiles';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { isSameDay } from 'date-fns';
import { CalendarFilters as CalendarFiltersType, SocialPost } from '@/types';
import { CalendarFilters } from '@/components/CalendarFilters';
import { CalendarGrid } from '@/components/CalendarGrid';
import { SelectedDateDetails } from '@/components/SelectedDateDetails';

// Helper function to format date for API
const formatDateForAPI = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<CalendarFiltersType>({});

  // Calculate date range for the current month
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: posts = [], isLoading: postsLoading } = useSocialPostsByDateRange(
    formatDateForAPI(startDate),
    formatDateForAPI(endDate),
    !!(startDate && endDate)
  );
  const { data: activeProfiles, isLoading: profilesLoading } = useActiveSocialProfiles();
  const { data: products, isLoading: productsLoading } = useProducts();

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => {
      if (filters.profileId && post.profile_id !== filters.profileId) return false;
      if (filters.status && post.status !== filters.status) return false;
      if (filters.contentType && post.content_type !== filters.contentType) return false;
      if (filters.platform) {
        const profile = activeProfiles?.find(p => p.id === post.profile_id);
        if (profile?.platform !== filters.platform) return false;
      }
      return true;
    });
  }, [posts, filters, activeProfiles]);

  // Get posts for selected date
  const selectedDatePosts = useMemo(() => {
    if (!selectedDate) return [];
    return filteredPosts.filter(post => isSameDay(new Date(post.post_date), selectedDate));
  }, [selectedDate, filteredPosts]);

  const getPostsForDay = (day: Date) => {
    const dayString = format(day, 'yyyy-MM-dd');
    return posts.filter(post => {
      const postDate = format(new Date(post.post_date), 'yyyy-MM-dd');
      return postDate === dayString;
    });
  };

  const getProfileName = (profileId: string) => {
    const profile = activeProfiles?.find(p => p.id === profileId);
    return profile ? profile.name : 'Perfil no encontrado';
  };

  const getProductName = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  };

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
          <CalendarGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filteredPosts={filteredPosts}
            getPostsForDay={getPostsForDay}
            getProfileName={getProfileName}
          />
        </div>

        {/* Sidebar with filters and details */}
        <div className="space-y-6">
          {/* Filters */}
          <CalendarFilters
            filters={filters}
            setFilters={setFilters}
            activeProfiles={activeProfiles}
          />

          {/* Selected Date Details */}
          {selectedDate && (
            <SelectedDateDetails
              selectedDate={selectedDate}
              selectedDatePosts={selectedDatePosts}
              getProfileName={getProfileName}
              getProductName={getProductName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
