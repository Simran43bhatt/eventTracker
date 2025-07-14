import {
  CreateAnonymousUserEventDtoSchema,
  CreateUserEventDto,
  CreateUserEventDtoSchemaWithPhone,
  CreateUserEventDtoSchemaWithUserId,
} from '@/dto/event.dto';
import { logger } from '@/utils/logger';
import { Job } from 'bullmq';

export const handleEventJob = async (job: Job<CreateUserEventDto>) => {
  try {
    const JobWithPhone = CreateUserEventDtoSchemaWithPhone.safeParse(job.data);
    const JobWithUserId = CreateUserEventDtoSchemaWithUserId.safeParse(job.data);
    const JobWithAnonymous = CreateAnonymousUserEventDtoSchema.safeParse(job.data);

    throw new Error('Invalid data');
  } catch (error) {
    logger.error('Failed to process event job:', {
      eventName: job.data.eventName,
      error: error,
    });
    throw error;
  }
};
