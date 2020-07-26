[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/responses/api"](../modules/_handler_responses_api_.md) › [APIResponse](_handler_responses_api_.apiresponse.md)

# Class: APIResponse

## Hierarchy

* **APIResponse**

  ↳ [ServiceResponse](_handler_responses_service_.serviceresponse.md)

  ↳ [BadRequestResponse](_handler_responses_badrequest_.badrequestresponse.md)

  ↳ [NotFoundResponse](_handler_responses_notfound_.notfoundresponse.md)

  ↳ [ErrorResponse](_handler_responses_error_.errorresponse.md)

  ↳ [UnAuthorizedResponse](_handler_responses_unauth_.unauthorizedresponse.md)

  ↳ [ForbiddenResponse](_handler_responses_forbidden_.forbiddenresponse.md)

  ↳ [ProxyResponse](_handler_common_proxyutils_.proxyresponse.md)

## Index

### Constructors

* [constructor](_handler_responses_api_.apiresponse.md#constructor)

### Properties

* [body](_handler_responses_api_.apiresponse.md#optional-body)
* [status](_handler_responses_api_.apiresponse.md#status)

### Methods

* [send](_handler_responses_api_.apiresponse.md#send)

## Constructors

###  constructor

\+ **new APIResponse**(`body?`: any): *[APIResponse](_handler_responses_api_.apiresponse.md)*

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`body?` | any |

**Returns:** *[APIResponse](_handler_responses_api_.apiresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Defined in [handler/responses/api.ts:7](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L7)*

___

###  status

• **status**: *number* = 200

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *void*

*Defined in [handler/responses/api.ts:10](https://github.com/claukers/miqro-express/blob/5fac12b/src/handler/responses/api.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *void*
