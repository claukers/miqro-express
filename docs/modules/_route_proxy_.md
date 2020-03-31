[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/proxy"](_route_proxy_.md)

# Module: "route/proxy"

## Index

### Functions

* [ProxyHandler](_route_proxy_.md#const-proxyhandler)
* [ProxyResponseHandler](_route_proxy_.md#const-proxyresponsehandler)

## Functions

### `Const` ProxyHandler

▸ **ProxyHandler**(`options`: [IProxyOptions](../interfaces/_route_common_proxyutils_.iproxyoptions.md), `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/proxy.ts:12](https://github.com/claukers/miqro-express/blob/0917369/src/route/proxy.ts#L12)*

Wraps an axios request and add the response to req.results

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [IProxyOptions](../interfaces/_route_common_proxyutils_.iproxyoptions.md) | IProxyOptions options for transforming requests into AxiosRequestConfig |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` ProxyResponseHandler

▸ **ProxyResponseHandler**(`logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/proxy.ts:40](https://github.com/claukers/miqro-express/blob/0917369/src/route/proxy.ts#L40)*

Express middleware that uses the last req.results to create a proxy response.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
