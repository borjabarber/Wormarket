import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY, type UserRepository } from '../../domain/repositories/user.repository';
import type { UserProfileDto } from '../dto/user-profile.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class ListUsersUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserProfileDto[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => UserMapper.toProfileDto(user));
  }
}
