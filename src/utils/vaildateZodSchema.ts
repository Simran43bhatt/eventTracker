import { ZodError, ZodSchema } from 'zod';

export const validate = <T>(schema: ZodSchema<T>): ((data: T) => T) => {
  return (data: T) => {
    try {
      return schema.parse(data);
    } catch (err) {
      const error = err as ZodError<T>;
      throw new Error(error.message);
    }
  };
};
