[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/responses/badrequest"](../modules/_handler_responses_badrequest_.md) › [BadRequestResponse](_handler_responses_badrequest_.badrequestresponse.md)

# Class: BadRequestResponse

## Hierarchy

* [APIResponse](_handler_responses_api_.apiresponse.md)

  ↳ **BadRequestResponse**

## Index

### Constructors

* [constructor](_handler_responses_badrequest_.badrequestresponse.md#constructor)

### Properties

* [body](_handler_responses_badrequest_.badrequestresponse.md#optional-body)
* [status](_handler_responses_badrequest_.badrequestresponse.md#status)

### Methods

* [send](_handler_responses_badrequest_.badrequestresponse.md#send)

## Constructors

###  constructor

\+ **new BadRequestResponse**(`message`: string): *[BadRequestResponse](_handler_responses_badrequest_.badrequestresponse.md)*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[constructor](_handler_responses_api_.apiresponse.md#constructor)*

*Defined in [handler/responses/badrequest.ts:3](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/badrequest.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[BadRequestResponse](_handler_responses_badrequest_.badrequestresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[body](_handler_responses_api_.apiresponse.md#optional-body)*

*Defined in [handler/responses/api.ts:7](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L7)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[status](_handler_responses_api_.apiresponse.md#status)*

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *void*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[send](_handler_responses_api_.apiresponse.md#send)*

*Defined in [handler/responses/api.ts:10](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *void*
