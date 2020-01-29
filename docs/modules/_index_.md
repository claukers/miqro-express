[miqro-express](../README.md) › [Globals](../globals.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Classes

* [APIResponse](../classes/_index_.apiresponse.md)
* [BadRequestResponse](../classes/_index_.badrequestresponse.md)
* [ErrorResponse](../classes/_index_.errorresponse.md)
* [ForbiddenResponse](../classes/_index_.forbiddenresponse.md)
* [NotFoundResponse](../classes/_index_.notfoundresponse.md)
* [ServiceResponse](../classes/_index_.serviceresponse.md)
* [UnAuthorizedResponse](../classes/_index_.unauthorizedresponse.md)

### Functions

* [ErrorHandler](_index_.md#const-errorhandler)
* [GroupPolicyHandler](_index_.md#const-grouppolicyhandler)
* [Handler](_index_.md#const-handler)
* [NextErrorHandler](_index_.md#const-nexterrorhandler)
* [ResponseHandler](_index_.md#const-responsehandler)
* [SessionHandler](_index_.md#const-sessionhandler)
* [createErrorResponse](_index_.md#const-createerrorresponse)
* [createServiceResponse](_index_.md#const-createserviceresponse)
* [getResults](_index_.md#const-getresults)
* [setResults](_index_.md#const-setresults)
* [setupMiddleware](_index_.md#const-setupmiddleware)

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

### `Const` GroupPolicyHandler

▸ **GroupPolicyHandler**(`options`: IGroupPolicyOptions, `logger?`: any): *(Anonymous function)*

*Defined in [route/session.ts:50](https://github.com/claukers/miqro-express/blob/47304ab/src/route/session.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | IGroupPolicyOptions |
`logger?` | any |

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

___

### `Const` SessionHandler

▸ **SessionHandler**(`authService`: IVerifyTokenService, `logger?`: any): *(Anonymous function)*

*Defined in [route/session.ts:13](https://github.com/claukers/miqro-express/blob/47304ab/src/route/session.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`authService` | IVerifyTokenService |
`logger?` | any |

**Returns:** *(Anonymous function)*

___

### `Const` createErrorResponse

▸ **createErrorResponse**(`e`: any, `req`: Request): *Promise‹[APIResponse](../classes/_index_.apiresponse.md)›*

*Defined in [route/common/handlerutils.ts:13](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handlerutils.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | any |
`req` | Request |

**Returns:** *Promise‹[APIResponse](../classes/_index_.apiresponse.md)›*

___

### `Const` createServiceResponse

▸ **createServiceResponse**(`req`: any, `res`: any): *Promise‹[ServiceResponse](../classes/_index_.serviceresponse.md)‹››*

*Defined in [route/common/handlerutils.ts:35](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handlerutils.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |
`res` | any |

**Returns:** *Promise‹[ServiceResponse](../classes/_index_.serviceresponse.md)‹››*

___

### `Const` getResults

▸ **getResults**(`req`: any): *any[]*

*Defined in [route/common/handlerutils.ts:50](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handlerutils.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |

**Returns:** *any[]*

___

### `Const` setResults

▸ **setResults**(`req`: any, `results`: any[]): *void*

*Defined in [route/common/handlerutils.ts:46](https://github.com/claukers/miqro-express/blob/47304ab/src/route/common/handlerutils.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |
`results` | any[] |

**Returns:** *void*

___

### `Const` setupMiddleware

▸ **setupMiddleware**(`app`: any, `logger?`: any): *Promise‹any›*

*Defined in [middleware/index.ts:10](https://github.com/claukers/miqro-express/blob/47304ab/src/middleware/index.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`app` | any |
`logger?` | any |

**Returns:** *Promise‹any›*
