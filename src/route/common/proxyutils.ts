import {AxiosRequestConfig} from "axios";
import {ProxyResponse} from "../response/proxy";

export interface ProxyServiceInterface {
  resolveRequest(req): Promise<AxiosRequestConfig>;
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
