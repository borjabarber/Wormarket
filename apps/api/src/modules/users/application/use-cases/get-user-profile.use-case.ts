import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY, type UserRepository } from '../../domain/repositories/user.repository';
import type { UserProfileDto } from '../dto/user-profile.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class GetUserProfileUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async execute(username: string): Promise<UserProfileDto | null> {
    const user = await this.userRepository.findByUsername(username);

    return user ? UserMapper.toProfileDto(user) : null;
  }
}
