import { Service } from 'types/index';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface IQuery {
  [key: string]: any;
}

export interface IPrice {
  name: string;
  price: number;
}

export interface IProps {
  route: string;
  query?: IQuery;
  body?: any;
  apiVersion?: string;
  service?: Service;
  refreshTime?: number;
}

const buildUrlQuery = (query: IQuery): string =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

export const getHost = (
  route: string,
  query: IQuery | undefined,
  service: Service | undefined,
  apiVersion: string | undefined,
): string => {
  const hostService = {
    [Service.PROXY]:
      process.env.DEFAULT_API_HOST || 'https://api.mainnet.klever.finance',
    [Service.NODE]:
      process.env.DEFAULT_NODE_HOST || 'https://node.mainnet.klever.finance',
  };

  let host = hostService[service || 0];
  let port = process.env.DEFAULT_API_PORT || '';
  let urlParam = '';

  if (host.substr(host.length - 1) === '/') {
    host = host.substring(0, host.length - 1);
  }

  if (service === Service.PROXY) {
    if (port) {
      port = `:${port}`;
    }

    host = `${host}${port}/${apiVersion}`;
  }

  if (query) {
    urlParam = `?${buildUrlQuery(query)}`;
  }

  return `${host}/${route}${urlParam}`;
};

export const getProps = (props: IProps): IProps => {
  const defaultValues: IProps = {
    route: '/',
    service: Service.PROXY,
    apiVersion: process.env.DEFAULT_API_VERSION || 'v1.0',
    refreshTime: 60,
  };

  const get = (target: any, name: string) => {
    if (name in target) {
      return target[name];
    }

    if (name in defaultValues) {
      return defaultValues[name];
    }

    return undefined;
  };

  const handler = { get };

  return new Proxy(props, handler);
};

export const withoutBody = async (
  props: IProps,
  method: Method,
): Promise<any> => {
  try {
    const { route, query, service, apiVersion } = getProps(props);

    const response = await fetch(getHost(route, query, service, apiVersion), {
      method: method.toString(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return Promise.resolve({
        data: null,
        error: (await response.json()).error,
        code: 'internal_error',
      });
    }

    return response.json();
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error' });
  }
};

export const withBody = async (props: IProps, method: Method): Promise<any> => {
  try {
    const { route, body, query, service, apiVersion } = getProps(props);
    const response = await fetch(getHost(route, query, service, apiVersion), {
      method: method.toString(),
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return Promise.resolve({
        data: null,
        error: (await response.json()).error,
        code: 'internal_error',
      });
    }

    return response.json();
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error' });
  }
};

export const withText = async (props: IProps, method: Method): Promise<any> => {
  try {
    const { route, query, service, apiVersion } = getProps(props);

    const response = await fetch(getHost(route, query, service, apiVersion), {
      method: method.toString(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return Promise.resolve({
        data: null,
        error: (await response.json()).error,
        code: 'internal_error',
      });
    }

    return response.text();
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error' });
  }
};

export const withTimeout = async (
  promise: Promise<any>,
  timeout = 10000,
): Promise<any> => {
  return Promise.race([
    promise,
    new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: null, error: 'Fetch timeout', code: 'internal_error' });
      }, timeout);
    }),
  ]);
};

const api = {
  get: async (props: IProps): Promise<any> =>
    withTimeout(withoutBody(props, Method.GET)),
  post: async (props: IProps): Promise<any> =>
    withTimeout(withBody(props, Method.POST)),
  text: async (props: IProps): Promise<any> =>
    withTimeout(withText(props, Method.GET)),
};

export default api;
