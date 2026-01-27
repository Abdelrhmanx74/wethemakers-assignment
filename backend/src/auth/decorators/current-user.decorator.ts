import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// Using a class so it can be used in decorated signatures with emitDecoratorMetadata
export class CurrentUserPayload {
  sub!: string;
  email!: string;
  role!: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as CurrentUserPayload;
  },
);
