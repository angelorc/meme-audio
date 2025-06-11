
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { audioClipsTable } from '../db/schema';
import { getAudioClips } from '../handlers/get_audio_clips';

describe('getAudioClips', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no audio clips exist', async () => {
    const result = await getAudioClips();

    expect(result).toEqual([]);
  });

  it('should return all audio clips', async () => {
    // Create test audio clips
    await db.insert(audioClipsTable)
      .values([
        {
          prompt: 'First audio clip',
          audio_url: 'https://example.com/audio1.mp3',
          duration: 30
        },
        {
          prompt: 'Second audio clip',
          audio_url: 'https://example.com/audio2.mp3',
          duration: 45
        }
      ])
      .execute();

    const result = await getAudioClips();

    expect(result).toHaveLength(2);
    expect(result[0].prompt).toBeDefined();
    expect(result[0].audio_url).toBeDefined();
    expect(result[0].duration).toBeDefined();
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should return audio clips ordered by created_at descending', async () => {
    // Create first audio clip
    const firstClip = await db.insert(audioClipsTable)
      .values({
        prompt: 'First clip',
        audio_url: 'https://example.com/audio1.mp3',
        duration: 30
      })
      .returning()
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second audio clip
    const secondClip = await db.insert(audioClipsTable)
      .values({
        prompt: 'Second clip',
        audio_url: 'https://example.com/audio2.mp3',
        duration: 45
      })
      .returning()
      .execute();

    const result = await getAudioClips();

    expect(result).toHaveLength(2);
    // Most recent first (second clip created later)
    expect(result[0].prompt).toEqual('Second clip');
    expect(result[1].prompt).toEqual('First clip');
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should return audio clips with correct field types', async () => {
    await db.insert(audioClipsTable)
      .values({
        prompt: 'Test audio clip',
        audio_url: 'https://example.com/audio.mp3',
        duration: 60
      })
      .execute();

    const result = await getAudioClips();

    expect(result).toHaveLength(1);
    expect(typeof result[0].id).toBe('number');
    expect(typeof result[0].prompt).toBe('string');
    expect(typeof result[0].audio_url).toBe('string');
    expect(typeof result[0].duration).toBe('number');
    expect(result[0].created_at).toBeInstanceOf(Date);
  });
});
