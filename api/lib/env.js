export function requireClientCreds() {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    const err = new Error('Server misconfigured: missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
    err.code = 'MISSING_GITHUB_CREDS';
    throw err;
  }

  return { client_id, client_secret };
}
