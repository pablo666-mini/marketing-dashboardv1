
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useScheduledPosts, useDeleteScheduledPost } from '@/hooks/useScheduledPosts';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface ScheduledPostsListProps {
  profileId?: string;
}

export const ScheduledPostsList = ({ profileId }: ScheduledPostsListProps) => {
  const { data: scheduledPosts, isLoading } = useScheduledPosts(profileId);
  const { data: profiles } = useSocialProfiles();
  const deletePostMutation = useDeleteScheduledPost();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const getProfileName = (profileId: string) => {
    const profile = profiles?.find(p => p.id === profileId);
    return profile ? `${profile.name} (${profile.platform})` : 'Perfil desconocido';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'sent':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'sent':
        return 'Enviado';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Posts Programados
        </CardTitle>
        <CardDescription>
          {scheduledPosts?.length || 0} posts programados
          {profileId ? ' para este perfil' : ' en total'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!scheduledPosts || scheduledPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay posts programados.
          </p>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {!profileId && (
                      <p className="text-sm font-medium text-muted-foreground">
                        {getProfileName(post.profile_id)}
                      </p>
                    )}
                    
                    <p className="text-sm">{post.content.text}</p>
                    
                    {post.content.hashtags && post.content.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.content.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Programado: {format(new Date(post.scheduled_for), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </span>
                      {post.external_id && (
                        <span>ID: {post.external_id}</span>
                      )}
                    </div>
                    
                    {post.error_message && (
                      <p className="text-xs text-red-600">
                        Error: {post.error_message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge 
                      variant={getStatusColor(post.status) as any}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(post.status)}
                      {getStatusText(post.status)}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePostMutation.mutate(post.id)}
                      disabled={deletePostMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
