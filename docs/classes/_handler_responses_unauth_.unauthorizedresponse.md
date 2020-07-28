[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/responses/unauth"](../modules/_handler_responses_unauth_.md) › [UnAuthorizedResponse](_handler_responses_unauth_.unauthorizedresponse.md)

# Class: UnAuthorizedResponse

## Hierarchy

* [APIResponse](_handler_responses_api_.apiresponse.md)

  ↳ **UnAuthorizedResponse**

## Index

### Constructors

* [constructor](_handler_responses_unauth_.unauthorizedresponse.md#constructor)

### Properties

* [body](_handler_responses_unauth_.unauthorizedresponse.md#optional-body)
* [status](_handler_responses_unauth_.unauthorizedresponse.md#status)

### Methods

* [send](_handler_responses_unauth_.unauthorizedresponse.md#send)

## Constructors

###  constructor

\+ **new UnAuthorizedResponse**(`message`: string): *[UnAuthorizedResponse](_handler_responses_unauth_.unauthorizedresponse.md)*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[constructor](_handler_responses_api_.apiresponse.md#constructor)*

*Defined in [handler/responses/unauth.ts:3](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/unauth.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[UnAuthorizedResponse](_handler_responses_unauth_.unauthorizedresponse.md)*

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
