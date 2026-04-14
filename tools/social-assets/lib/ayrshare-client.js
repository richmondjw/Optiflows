const AYRSHARE_BASE_URL = process.env.AYRSHARE_BASE_URL || 'https://api.ayrshare.com/api';

export class AyrshareClient {
  constructor({ apiKey, profileKey, baseUrl = AYRSHARE_BASE_URL, timeoutMs = 30000 } = {}) {
    this.apiKey = apiKey || process.env.AYRSHARE_API_KEY;
    this.profileKey = profileKey || process.env.AYRSHARE_PROFILE_KEY;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;

    if (!this.apiKey) {
      throw new Error('Missing AYRSHARE_API_KEY. Add it to your environment before calling Ayrshare.');
    }
  }

  async get(path) {
    return this.request(path, { method: 'GET' });
  }

  async post(path, body) {
    return this.request(path, { method: 'POST', body });
  }

  async delete(path, body) {
    return this.request(path, { method: 'DELETE', body });
  }

  async request(path, { method = 'GET', body } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await response.text();
      let payload;
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { raw: text };
      }

      if (!response.ok) {
        const detail = payload?.message || payload?.error || payload?.raw || response.statusText;
        throw new Error(`Ayrshare ${method} ${path} failed (${response.status}): ${detail}`);
      }

      return payload;
    } finally {
      clearTimeout(timeout);
    }
  }

  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    if (this.profileKey) {
      headers['Profile-Key'] = this.profileKey;
    }

    return headers;
  }
}

export function createAyrshareClient(overrides = {}) {
  return new AyrshareClient(overrides);
}
