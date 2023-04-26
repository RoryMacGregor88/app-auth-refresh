// const apiURL = process.env.REACT_APP_API_URL;
const apiURL = 'http://localhost/api';

export const client = async <T = unknown>(
  endpoint: string,
  { data = {}, token = '', headers: customHeaders = {}, ...customConfig } = {},
): Promise<T> => {
  // const headers: HeadersInit = {
  //   Authorization: token ? `Bearer ${token}` : undefined,
  //   'Content-Type': data ? 'application/json' : undefined,
  //   ...customHeaders,
  // };

  // const headers = new Headers(customHeaders);
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...headers,
      ...customHeaders,
    },
    // headers: {
    //   Authorization: token ? `Bearer ${token}` : undefined,
    //   'Content-Type': data ? 'application/json' : undefined,
    //   ...customHeaders,
    // },
    ...customConfig,
  };

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      // queryCache.clear();
      // await auth.logout();
      // // refresh the page for them
      // window.location.assign(window.location);
      return Promise.reject({ message: 'Please re-authenticate.' });
    }
    const data = await response.json();

    return response.ok ? data : Promise.reject(data);
  });
};

// import { fetch } from 'cross-fetch';

// import { JSON_CONTENT_TYPE, METHODS } from '~/api/client.utils';

// const API_URL = process.env.VITE_API_URL;

// // From https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
// const makeRequest = async (url: string, options: Record<string, unknown>) => {
//   const response = await fetch(`${API_URL}/${url}`, options);
//   return handleResponse(response);
// };

// const get = async <T>(url: string, options?: Record<string, unknown>): Promise<T> => {
//   const requestOptions = {
//     method: METHODS.GET,
//     ...options,
//   };

//   return makeRequest(`${API_URL}/${url}`, requestOptions);
// };

// const post = async <T, B>(url: string, body: T, options?: Record<string, unknown>): Promise<B> => {
//   const requestOptions = {
//     method: METHODS.POST,
//     headers: { 'Content-Type': JSON_CONTENT_TYPE },
//     body: JSON.stringify(body),
//     ...options,
//   };

//   return makeRequest(`${API_URL}/${url}`, requestOptions);
// };

// const put = async <T, B>(url: string, body: T, options?: Record<string, unknown>): Promise<B> => {
//   const requestOptions = {
//     method: METHODS.PUT,
//     headers: { 'Content-Type': JSON_CONTENT_TYPE },
//     body: JSON.stringify(body),
//     ...options,
//   };

//   return makeRequest(`${API_URL}/${url}`, requestOptions);
// };

// // prefixed with underscored because delete is a reserved word in javascript
// const _delete = async (url: string, options?: Record<string, unknown>) => {
//   const requestOptions = {
//     method: METHODS.DELETE,
//     ...options,
//   };

//   return makeRequest(`${API_URL}/${url}`, requestOptions);
// };

// // helper functions
// const handleResponse = async (response: Response) => {
//   const text = await response.text();
//   const data = text && JSON.parse(text);
//   if (!response.ok) {
//     const error = (data && data.message) || response.statusText;
//     return Promise.reject(error);
//   }

//   return data;
// };

// export const api = {
//   get,
//   post,
//   put,
//   delete: _delete,
// };

// // from https://dev.to/avxkim/my-fetch-wrapper-with-async-await-and-typescript-1158

// export const apiClient = async <T, B>(
//   url: string,
//   method = METHODS.GET,
//   body: B | undefined = undefined,
//   headers = {},
// ): Promise<T | { error: string }> => {
//   const controller = new AbortController();
//   try {
//     const res = await fetch(`${API_URL}/${url}`, {
//       method: method.toUpperCase(),
//       signal: controller.signal,
//       body: typeof body === 'object' ? JSON.stringify(body) : undefined,
//       mode: 'cors',
//       headers: {
//         'Content-type': 'application/json',
//         ...headers,
//       },
//     });
//     // const data = await res.json();
//     if (!res.ok) {
//       const error = await res.json();
//       return { error: error.code };
//       // return Promise.reject(data``);
//     }
//     return await res.json();
//     // return data;
//   } catch (error) {
//     return { error };
//     // if (error instanceof Error) {
//     //   return Promise.reject({ error: error.code });
//     // }
//   } finally {
//     controller.abort();
//   }
// };
// // KENT DODDS - from JavaScript

// interface PROPS {
//   data?: Record<string, unknown>;
//   token?: string;
//   headers?: Record<string, string>;
//   options?: Record<string, unknown>;
// }

// export const client = async <T>(
//   url: string,
//   { data, token, headers: customHeaders, ...options }: PROPS = {},
// ): Promise<T> => {
//   const config: RequestInit = {
//     method: data ? METHODS.POST : METHODS.GET,
//     body: data ? JSON.stringify(data) : undefined,
//     headers: {
//       Authorization: token ? `Bearer ${token}` : '',
//       'Content-Type': JSON_CONTENT_TYPE,
//       ...customHeaders,
//     },
//     ...options,
//   };

//   const response = await fetch(`${API_URL}/${url}`, config);
//   const responseData = await response.json();

//   return response.ok ? responseData : Promise.reject(responseData);
//   // return response.ok ? responseData : Promise.reject(new Error(responseData));
// };
