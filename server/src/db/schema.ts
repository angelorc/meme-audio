
import { serial, text, pgTable, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const audioClipsTable = pgTable('audio_clips', {
  id: serial('id').primaryKey(),
  prompt: text('prompt').notNull(),
  audio_url: text('audio_url').notNull(),
  duration: integer('duration').notNull(), // Duration in seconds
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type AudioClip = typeof audioClipsTable.$inferSelect; // For SELECT operations
export type NewAudioClip = typeof audioClipsTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { audioClips: audioClipsTable };
