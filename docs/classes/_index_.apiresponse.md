[miqro-express](../README.md) › [Globals](../globals.md) › ["index"](../modules/_index_.md) › [APIResponse](_index_.apiresponse.md)

# Class: APIResponse

## Hierarchy

* **APIResponse**

  ↳ [ServiceResponse](_index_.serviceresponse.md)

  ↳ [BadRequestResponse](_index_.badrequestresponse.md)

  ↳ [NotFoundResponse](_index_.notfoundresponse.md)

  ↳ [ErrorResponse](_index_.errorresponse.md)

  ↳ [UnAuthorizedResponse](_index_.unauthorizedresponse.md)

  ↳ [ForbiddenResponse](_index_.forbiddenresponse.md)

  ↳ [ServiceResponse](_route_index_.serviceresponse.md)

  ↳ [BadRequestResponse](_route_index_.badrequestresponse.md)

  ↳ [NotFoundResponse](_route_index_.notfoundresponse.md)

  ↳ [ErrorResponse](_route_index_.errorresponse.md)

  ↳ [UnAuthorizedResponse](_route_index_.unauthorizedresponse.md)

  ↳ [ForbiddenResponse](_route_index_.forbiddenresponse.md)

  ↳ [BadRequestResponse](_route_response_badrequest_.badrequestresponse.md)

  ↳ [ErrorResponse](_route_response_error_.errorresponse.md)

  ↳ [ForbiddenResponse](_route_response_forbidden_.forbiddenresponse.md)

  ↳ [ServiceResponse](_route_response_index_.serviceresponse.md)

  ↳ [BadRequestResponse](_route_response_index_.badrequestresponse.md)

  ↳ [NotFoundResponse](_route_response_index_.notfoundresponse.md)

  ↳ [ErrorResponse](_route_response_index_.errorresponse.md)

  ↳ [UnAuthorizedResponse](_route_response_index_.unauthorizedresponse.md)

  ↳ [ForbiddenResponse](_route_response_index_.forbiddenresponse.md)

  ↳ [NotFoundResponse](_route_response_notfound_.notfoundresponse.md)

  ↳ [ServiceResponse](_route_response_service_.serviceresponse.md)

  ↳ [UnAuthorizedResponse](_route_response_unauth_.unauthorizedresponse.md)

## Index

### Constructors

* [constructor](_index_.apiresponse.md#constructor)

### Properties

* [body](_index_.apiresponse.md#optional-body)
* [status](_index_.apiresponse.md#status)

### Methods

* [send](_index_.apiresponse.md#send)

## Constructors

###  constructor

\+ **new APIResponse**(`body?`: any): *[APIResponse](_index_.apiresponse.md)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/47304ab/src/route/response/api.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`body?` | any |

**Returns:** *[APIResponse](_index_.apiresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/47304ab/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/47304ab/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/47304ab/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
