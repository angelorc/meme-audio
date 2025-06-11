
import { z } from 'zod';

// Audio clip schema
export const audioClipSchema = z.object({
  id: z.number(),
  prompt: z.string(),
  audio_url: z.string(),
  duration: z.number(), // Duration in seconds
  created_at: z.coerce.date()
});

export type AudioClip = z.infer<typeof audioClipSchema>;

// Input schema for creating audio clips
export const createAudioInputSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").max(500, "Prompt must be 500 characters or less"),
  modelName: z.string().min(1, "Model name cannot be empty"),
  apiKey: z.string().optional()
});

export type CreateAudioInput = z.infer<typeof createAudioInputSchema>;

// Schema for getting audio clip by ID
export const getAudioByIdInputSchema = z.object({
  id: z.number().int().positive()
});

export type GetAudioByIdInput = z.infer<typeof getAudioByIdInputSchema>;
