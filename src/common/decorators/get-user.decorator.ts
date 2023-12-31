import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
});
