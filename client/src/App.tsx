
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { AudioGenerator } from '@/components/AudioGenerator';
import { AudioCollection } from '@/components/AudioCollection';
import { AudioDetail } from '@/components/AudioDetail';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { AudioClip } from '../../server/src/schema';

function App() {
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioClip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'collection' | 'detail'>('collection');

  const loadAudioClips = useCallback(async () => {
    try {
      const clips = await trpc.getAudioClips.query();
      setAudioClips(clips);
    } catch (error) {
      console.error('Failed to load audio clips:', error);
    }
  }, []);

  useEffect(() => {
    loadAudioClips();
  }, [loadAudioClips]);

  const handleAudioCreated = useCallback((newAudio: AudioClip) => {
    setAudioClips((prev: AudioClip[]) => [newAudio, ...prev]);
  }, []);

  const handleAudioSelect = useCallback(async (audioId: number) => {
    try {
      const audio = await trpc.getAudioById.query({ id: audioId });
      if (audio) {
        setSelectedAudio(audio);
        setView('detail');
      }
    } catch (error) {
      console.error('Failed to load audio details:', error);
    }
  }, []);

  const handleBackToCollection = useCallback(() => {
    setSelectedAudio(null);
    setView('collection');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🎵 Meme Audio Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your wildest ideas into hilarious 30-second audio clips!
          </p>
        </div>

        {view === 'collection' ? (
          <>
            {/* Audio Generator */}
            <div className="max-w-2xl mx-auto mb-12">
              <AudioGenerator 
                onAudioCreated={handleAudioCreated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            <Separator className="my-8" />

            {/* Audio Collection */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                🎭 Community Collection
              </h2>
              <AudioCollection 
                audioClips={audioClips}
                onAudioSelect={handleAudioSelect}
              />
            </div>
          </>
        ) : (
          /* Audio Detail View */
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={handleBackToCollection}
              variant="outline"
              className="mb-6"
            >
              ← Back to Collection
            </Button>
            {selectedAudio && (
              <AudioDetail audio={selectedAudio} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
