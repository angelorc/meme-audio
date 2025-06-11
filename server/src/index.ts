
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { createAudioInputSchema, getAudioByIdInputSchema } from './schema';
import { createAudio } from './handlers/create_audio';
import { getAudioClips } from './handlers/get_audio_clips';
import { getAudioById } from './handlers/get_audio_by_id';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  createAudio: publicProcedure
    .input(createAudioInputSchema)
    .mutation(({ input }) => createAudio(input)),
  getAudioClips: publicProcedure
    .query(() => getAudioClips()),
  getAudioById: publicProcedure
    .input(getAudioByIdInputSchema)
    .query(({ input }) => getAudioById(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
