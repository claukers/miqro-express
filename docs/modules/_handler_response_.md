[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/response"](_handler_response_.md)

# Module: "handler/response"

## Index

### Functions

* [ErrorHandler](_handler_response_.md#const-errorhandler)
* [ResponseHandler](_handler_response_.md#const-responsehandler)
* [createErrorResponse](_handler_response_.md#const-createerrorresponse)
* [createServiceResponse](_handler_response_.md#const-createserviceresponse)

## Functions

### `Const` ErrorHandler

▸ **ErrorHandler**(`logger?`: Logger): *[ErrorCallback](_handler_common_index_.md#errorcallback)‹void›*

*Defined in [handler/response.ts:81](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/response.ts#L81)*

Express middleware that catches sequelize and other known errors. If the error is not **known** the next callback is called.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[ErrorCallback](_handler_common_index_.md#errorcallback)‹void›*

___

### `Const` ResponseHandler

▸ **ResponseHandler**(`logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)‹void›*

*Defined in [handler/response.ts:55](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/response.ts#L55)*

Express middleware that uses req.results to create a response.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)‹void›*

___

### `Const` createErrorResponse

▸ **createErrorResponse**(`e`: Error): *[APIResponse](../classes/_handler_responses_api_.apiresponse.md) | null*

*Defined in [handler/response.ts:15](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/response.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | Error |

**Returns:** *[APIResponse](../classes/_handler_responses_api_.apiresponse.md) | null*

___

### `Const` createServiceResponse

▸ **createServiceResponse**(`req`: Request): *[ServiceResponse](../classes/_handler_responses_service_.serviceresponse.md) | null*

*Defined in [handler/response.ts:39](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/response.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |

**Returns:** *[ServiceResponse](../classes/_handler_responses_service_.serviceresponse.md) | null*
