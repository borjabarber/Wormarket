import type { IdentityAccount } from '../../domain/entities/identity-account';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import type { TokenService } from '../ports/token-service';

export function createAuthResponse(
  account: IdentityAccount,
  tokenService: TokenService,
): AuthResponseDto {
  return {
    accessToken: tokenService.issueAccessToken(account.user),
    refreshToken: tokenService.issueRefreshToken(account.user),
    user: account.user,
  };
}
