import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

export const createSafeAction = <TInput, TOuput>(
  schema: z.Schema<TInput>,
  handler: (validatedata: TInput) => Promise<ActionState<TInput, TOuput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOuput>> => {
    const validateResult = schema.safeParse(data);

    if (!validateResult.success)
      return {
        fieldErrors: validateResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };

    return handler(validateResult.data);
  };
};
