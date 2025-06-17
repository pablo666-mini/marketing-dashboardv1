
import React from 'react';
import { useLaunches } from '@/hooks/useLaunches';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { 
  GanttProvider, 
  GanttHeader, 
  GanttTimeline, 
  GanttToday,
  type GanttFeature 
} from '@/components/ui/gantt';
import { format } from 'date-fns';
import { useMemo } from 'react';

// Status color mappings
const launchStatusColors: Record<string, string> = {
  'Planned': '#6B7280',
  'In Progress': '#F59E0B',
  'Completed': '#10B981',
  'Canceled': '#EF4444',
};

const postStatusColors: Record<string, string> = {
  'Draft': '#9CA3AF',
  'Pending': '#FBBF24',
  'Approved': '#34D399',
  'Published': '#3B82F6',
  'Canceled': '#EF4444',
};

const LaunchTimeline: React.FC = () => {
  const { data: launches = [] } = useLaunches();
  const { data: posts = [] } = useSocialPosts();

  const features = useMemo<GanttFeature[]>(() => {
    console.log('Building Gantt features from launches and posts...');
    
    // Convert launches to Gantt features
    const launchFeatures: GanttFeature[] = launches.map(launch => ({
      id: `launch-${launch.id}`,
      name: launch.name,
      startAt: new Date(launch.start_date),
      endAt: new Date(launch.end_date),
      status: {
        id: launch.id,
        name: launch.status,
        color: launchStatusColors[launch.status] || '#6B7280'
      },
      group: {
        id: 'launches',
        name: 'Lanzamientos'
      }
    }));

    // Convert posts to Gantt features (single day events)
    const postFeatures: GanttFeature[] = posts.map(post => {
      const associatedLaunch = launches.find(l => l.id === post.launch_id);
      return {
        id: `post-${post.id}`,
        name: `${post.content_type} - ${format(new Date(post.post_date), 'dd/MM')}`,
        startAt: new Date(post.post_date),
        endAt: new Date(post.post_date), // Same day for posts
        status: {
          id: post.id,
          name: post.status || 'Draft',
          color: postStatusColors[post.status || 'Draft'] || '#9CA3AF'
        },
        group: {
          id: post.launch_id || 'no-launch',
          name: associatedLaunch ? `Posts - ${associatedLaunch.name}` : 'Posts sin Lanzamiento'
        }
      };
    });

    return [...launchFeatures, ...postFeatures];
  }, [launches, posts]);

  const handleFeatureClick = (feature: GanttFeature) => {
    console.log('Feature clicked:', feature);
    // You can add navigation or modal opening logic here
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Timeline de Lanzamientos & Publicaciones</h2>
        <p className="text-sm text-gray-600">
          Vista cronológica de todos los lanzamientos y publicaciones programadas
        </p>
      </div>
      
      <GanttProvider 
        features={features} 
        onFeatureClick={handleFeatureClick}
        className="h-[600px]"
      >
        <GanttHeader />
        <div className="relative flex-1">
          <GanttTimeline>
            <GanttToday />
          </GanttTimeline>
        </div>
      </GanttProvider>
    </div>
  );
};

export default LaunchTimeline;
