import {
  CreateAnonymousUserEventDtoSchema,
  CreateUserEventDto,
  CreateUserEventDtoSchemaWithPhone,
  CreateUserEventDtoSchemaWithUserId,
} from '@/dto/event.dto';
import { eventService } from '@/services/index.service';
import { logger } from '@/utils/logger';
import { Job } from 'bullmq';

export const handleEventJob = async (job: Job<CreateUserEventDto>) => {
  try {
    console.log(job.data);
    const JobWithPhone = CreateUserEventDtoSchemaWithPhone.safeParse(job.data);
    const JobWithUserId = CreateUserEventDtoSchemaWithUserId.safeParse(job.data);
    const JobWithAnonymous = CreateAnonymousUserEventDtoSchema.safeParse(job.data);

    
    if (JobWithPhone.success) {
      const response = await eventService.createEventWithPhone(JobWithPhone.data);
      return response;
    }

    if (JobWithUserId.success) {
      const response = await eventService.createEventWithUserId(JobWithUserId.data);
      return response;
    }

    if (JobWithAnonymous.success) {
      const response = await eventService.createEventWithAnonymous(JobWithAnonymous.data);
      return response;
    }

    throw new Error('Invalid data');
  } catch (error) {
    console.log(error);
    throw error;
  }
};
