import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const googleClient = new OAuth2Client();

const appleJwks = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
  cache: true,
  rateLimit: true,
});

export interface VerifiedOAuthUser {
  oauthId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

// 1. Verify Google ID Token
export async function verifyGoogleToken(idToken: string): Promise<VerifiedOAuthUser> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: [
      process.env.GOOGLE_CLIENT_ID_WEB || '',
      process.env.GOOGLE_CLIENT_ID_IOS || '',
      process.env.GOOGLE_CLIENT_ID_ANDROID || '',
    ].filter(Boolean),
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google token payload');
  }

  return {
    oauthId: payload.sub,
    email: payload.email,
    fullName: payload.name || payload.given_name || 'Aura Member',
    avatarUrl: payload.picture,
  };
}

// 2. Verify Apple Identity Token
export async function verifyAppleToken(
  identityToken: string,
  userMetadata?: { name?: { firstName?: string; lastName?: string } }
): Promise<VerifiedOAuthUser> {
  const decodedHeader = jwt.decode(identityToken, { complete: true });
  if (!decodedHeader || !decodedHeader.header.kid) {
    throw new Error('Malformed Apple identity token');
  }

  const key = await appleJwks.getSigningKey(decodedHeader.header.kid);
  const publicKey = key.getPublicKey();

  const payload = jwt.verify(identityToken, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://appleid.apple.com',
    audience: process.env.APPLE_BUNDLE_ID,
  }) as { sub: string; email?: string };

  const fullName = userMetadata?.name
    ? [userMetadata.name.firstName, userMetadata.name.lastName].filter(Boolean).join(' ')
    : undefined;

  return {
    oauthId: payload.sub,
    email: payload.email || `${payload.sub}@privaterelay.appleid.com`,
    fullName: fullName || 'Aura Member',
  };
}

// 3. Issue Aura App Session Token
export function signSessionJwt(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
}