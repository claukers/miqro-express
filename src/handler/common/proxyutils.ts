import { Context, RequestOptions } from "@miqro/core";

export interface ProxyServiceInterface {
  resolveRequest(ctx: Context): Promise<RequestOptions>;
}

export interface ProxyOptionsInterface {
  proxyService: ProxyServiceInterface;
}
