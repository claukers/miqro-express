[miqro-express](../README.md) › [Globals](../globals.md) › ["route/common/handler"](_route_common_handler_.md)

# Module: "route/common/handler"

## Index

### Functions

* [ErrorHandler](_route_common_handler_.md#const-errorhandler)
* [Handler](_route_common_handler_.md#const-handler)
* [NextErrorHandler](_route_common_handler_.md#const-nexterrorhandler)
* [ResponseHandler](_route_common_handler_.md#const-responsehandler)

## Functions

### `Const` ErrorHandler

▸ **ErrorHandler**(`logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:30](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handler.ts#L30)*

Express middleware that catches sequelize and other known errors. If the error is not **known** the next callback is called.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *(Anonymous function)*

___

### `Const` Handler

▸ **Handler**(`fn`: function, `logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:55](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handler.ts#L55)*

Wraps an async express request handler but catches the return value and appends it to req.results

**Parameters:**

▪ **fn**: *function*

express request handler ´async function´.

▸ (`req`: Request, `res`: Response): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |

▪`Optional`  **logger**: *any*

logger for logging errors ´ILogger´.

**Returns:** *(Anonymous function)*

___

### `Const` NextErrorHandler

▸ **NextErrorHandler**(`fn`: function, `logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:11](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handler.ts#L11)*

Wraps an async express request handler that when the function throws it is correctly handled by calling the next function

**Parameters:**

▪ **fn**: *function*

express request handler ´async function´.

▸ (`req`: Request, `res`: Response, `next`: NextFunction): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`next` | NextFunction |

▪`Optional`  **logger**: *any*

logger for logging errors ´ILogger´.

**Returns:** *(Anonymous function)*

___

### `Const` ResponseHandler

▸ **ResponseHandler**(`responseFactory?`: any, `logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:76](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handler.ts#L76)*

Express middleware that uses req.resutls to create a response.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`responseFactory?` | any | factory to create the response ´async function´. |
`logger?` | any | logger for logging errors ´ILogger´.  |

**Returns:** *(Anonymous function)*
