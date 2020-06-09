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

*Defined in [route/response/proxy.ts:5](https://github.com/claukers/miqro-express/blob/56b5831/src/route/response/proxy.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`response` | AxiosResponse |

**Returns:** *[ProxyResponse](_route_response_proxy_.proxyresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[body](_route_response_api_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:7](https://github.com/claukers/miqro-express/blob/56b5831/src/route/response/api.ts#L7)*

___

###  response

• **response**: *AxiosResponse*

*Defined in [route/response/proxy.ts:6](https://github.com/claukers/miqro-express/blob/56b5831/src/route/response/proxy.ts#L6)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[status](_route_response_api_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/56b5831/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Overrides [APIResponse](_route_response_api_.apiresponse.md).[send](_route_response_api_.apiresponse.md#send)*

*Defined in [route/response/proxy.ts:10](https://github.com/claukers/miqro-express/blob/56b5831/src/route/response/proxy.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
