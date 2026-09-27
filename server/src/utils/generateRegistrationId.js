import crypto from 'crypto';

// Character pool excluding ambiguous characters (0, O, I, 1, L)
const CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function generateRegistrationId() {
  const bytes = crypto.randomBytes(6);
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += CHARS[bytes[i] % CHARS.length];
  }
  return `CA-${result}`;
}
