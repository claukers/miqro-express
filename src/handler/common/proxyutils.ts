import {Request} from "express";
import {RequestOptions} from "@miqro/core";
import {ProxyResponse} from "../responses/proxy";

export interface ProxyServiceInterface {
  resolveRequest(req: Request): Promise<RequestOptions>;
}

export interface ProxyOptionsInterface {
  proxyService: ProxyServiceInterface;
}

export const createProxyResponse = ({results}: { results: any[] }): ProxyResponse | null => {
  if (!results || results.length === 0) {
    return null;
  }
  const response = results && results.length > 1 ? results[results.length - 1] : (
    results && results.length === 1 ? results[0] : null
  );
  return new ProxyResponse(response);
};
