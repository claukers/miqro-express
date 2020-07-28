[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/responses/error"](../modules/_handler_responses_error_.md) › [ErrorResponse](_handler_responses_error_.errorresponse.md)

# Class: ErrorResponse

## Hierarchy

* [APIResponse](_handler_responses_api_.apiresponse.md)

  ↳ **ErrorResponse**

## Index

### Constructors

* [constructor](_handler_responses_error_.errorresponse.md#constructor)

### Properties

* [body](_handler_responses_error_.errorresponse.md#optional-body)
* [status](_handler_responses_error_.errorresponse.md#status)

### Methods

* [send](_handler_responses_error_.errorresponse.md#send)

## Constructors

###  constructor

\+ **new ErrorResponse**(`e`: Error): *[ErrorResponse](_handler_responses_error_.errorresponse.md)*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[constructor](_handler_responses_api_.apiresponse.md#constructor)*

*Defined in [handler/responses/error.ts:3](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/error.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | Error |

**Returns:** *[ErrorResponse](_handler_responses_error_.errorresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[body](_handler_responses_api_.apiresponse.md#optional-body)*

*Defined in [handler/responses/api.ts:7](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/api.ts#L7)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[status](_handler_responses_api_.apiresponse.md#status)*

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *void*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[send](_handler_responses_api_.apiresponse.md#send)*

*Defined in [handler/responses/api.ts:10](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/api.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *void*
