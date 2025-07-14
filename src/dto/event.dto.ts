import { z } from 'zod';

enum AppName {
  WEBSITE = 'website',
}

export const CreateUserEventDtoSchemaWithUserId = z.object({
  userId: z.string().min(16, 'UserId is required and should be at least 2 characters long'),
  eventName: z.string().min(1, 'Event name is required'),
  appName: z.nativeEnum(AppName),
  metaData: z.record(z.string(), z.any()).nullable(),
});

export const CreateUserEventDtoSchemaWithPhone = z.object({
  phone: z.string().min(10, 'Phone number is required and should be at least 10 characters long'),
  eventName: z.string().min(1, 'Event name is required'),
  appName: z.nativeEnum(AppName),
  metaData: z.record(z.string(), z.any()).nullable(),
});

export const CreateAnonymousUserEventDtoSchema = z.object({
  eventGeneratedId: z.string().min(16, 'eventGeneratedId is required and should be 16 characters long').nullish(),
  eventName: z.string().min(1, 'Event name is required'),
  appName: z.nativeEnum(AppName),
  metaData: z.record(z.string(), z.any()).nullable(),
});

export const UpdateUserEventDtoSchema = z.object({
  id: z.string(),
  userId: z.string().nullish(),
  eventGeneratedId: z.string().nullish(),
  eventName: z.string().min(1, 'Event name is required').optional(),
  appName: z.nativeEnum(AppName).optional(),
  metaData: z.record(z.string(), z.any()).nullable().optional(),
});

export const UserEventResponseDtoSchema = z.object({
  id: z.string(),
  userId: z.string().nullish(),
  eventGeneratedId: z.string().nullish(),
  eventName: z.string(),
  appName: z.nativeEnum(AppName),
  metaData: z.record(z.string(), z.any()).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LoginUserEventDtoWithUserIdSchema = z.object({
  appName: z.nativeEnum(AppName),
  metaData: z.record(z.string(), z.any()).nullable(),
  eventGeneratedId: z.string().min(16, 'eventGeneratedId is required and should be 16 characters long').nullish(),
  userId: z.string().min(16, 'UserId is required and should be at least 2 characters long'),
});

export const LoginUserEventDtoPhoneSchema = z.object({
  appName: z.nativeEnum(AppName),
  metaData: z.record(z.string(), z.any()).nullable(),
  eventGeneratedId: z.string().min(16, 'eventGeneratedId is required and should be 16 characters long').nullish(),
  name: z.string().min(1, 'Name is required and should be at least 1 characters long'),
  phone: z.string().min(10, 'Phone number is required and should be at least 10 characters long'),
  email: z.string().email('Invalid email address').nullish(),
});

export const LoginUserEventDtoSchema = z.union([LoginUserEventDtoWithUserIdSchema, LoginUserEventDtoPhoneSchema]);
export const CreateUserEventDtoSchema = z.union([
  CreateUserEventDtoSchemaWithUserId,
  CreateUserEventDtoSchemaWithPhone,
  CreateAnonymousUserEventDtoSchema,
]);

export type CreateUserEventDto = z.infer<typeof CreateUserEventDtoSchema>;
export type UpdateUserEventDto = z.infer<typeof UpdateUserEventDtoSchema>;
export type UserEventResponseDto = z.infer<typeof UserEventResponseDtoSchema>;
export type CreateUserEventDtoWithUserId = z.infer<typeof CreateUserEventDtoSchemaWithUserId>;
export type CreateUserEventDtoWithPhone = z.infer<typeof CreateUserEventDtoSchemaWithPhone>;
export type CreateAnonymousUserEventDto = z.infer<typeof CreateAnonymousUserEventDtoSchema>;
export type LoginUserEventDto = z.infer<typeof LoginUserEventDtoSchema>;
export type LoginUserEventDtoWithUserId = z.infer<typeof LoginUserEventDtoWithUserIdSchema>;
export type LoginUserEventDtoWithPhone = z.infer<typeof LoginUserEventDtoPhoneSchema>;
