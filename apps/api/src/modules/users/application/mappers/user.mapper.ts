import type { User } from '../../domain/entities/user';
import type { UserProfileDto } from '../dto/user-profile.dto';

export class UserMapper {
  static toProfileDto(user: User): UserProfileDto {
    return {
      id: user.id.toString(),
      username: user.username.toString(),
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      homeDimension: user.homeDimension,
      reputation: user.reputation,
      role: user.role,
      status: user.status,
    };
  }
}
