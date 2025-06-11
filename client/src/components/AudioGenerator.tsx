
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { AudioClip, CreateAudioInput } from '../../../server/src/schema';

interface AudioGeneratorProps {
  onAudioCreated: (audio: AudioClip) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function AudioGenerator({ onAudioCreated, isLoading, setIsLoading }: AudioGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [modelName, setModelName] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !modelName || isLoading) return;

    setIsLoading(true);
    try {
      const input: CreateAudioInput = { 
        prompt: prompt.trim(),
        modelName: modelName,
        apiKey: apiKey.trim() || undefined
      };
      const newAudio = await trpc.createAudio.mutate(input);
      onAudioCreated(newAudio);
      setPrompt('');
      setCharCount(0);
      setModelName('');
      setApiKey('');
    } catch (error) {
      console.error('Failed to create audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = prompt.trim().length > 0 && prompt.length <= 500 && modelName.length > 0;

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-white/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          Create Your Meme Audio
        </CardTitle>
        <CardDescription>
          Describe the audio you want to generate - be creative and fun! 🎨
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="prompt">Audio Description</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., A dramatic chipmunk saying 'This is fine' while everything is on fire..."
              value={prompt}
              onChange={handlePromptChange}
              rows={4}
              className="resize-none"
              disabled={isLoading}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <Badge 
                variant={charCount > 450 ? "destructive" : charCount > 400 ? "secondary" : "outline"}
                className="text-xs"
              >
                {charCount}/500 characters
              </Badge>
            </div>
          </div>

          <div>
            <Label htmlFor="model">AI Model</Label>
            <Select value={modelName} onValueChange={setModelName} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs-v1">ElevenLabs V1</SelectItem>
                <SelectItem value="elevenlabs-v2">ElevenLabs V2</SelectItem>
                <SelectItem value="google-tts">Google Text-to-Speech</SelectItem>
                <SelectItem value="azure-tts">Azure Text-to-Speech</SelectItem>
                <SelectItem value="openai-tts">OpenAI TTS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key (if required)..."
              value={apiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ API keys are handled securely but consider using backend-managed keys for production
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Audio Magic... ✨
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Audio Clip 🎵
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Pro tip:</strong> The more descriptive and funny your prompt, the better the result!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
