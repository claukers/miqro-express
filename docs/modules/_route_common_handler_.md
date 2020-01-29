[miqro-express](../README.md) › [Globals](../globals.md) › ["route/common/handler"](_route_common_handler_.md)

# External module: "route/common/handler"

## Index

### Functions

* [ErrorHandler](_route_common_handler_.md#const-errorhandler)
* [Handler](_route_common_handler_.md#const-handler)
* [NextErrorHandler](_route_common_handler_.md#const-nexterrorhandler)
* [ResponseHandler](_route_common_handler_.md#const-responsehandler)

## Functions

### `Const` ErrorHandler

▸ **ErrorHandler**(`logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:18](https://github.com/claukers/miqro-express/blob/3953b02/src/route/common/handler.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`logger?` | any |

**Returns:** *(Anonymous function)*

___

### `Const` Handler

▸ **Handler**(`fn`: function, `logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:37](https://github.com/claukers/miqro-express/blob/3953b02/src/route/common/handler.ts#L37)*

**Parameters:**

▪ **fn**: *function*

▸ (`req`: Request, `res`: Response): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |

▪`Optional`  **logger**: *any*

**Returns:** *(Anonymous function)*

___

### `Const` NextErrorHandler

▸ **NextErrorHandler**(`fn`: function, `logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:5](https://github.com/claukers/miqro-express/blob/3953b02/src/route/common/handler.ts#L5)*

**Parameters:**

▪ **fn**: *function*

▸ (`req`: Request, `res`: Response, `next`: NextFunction): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`next` | NextFunction |

▪`Optional`  **logger**: *any*

**Returns:** *(Anonymous function)*

___

### `Const` ResponseHandler

▸ **ResponseHandler**(`responseFactory?`: any, `logger?`: any): *(Anonymous function)*

*Defined in [route/common/handler.ts:52](https://github.com/claukers/miqro-express/blob/3953b02/src/route/common/handler.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`responseFactory?` | any |
`logger?` | any |

**Returns:** *(Anonymous function)*
