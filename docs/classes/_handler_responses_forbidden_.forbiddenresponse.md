[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/responses/forbidden"](../modules/_handler_responses_forbidden_.md) › [ForbiddenResponse](_handler_responses_forbidden_.forbiddenresponse.md)

# Class: ForbiddenResponse

## Hierarchy

* [APIResponse](_handler_responses_api_.apiresponse.md)

  ↳ **ForbiddenResponse**

## Index

### Constructors

* [constructor](_handler_responses_forbidden_.forbiddenresponse.md#constructor)

### Properties

* [body](_handler_responses_forbidden_.forbiddenresponse.md#optional-body)
* [status](_handler_responses_forbidden_.forbiddenresponse.md#status)

### Methods

* [send](_handler_responses_forbidden_.forbiddenresponse.md#send)

## Constructors

###  constructor

\+ **new ForbiddenResponse**(`message`: string): *[ForbiddenResponse](_handler_responses_forbidden_.forbiddenresponse.md)*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[constructor](_handler_responses_api_.apiresponse.md#constructor)*

*Defined in [handler/responses/forbidden.ts:3](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/responses/forbidden.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[ForbiddenResponse](_handler_responses_forbidden_.forbiddenresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[body](_handler_responses_api_.apiresponse.md#optional-body)*

*Defined in [handler/responses/api.ts:7](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/responses/api.ts#L7)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[status](_handler_responses_api_.apiresponse.md#status)*

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/responses/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *void*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[send](_handler_responses_api_.apiresponse.md#send)*

*Defined in [handler/responses/api.ts:10](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/responses/api.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *void*
