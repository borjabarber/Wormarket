import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';

import type { UserProfileDto } from '../application/dto/user-profile.dto';
import { GetUserProfileUseCase } from '../application/use-cases/get-user-profile.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(ListUsersUseCase)
    private readonly listUsersUseCase: ListUsersUseCase,
    @Inject(GetUserProfileUseCase)
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Get()
  async listUsers(): Promise<UserProfileDto[]> {
    return this.listUsersUseCase.execute();
  }

  @Get(':username')
  async getUserProfile(@Param('username') username: string): Promise<UserProfileDto> {
    const user = await this.getUserProfileUseCase.execute(username);

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado.',
      });
    }

    return user;
  }
}
