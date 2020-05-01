[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/response/proxy"](../modules/_route_response_proxy_.md) › [ProxyResponse](_route_response_proxy_.proxyresponse.md)

# Class: ProxyResponse

## Hierarchy

* [APIResponse](_route_response_api_.apiresponse.md)

  ↳ **ProxyResponse**

## Index

### Constructors

* [constructor](_route_response_proxy_.proxyresponse.md#constructor)

### Properties

* [body](_route_response_proxy_.proxyresponse.md#optional-body)
* [response](_route_response_proxy_.proxyresponse.md#response)
* [status](_route_response_proxy_.proxyresponse.md#status)

### Methods

* [send](_route_response_proxy_.proxyresponse.md#send)

## Constructors

###  constructor

\+ **new ProxyResponse**(`response`: AxiosResponse): *[ProxyResponse](_route_response_proxy_.proxyresponse.md)*

*Overrides [APIResponse](_route_response_api_.apiresponse.md).[constructor](_route_response_api_.apiresponse.md#constructor)*

*Defined in [route/response/proxy.ts:4](https://github.com/claukers/miqro-express/blob/ec7462e/src/route/response/proxy.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`response` | AxiosResponse |

**Returns:** *[ProxyResponse](_route_response_proxy_.proxyresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[body](_route_response_api_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/ec7462e/src/route/response/api.ts#L6)*

___

###  response

• **response**: *AxiosResponse*

*Defined in [route/response/proxy.ts:5](https://github.com/claukers/miqro-express/blob/ec7462e/src/route/response/proxy.ts#L5)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[status](_route_response_api_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/ec7462e/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: any): *Promise‹void›*

*Overrides [APIResponse](_route_response_api_.apiresponse.md).[send](_route_response_api_.apiresponse.md#send)*

*Defined in [route/response/proxy.ts:9](https://github.com/claukers/miqro-express/blob/ec7462e/src/route/response/proxy.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | any |

**Returns:** *Promise‹void›*
