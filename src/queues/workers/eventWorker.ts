import { CreateUserEventDto } from '@/dto/event.dto';
import { redisConnection } from '@/utils/redis';
import { handleEventJob } from '@jobs/eventJob';
import { Job, Worker } from 'bullmq';

export const eventWorker = () => {
  const worker = new Worker('event-queue', async (job: Job<CreateUserEventDto>) => await handleEventJob(job), {
    connection: redisConnection,
    concurrency: 5,
  });

  worker.on("ready", () => {
    console.log("Worker is ready");
  });

  return worker;
};
