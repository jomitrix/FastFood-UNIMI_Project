import Cookies from 'js-cookie';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
const storageKey = 'auth_token';

export const ApiService = {
  getToken() {
    return Cookies.get(storageKey) || null;
  },

  async saveToken(token) {
    return await Cookies.set(storageKey, token, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });
  },

  deleteToken() {
    Cookies.remove(storageKey, { path: '/' });
  },

  clearStorage() {
    this.deleteToken();
  },

  _buildHeaders(isJson = true, extraHeaders = {}) {
    const headers = { ...extraHeaders };
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  async post(path, { headers = {}, body = null, useAuth = true } = {}) {
    const url = `${baseUrl}${path}`;
    const opts = {
      method: 'POST',
      // credentials: 'include',
      headers: useAuth
        ? this._buildHeaders(true, headers)
        : { 'Content-Type': 'application/json', ...headers },
      body: body != null ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(url, opts);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },

  async get(path, { headers = {}, useAuth = true, params = {} } = {}) {
    const url = `${baseUrl}${path}`;

    const filteredParams = Object.fromEntries(
      Object.entries(params)
        .filter(([key, value]) => {
          if (value == null || value === "") return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        })
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const opts = {
      method: 'GET',
      headers: useAuth
        ? this._buildHeaders(false, headers)
        : { ...headers },
    };

    const res = await fetch(fullUrl, opts);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },

  async put(path, { headers = {}, body = null, useAuth = true } = {}) {
    const url = `${baseUrl}${path}`;
    const opts = {
      method: 'PUT',
      // credentials: 'include',
      headers: useAuth
        ? this._buildHeaders(true, headers)
        : { 'Content-Type': 'application/json', ...headers },
      body: body != null ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return text; }
  },

  async patch(path, { headers = {}, body = null, useAuth = true } = {}) {
    const url = `${baseUrl}${path}`;
    const opts = {
      method: 'PATCH',
      // credentials: 'include',
      headers: useAuth
        ? this._buildHeaders(true, headers)
        : { 'Content-Type': 'application/json', ...headers },
      body: body != null ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return text; }
  },

  async delete(path, { headers = {}, body = null, useAuth = true } = {}) {
    const url = `${baseUrl}${path}`;
    const opts = {
      method: 'DELETE',
      // credentials: 'include',
      headers: useAuth
        ? this._buildHeaders(
          body != null,
          headers
        )
        : { ...headers },
      body: body != null ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return text; }
  },

  async multipartPost(path, { fields = {}, files = [], filesFieldName = 'files', useAuth = true } = {}) {
    const url = `${baseUrl}${path}`;
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    files.forEach((file) => {
      if (file) formData.append(filesFieldName, file, file.name);
    });

    const headers = {};
    if (useAuth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      // credentials: 'include',
      headers,
      body: formData,
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },

  async multipartPatch(path, { fields = {}, files = [], filesFieldName = 'files', useAuth = true } = {}) {
    const url = `${baseUrl}${path}`;
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    files.forEach((file) => {
      if (file) formData.append(filesFieldName, file, file.name);
    });

    const headers = {};
    if (useAuth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'PATCH',
      // credentials: 'include',
      headers,
      body: formData,
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
};
