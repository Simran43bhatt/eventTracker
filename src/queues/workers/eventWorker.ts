import { CreateUserEventDto } from '@/dto/event.dto';
import { redisConnection } from '@/utils/redis';
import { handleEventJob } from '@jobs/eventJob';
import { Job, Worker } from 'bullmq';

export const eventWorker = () =>
  new Worker('event-queue', async (job: Job<CreateUserEventDto>) => await handleEventJob(job), {
    connection: redisConnection,
    concurrency: 5,
  });
