async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, body: JSON.parse(text) };
  } catch (e) {
    return { ok: res.ok, status: res.status, body: text };
  }
}

export async function exchangeCodeForToken(code, client_id, client_secret) {
  const { ok, status, body } = await fetchJson("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ client_id, client_secret, code }),
  });

  if (!ok) {
    throw new Error(`GitHub token exchange failed: ${status} ${JSON.stringify(body)}`);
  }

  if (body && body.error) {
    throw new Error(body.error_description || body.error);
  }

  return body && body.access_token;
}

export async function revokeToken(token, client_id, client_secret) {
  const { ok, status, body } = await fetchJson(
    `https://api.github.com/applications/${client_id}/token`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
      },
      body: JSON.stringify({ access_token: token }),
    }
  );

  if (!ok) {
    throw new Error(`GitHub token revocation failed: ${status} ${JSON.stringify(body)}`);
  }

  return true;
}
