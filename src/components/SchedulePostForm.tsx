
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchedulePost } from '@/hooks/useScheduledPosts';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';
import { Calendar, Clock, Send } from 'lucide-react';

export const SchedulePostForm = () => {
  const [formData, setFormData] = useState({
    profileId: '',
    text: '',
    hashtags: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  const { data: profiles } = useSocialProfiles();
  const schedulePostMutation = useSchedulePost();

  const activeProfiles = profiles?.filter(profile => profile.active) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.profileId || !formData.text || !formData.scheduledDate || !formData.scheduledTime) {
      return;
    }

    const scheduledFor = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
    
    const hashtags = formData.hashtags
      .split(/[,\s]+/)
      .filter(tag => tag.trim())
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    await schedulePostMutation.mutateAsync({
      profile_id: formData.profileId,
      content: {
        text: formData.text,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      },
      scheduledFor,
    });

    // Reset form
    setFormData({
      profileId: '',
      text: '',
      hashtags: '',
      scheduledDate: '',
      scheduledTime: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Programar Post
        </CardTitle>
        <CardDescription>
          Programa un post para publicación automática en redes sociales
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Selection */}
          <div className="space-y-2">
            <Label htmlFor="profile">Perfil</Label>
            <Select 
              value={formData.profileId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, profileId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un perfil" />
              </SelectTrigger>
              <SelectContent>
                {activeProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name} ({profile.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="text">Contenido del Post</Label>
            <Textarea
              id="text"
              placeholder="Escribe el contenido de tu post..."
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="min-h-24"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags (opcional)</Label>
            <Input
              id="hashtags"
              placeholder="#marketing #socialmedia #content"
              value={formData.hashtags}
              onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Separa los hashtags con espacios o comas
            </p>
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={
              !formData.profileId || 
              !formData.text || 
              !formData.scheduledDate || 
              !formData.scheduledTime ||
              schedulePostMutation.isPending
            }
          >
            {schedulePostMutation.isPending ? 'Programando...' : 'Programar Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
