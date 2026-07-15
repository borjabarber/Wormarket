import { Inject, Injectable } from '@nestjs/common';

import {
  MODERATION_REPOSITORY,
  type ModerationRepository,
} from '../../domain/repositories/moderation.repository';
import { ModerationError } from '../errors/moderation-error';

export type BlockUserResultDto = {
  username: string;
  status: 'BLOCKED';
};

@Injectable()
export class BlockUserUseCase {
  constructor(
    @Inject(MODERATION_REPOSITORY) private readonly moderationRepository: ModerationRepository,
  ) {}

  async execute(username: string): Promise<BlockUserResultDto> {
    const blocked = await this.moderationRepository.blockUser(username);

    if (!blocked) {
      throw new ModerationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    return {
      username,
      status: 'BLOCKED',
    };
  }
}
