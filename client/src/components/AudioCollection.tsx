
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock } from 'lucide-react';
import type { AudioClip } from '../../../server/src/schema';

interface AudioCollectionProps {
  audioClips: AudioClip[];
  onAudioSelect: (audioId: number) => void;
}

export function AudioCollection({ audioClips, onAudioSelect }: AudioCollectionProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const truncatePrompt = (prompt: string, maxLength: number = 120): string => {
    return prompt.length > maxLength ? `${prompt.slice(0, maxLength)}...` : prompt;
  };

  if (audioClips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎵</div>
        <p className="text-xl text-gray-500 mb-2">No audio clips yet!</p>
        <p className="text-gray-400">Be the first to create something awesome! ✨</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {audioClips.map((audio: AudioClip) => (
        <Card 
          key={audio.id} 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/70 backdrop-blur-sm border border-purple-100"
          onClick={() => onAudioSelect(audio.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="text-xs">
                #{audio.id}
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(audio.duration)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm mb-4 leading-relaxed">
              "{truncatePrompt(audio.prompt)}"
            </CardDescription>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {audio.created_at.toLocaleDateString()}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="group-hover:bg-purple-50 group-hover:border-purple-200"
              >
                <Play className="h-3 w-3 mr-1" />
                Listen
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
