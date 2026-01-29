import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
} from "react-hook-form";
import { z } from "zod";

export function useZodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues>,
  props?: Omit<UseFormProps<TFieldValues>, "resolver"> & {
    defaultValues?: DefaultValues<TFieldValues>;
  },
) {
  return useForm<TFieldValues>({
    mode: "onTouched",
    ...props,
    resolver: zodResolver(schema as any) as any,
  });
}

export function digitsOnly(value: string) {
  return value.replace(/\D+/g, "");
}

export function trimOrEmpty(value: string | undefined | null) {
  return (value ?? "").trim();
}

export function getFirstErrorMessage(
  error: { message?: unknown } | FieldValues | undefined | null,
): string | undefined {
  const message = (error as any)?.message;
  return typeof message === "string" ? message : undefined;
}
