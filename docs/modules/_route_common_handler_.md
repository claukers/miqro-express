[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/common/handler"](_route_common_handler_.md)

# Module: "route/common/handler"

## Index

### Functions

* [ErrorHandler](_route_common_handler_.md#const-errorhandler)
* [Handler](_route_common_handler_.md#const-handler)
* [NextErrorHandler](_route_common_handler_.md#const-nexterrorhandler)
* [ResponseHandler](_route_common_handler_.md#const-responsehandler)

## Functions

### `Const` ErrorHandler

▸ **ErrorHandler**(`logger?`: any): *[IErrorHandlerCallback](_route_common_handlerutils_.md#ierrorhandlercallback)*

*Defined in [route/common/handler.ts:38](https://github.com/claukers/miqro-express/blob/410db9f/src/route/common/handler.ts#L38)*

Express middleware that catches sequelize and other known errors. If the error is not **known** the next callback is called.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *[IErrorHandlerCallback](_route_common_handlerutils_.md#ierrorhandlercallback)*

___

### `Const` Handler

▸ **Handler**(`fn`: [IHandlerCallback](_route_common_handlerutils_.md#ihandlercallback), `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/common/handler.ts:63](https://github.com/claukers/miqro-express/blob/410db9f/src/route/common/handler.ts#L63)*

Wraps an async express request handler but catches the return value and appends it to req.results

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fn` | [IHandlerCallback](_route_common_handlerutils_.md#ihandlercallback) | express request handler ´async function´. |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` NextErrorHandler

▸ **NextErrorHandler**(`fn`: [INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback), `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/common/handler.ts:18](https://github.com/claukers/miqro-express/blob/410db9f/src/route/common/handler.ts#L18)*

Wraps an async express request handler that when the function throws it is correctly handled by calling the next function

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fn` | [INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback) | express request handler ´async function´. |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` ResponseHandler

▸ **ResponseHandler**(`logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/common/handler.ts:80](https://github.com/claukers/miqro-express/blob/410db9f/src/route/common/handler.ts#L80)*

Express middleware that uses req.results to create a response.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
