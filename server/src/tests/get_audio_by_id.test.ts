
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { audioClipsTable } from '../db/schema';
import { type GetAudioByIdInput } from '../schema';
import { getAudioById } from '../handlers/get_audio_by_id';

describe('getAudioById', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return audio clip when found', async () => {
    // Create test audio clip
    const insertResult = await db.insert(audioClipsTable)
      .values({
        prompt: 'Test audio prompt',
        audio_url: 'https://example.com/audio.mp3',
        duration: 30
      })
      .returning()
      .execute();

    const createdClip = insertResult[0];
    const input: GetAudioByIdInput = { id: createdClip.id };

    const result = await getAudioById(input);

    expect(result).toBeDefined();
    expect(result!.id).toEqual(createdClip.id);
    expect(result!.prompt).toEqual('Test audio prompt');
    expect(result!.audio_url).toEqual('https://example.com/audio.mp3');
    expect(result!.duration).toEqual(30);
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return null when audio clip not found', async () => {
    const input: GetAudioByIdInput = { id: 999 };

    const result = await getAudioById(input);

    expect(result).toBeNull();
  });

  it('should handle different audio clip data', async () => {
    // Create another test audio clip with different data
    const insertResult = await db.insert(audioClipsTable)
      .values({
        prompt: 'Another test prompt with longer text',
        audio_url: 'https://example.com/different-audio.wav',
        duration: 120
      })
      .returning()
      .execute();

    const createdClip = insertResult[0];
    const input: GetAudioByIdInput = { id: createdClip.id };

    const result = await getAudioById(input);

    expect(result).toBeDefined();
    expect(result!.prompt).toEqual('Another test prompt with longer text');
    expect(result!.audio_url).toEqual('https://example.com/different-audio.wav');
    expect(result!.duration).toEqual(120);
    expect(typeof result!.duration).toEqual('number');
  });
});
