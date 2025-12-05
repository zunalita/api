import { setCors, handleOptions } from './lib/cors.js';
import { requireClientCreds } from './lib/env.js';
import { exchangeCodeForToken } from './lib/github.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  let client_id, client_secret;
  try {
    ({ client_id, client_secret } = requireClientCreds());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const access_token = await exchangeCodeForToken(code, client_id, client_secret);
    return res.status(200).json({ token: access_token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'OAuth exchange failed' });
  }
}
