
import { db } from '../db';
import { audioClipsTable } from '../db/schema';
import { type GetAudioByIdInput, type AudioClip } from '../schema';
import { eq } from 'drizzle-orm';

export const getAudioById = async (input: GetAudioByIdInput): Promise<AudioClip | null> => {
  try {
    const result = await db.select()
      .from(audioClipsTable)
      .where(eq(audioClipsTable.id, input.id))
      .execute();

    if (result.length === 0) {
      return null;
    }

    const audioClip = result[0];
    return {
      ...audioClip
    };
  } catch (error) {
    console.error('Failed to get audio clip by ID:', error);
    throw error;
  }
};
