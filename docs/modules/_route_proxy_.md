[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/proxy"](_route_proxy_.md)

# Module: "route/proxy"

## Index

### Functions

* [ProxyHandler](_route_proxy_.md#const-proxyhandler)
* [ProxyResponseHandler](_route_proxy_.md#const-proxyresponsehandler)

## Functions

### `Const` ProxyHandler

▸ **ProxyHandler**(`options`: [ProxyOptionsInterface](../interfaces/_route_common_proxyutils_.proxyoptionsinterface.md), `logger?`: Logger): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/proxy.ts:13](https://github.com/claukers/miqro-express/blob/56b5831/src/route/proxy.ts#L13)*

Wraps an axios request and add the response to req.results

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [ProxyOptionsInterface](../interfaces/_route_common_proxyutils_.proxyoptionsinterface.md) | IProxyOptions options for transforming requests into AxiosRequestConfig |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` ProxyResponseHandler

▸ **ProxyResponseHandler**(`logger?`: Logger): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/proxy.ts:42](https://github.com/claukers/miqro-express/blob/56b5831/src/route/proxy.ts#L42)*

Express middleware that uses the last req.results to create a proxy response.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
