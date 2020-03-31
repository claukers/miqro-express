[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/response/api"](../modules/_route_response_api_.md) › [APIResponse](_route_response_api_.apiresponse.md)

# Class: APIResponse

## Hierarchy

* **APIResponse**

  ↳ [ServiceResponse](_route_response_service_.serviceresponse.md)

  ↳ [BadRequestResponse](_route_response_badrequest_.badrequestresponse.md)

  ↳ [NotFoundResponse](_route_response_notfound_.notfoundresponse.md)

  ↳ [ErrorResponse](_route_response_error_.errorresponse.md)

  ↳ [UnAuthorizedResponse](_route_response_unauth_.unauthorizedresponse.md)

  ↳ [ForbiddenResponse](_route_response_forbidden_.forbiddenresponse.md)

  ↳ [ProxyResponse](_route_response_proxy_.proxyresponse.md)

## Index

### Constructors

* [constructor](_route_response_api_.apiresponse.md#constructor)

### Properties

* [body](_route_response_api_.apiresponse.md#optional-body)
* [status](_route_response_api_.apiresponse.md#status)

### Methods

* [send](_route_response_api_.apiresponse.md#send)

## Constructors

###  constructor

\+ **new APIResponse**(`body?`: any): *[APIResponse](_route_response_api_.apiresponse.md)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`body?` | any |

**Returns:** *[APIResponse](_route_response_api_.apiresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
