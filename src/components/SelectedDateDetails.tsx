
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SocialPost } from '@/types';

interface SelectedDateDetailsProps {
  selectedDate: Date;
  selectedDatePosts: SocialPost[];
  getProfileName: (profileId: string) => string;
  getProductName: (productId: string) => string;
}

const statusColors = {
  'Draft': 'bg-gray-500',
  'Pending': 'bg-yellow-500',
  'Approved': 'bg-blue-500',
  'Published': 'bg-green-500',
  'Canceled': 'bg-red-500'
};

export const SelectedDateDetails = ({ 
  selectedDate, 
  selectedDatePosts, 
  getProfileName, 
  getProductName 
}: SelectedDateDetailsProps) => {
  return (
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
                    {format(new Date(post.post_date), 'HH:mm')}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{getProductName(post.product_id || '')}</p>
                  <p className="text-xs text-muted-foreground">{getProfileName(post.profile_id || '')}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">{post.content_type}</Badge>
                    <Badge variant="secondary" className="text-xs">{post.content_format}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
