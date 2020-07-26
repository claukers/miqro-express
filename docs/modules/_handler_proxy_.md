[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/proxy"](_handler_proxy_.md)

# Module: "handler/proxy"

## Index

### Functions

* [ProxyHandler](_handler_proxy_.md#const-proxyhandler)
* [ProxyResponseHandler](_handler_proxy_.md#const-proxyresponsehandler)

## Functions

### `Const` ProxyHandler

▸ **ProxyHandler**(`options`: [ProxyOptionsInterface](../interfaces/_handler_common_proxyutils_.proxyoptionsinterface.md), `logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [handler/proxy.ts:12](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/proxy.ts#L12)*

Wraps an axios request and add the response to req.results

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [ProxyOptionsInterface](../interfaces/_handler_common_proxyutils_.proxyoptionsinterface.md) | IProxyOptions options for transforming requests into AxiosRequestConfig |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*

___

### `Const` ProxyResponseHandler

▸ **ProxyResponseHandler**(`logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [handler/proxy.ts:41](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/proxy.ts#L41)*

Express middleware that uses the last req.results to create a proxy response.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*
