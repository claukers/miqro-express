import { RequestOptions } from "@miqro/core";
import { Context } from ".";

export interface ProxyServiceInterface {
  resolveRequest(ctx: Context): Promise<RequestOptions>;
}

export interface ProxyOptionsInterface {
  proxyService: ProxyServiceInterface;
}
