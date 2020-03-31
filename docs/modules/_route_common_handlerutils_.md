[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/common/handlerutils"](_route_common_handlerutils_.md)

# Module: "route/common/handlerutils"

## Index

### Namespaces

* [__global](_route_common_handlerutils_.md#__global)

### Type aliases

* [ICallback](_route_common_handlerutils_.md#icallback)
* [IErrorHandlerCallback](_route_common_handlerutils_.md#ierrorhandlercallback)
* [IHandlerCallback](_route_common_handlerutils_.md#ihandlercallback)
* [INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)

### Functions

* [createErrorResponse](_route_common_handlerutils_.md#const-createerrorresponse)
* [createServiceResponse](_route_common_handlerutils_.md#const-createserviceresponse)
* [getResults](_route_common_handlerutils_.md#const-getresults)
* [setResults](_route_common_handlerutils_.md#const-setresults)

## Namespaces

###  __global

• **__global**:

*Defined in [route/common/handlerutils.ts:12](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L12)*

###  Express

• **Express**:

*Defined in [route/common/handlerutils.ts:13](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L13)*

###  Request

• **Request**:

*Defined in [route/common/handlerutils.ts:15](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L15)*

###  results

• **results**: *any[]*

*Defined in [route/common/handlerutils.ts:16](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L16)*

###  session

• **session**: *any*

*Defined in [route/common/handlerutils.ts:17](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L17)*

###  uuid

• **uuid**: *string*

*Defined in [route/common/handlerutils.ts:18](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L18)*

## Type aliases

###  ICallback

Ƭ **ICallback**: *function*

*Defined in [route/common/handlerutils.ts:25](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L25)*

#### Type declaration:

▸ (`req`: [Request](_route_common_handlerutils_.md#request), `res`: Response): *any*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](_route_common_handlerutils_.md#request) |
`res` | Response |

___

###  IErrorHandlerCallback

Ƭ **IErrorHandlerCallback**: *function*

*Defined in [route/common/handlerutils.ts:23](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L23)*

#### Type declaration:

▸ (`err`: Error, `req`: [Request](_route_common_handlerutils_.md#request), `res`: Response, `next`: NextFunction): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |
`req` | [Request](_route_common_handlerutils_.md#request) |
`res` | Response |
`next` | NextFunction |

___

###  IHandlerCallback

Ƭ **IHandlerCallback**: *function*

*Defined in [route/common/handlerutils.ts:24](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L24)*

#### Type declaration:

▸ (`req`: [Request](_route_common_handlerutils_.md#request), `res`: Response): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](_route_common_handlerutils_.md#request) |
`res` | Response |

___

###  INextHandlerCallback

Ƭ **INextHandlerCallback**: *function*

*Defined in [route/common/handlerutils.ts:26](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L26)*

#### Type declaration:

▸ (`req`: [Request](_route_common_handlerutils_.md#request), `res`: Response, `next`: NextFunction): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](_route_common_handlerutils_.md#request) |
`res` | Response |
`next` | NextFunction |

## Functions

### `Const` createErrorResponse

▸ **createErrorResponse**(`e`: any): *Promise‹[APIResponse](../classes/_route_response_api_.apiresponse.md)›*

*Defined in [route/common/handlerutils.ts:28](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | any |

**Returns:** *Promise‹[APIResponse](../classes/_route_response_api_.apiresponse.md)›*

___

### `Const` createServiceResponse

▸ **createServiceResponse**(`req`: [Request](_route_common_handlerutils_.md#request)): *Promise‹[ServiceResponse](../classes/_route_response_service_.serviceresponse.md)‹››*

*Defined in [route/common/handlerutils.ts:51](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](_route_common_handlerutils_.md#request) |

**Returns:** *Promise‹[ServiceResponse](../classes/_route_response_service_.serviceresponse.md)‹››*

___

### `Const` getResults

▸ **getResults**(`req`: [Request](_route_common_handlerutils_.md#request)): *any[]*

*Defined in [route/common/handlerutils.ts:66](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](_route_common_handlerutils_.md#request) |

**Returns:** *any[]*

___

### `Const` setResults

▸ **setResults**(`req`: [Request](_route_common_handlerutils_.md#request), `results`: any[]): *void*

*Defined in [route/common/handlerutils.ts:62](https://github.com/claukers/miqro-express/blob/df8c9ce/src/route/common/handlerutils.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](_route_common_handlerutils_.md#request) |
`results` | any[] |

**Returns:** *void*
