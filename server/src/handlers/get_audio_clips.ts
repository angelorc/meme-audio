
import { db } from '../db';
import { audioClipsTable } from '../db/schema';
import { type AudioClip } from '../schema';
import { desc } from 'drizzle-orm';

export const getAudioClips = async (): Promise<AudioClip[]> => {
  try {
    const results = await db.select()
      .from(audioClipsTable)
      .orderBy(desc(audioClipsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Get audio clips failed:', error);
    throw error;
  }
};
