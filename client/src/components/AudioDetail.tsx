
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar, Download, Share2 } from 'lucide-react';
import type { AudioClip } from '../../../server/src/schema';

interface AudioDetailProps {
  audio: AudioClip;
}

export function AudioDetail({ audio }: AudioDetailProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this meme audio!',
          text: `"${audio.prompt}"`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Audio Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <Badge variant="secondary" className="text-sm">
              Audio Clip #{audio.id}
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={audio.audio_url} download>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>
            </div>
          </div>
          
          <CardTitle className="text-2xl mb-2">🎵 Audio Player</CardTitle>
          <CardDescription className="text-lg leading-relaxed">
            "{audio.prompt}"
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Audio Player */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
            <audio 
              controls 
              className="w-full mb-4"
              src={audio.audio_url}
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Duration: {formatDuration(audio.duration)}
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created: {audio.created_at.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Audio Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  📝 Original Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {audio.prompt}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-pink-50 border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  ℹ️ Audio Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">#{audio.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formatDuration(audio.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">MP3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {audio.created_at.toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Fun Facts */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🎭 Fun Audio Facts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-sm text-gray-600">AI Generated</div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-sm text-gray-600">Perfect Length</div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl mb-1">🔊</div>
              <div className="text-sm text-gray-600">Meme Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
