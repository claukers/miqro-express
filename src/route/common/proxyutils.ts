import {APIResponse} from "@miqro/core";

export class ProxyResponse extends APIResponse {
  constructor(public response: ProxyRequestResponse) {
    super();
  }

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  public async send(res: any): Promise<void> {
    res.status(this.response.status);
    const keys = Object.keys(this.response.headers);
    for (const key of keys) {
      res.set(key, this.response.headers[key]);
    }
    res.send(this.response.data);
  }
}


export interface RequestConfig {
  url?: string;
  method?: | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';
  baseURL?: string;
  headers?: any;
  params?: any;
  data?: any;
  timeout?: number;
  timeoutErrorMessage?: string;
  responseType?: | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
    protocol?: string;
  } | false;
}

export interface ProxyRequestResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: RequestConfig;
  request?: any;
}

export interface ProxyServiceInterface {
  resolveRequest(req): Promise<RequestConfig>;
}

export interface ProxyOptionsInterface {
  proxyService: ProxyServiceInterface;
}

export const createProxyResponse = async ({results}: { results: any[] }): Promise<ProxyResponse> => {
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results[results.length - 1] : (
    results && results.length === 1 ? results[0] : null
  );
  return new ProxyResponse(response);
};
