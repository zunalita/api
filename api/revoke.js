import { setCors, handleOptions } from './lib/cors.js';
import { requireClientCreds } from './lib/env.js';
import { revokeToken } from './lib/github.js';

// Revoking oauth user tokens for more security at Zunalita!
export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ error: 'missing token' });
  }

  // quick format validation
  const validPrefixes = ['ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_'];
  if (!validPrefixes.some(prefix => token.startsWith(prefix))) {
    return res.status(400).json({ error: 'invalid token format' });
  }

  let client_id, client_secret;
  try {
    ({ client_id, client_secret } = requireClientCreds());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server misconfigured' });
  }

  try {
    await revokeToken(token, client_id, client_secret);
    return res.status(200).json({ message: 'token revoked successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'token revocation failed' });
  }
}
