import { todoEventBus } from '../util/event-bus';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Generic wrapper for HTTP requests (fetch)
 * @param url the endpoint to send the request to
 * @param extraConfig the configuration for the request
 */
async function request<T>(url: string, extraConfig: RequestInit = {}) {
  const config = {
    ...extraConfig,
    headers: {
      ...defaultHeaders,
      ...extraConfig.headers,
    },
  };
  try {
    const resp = await fetch(url, config);
    const data: T = await resp.json();
    return data;
  } catch (err) {
    todoEventBus.publish('error', { emitAt: new Date(), message: 'Failed send request', data: err });
    console.error(err);
    throw err;
  }
}

export const restApi = {
  get: <T>(url: string) => request<T>(url),

  post: <B extends Record<string, unknown>, T>(url: string, body: B) => request<T>(url, { method: 'POST', body: JSON.stringify(body) }),

  put: <B extends Record<string, unknown>, T>(url: string, body: B) => request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
