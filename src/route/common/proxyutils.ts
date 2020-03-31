import { AxiosRequestConfig } from "axios";
import { ProxyResponse } from "../response/proxy";

export interface IProxyService {
  resolveRequest(req): Promise<AxiosRequestConfig>;
}

export interface IProxyOptions {
  proxyService: IProxyService;
}

export const createProxyResponse = async (req) => {
  const { results } = req;
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results[results.length - 1] : (
    results && results.length === 1 ? results[0] : null
  );
  return new ProxyResponse(response);
};
