[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/responses/service"](../modules/_handler_responses_service_.md) › [ServiceResponse](_handler_responses_service_.serviceresponse.md)

# Class: ServiceResponse

## Hierarchy

* [APIResponse](_handler_responses_api_.apiresponse.md)

  ↳ **ServiceResponse**

## Index

### Constructors

* [constructor](_handler_responses_service_.serviceresponse.md#constructor)

### Properties

* [body](_handler_responses_service_.serviceresponse.md#optional-body)
* [status](_handler_responses_service_.serviceresponse.md#status)

### Methods

* [send](_handler_responses_service_.serviceresponse.md#send)

## Constructors

###  constructor

\+ **new ServiceResponse**(`result`: any): *[ServiceResponse](_handler_responses_service_.serviceresponse.md)*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[constructor](_handler_responses_api_.apiresponse.md#constructor)*

*Defined in [handler/responses/service.ts:3](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/responses/service.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`result` | any |

**Returns:** *[ServiceResponse](_handler_responses_service_.serviceresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[body](_handler_responses_api_.apiresponse.md#optional-body)*

*Defined in [handler/responses/api.ts:7](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/responses/api.ts#L7)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[status](_handler_responses_api_.apiresponse.md#status)*

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/responses/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *void*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[send](_handler_responses_api_.apiresponse.md#send)*

*Defined in [handler/responses/api.ts:10](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/responses/api.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *void*
