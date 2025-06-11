
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { audioClipsTable } from '../db/schema';
import { type CreateAudioInput } from '../schema';
import { createAudio } from '../handlers/create_audio';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateAudioInput = {
  prompt: 'Generate a soothing nature sound with birds chirping'
};

describe('createAudio', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an audio clip', async () => {
    const result = await createAudio(testInput);

    // Basic field validation
    expect(result.prompt).toEqual('Generate a soothing nature sound with birds chirping');
    expect(result.audio_url).toMatch(/^https:\/\/audio-storage\.example\.com\/clips\/\d+-[a-z0-9]+\.mp3$/);
    expect(typeof result.duration).toBe('number');
    expect(result.duration).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save audio clip to database', async () => {
    const result = await createAudio(testInput);

    // Query using proper drizzle syntax
    const audioClips = await db.select()
      .from(audioClipsTable)
      .where(eq(audioClipsTable.id, result.id))
      .execute();

    expect(audioClips).toHaveLength(1);
    expect(audioClips[0].prompt).toEqual('Generate a soothing nature sound with birds chirping');
    expect(audioClips[0].audio_url).toMatch(/^https:\/\/audio-storage\.example\.com\/clips\/\d+-[a-z0-9]+\.mp3$/);
    expect(audioClips[0].duration).toBeGreaterThan(0);
    expect(audioClips[0].created_at).toBeInstanceOf(Date);
  });

  it('should generate different URLs for different requests', async () => {
    const result1 = await createAudio(testInput);
    const result2 = await createAudio(testInput);

    expect(result1.audio_url).not.toEqual(result2.audio_url);
    expect(result1.id).not.toEqual(result2.id);
  });

  it('should handle different prompt lengths', async () => {
    const shortPrompt: CreateAudioInput = {
      prompt: 'Hi'
    };

    const longPrompt: CreateAudioInput = {
      prompt: 'This is a very long prompt that should generate a longer estimated duration for the audio clip because it contains many more characters than a short prompt'
    };

    const shortResult = await createAudio(shortPrompt);
    const longResult = await createAudio(longPrompt);

    expect(shortResult.duration).toBeGreaterThanOrEqual(5); // Minimum duration
    expect(longResult.duration).toBeGreaterThan(shortResult.duration);
    expect(shortResult.prompt).toEqual('Hi');
    expect(longResult.prompt).toEqual(longPrompt.prompt);
  });

  it('should handle maximum length prompt', async () => {
    const maxLengthPrompt: CreateAudioInput = {
      prompt: 'A'.repeat(500) // Maximum allowed length
    };

    const result = await createAudio(maxLengthPrompt);

    expect(result.prompt).toEqual(maxLengthPrompt.prompt);
    expect(result.prompt.length).toEqual(500);
    expect(result.duration).toBeGreaterThan(0);
    expect(result.audio_url).toMatch(/^https:\/\/audio-storage\.example\.com\/clips\/\d+-[a-z0-9]+\.mp3$/);
  });
});
