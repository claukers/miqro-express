[miqro-express](../README.md) › [Globals](../globals.md) › ["route/response/unauth"](../modules/_route_response_unauth_.md) › [UnAuthorizedResponse](_route_response_unauth_.unauthorizedresponse.md)

# Class: UnAuthorizedResponse

## Hierarchy

* [APIResponse](_route_response_api_.apiresponse.md)

  ↳ **UnAuthorizedResponse**

## Index

### Constructors

* [constructor](_route_response_unauth_.unauthorizedresponse.md#constructor)

### Properties

* [body](_route_response_unauth_.unauthorizedresponse.md#optional-body)
* [status](_route_response_unauth_.unauthorizedresponse.md#status)

### Methods

* [send](_route_response_unauth_.unauthorizedresponse.md#send)

## Constructors

###  constructor

\+ **new UnAuthorizedResponse**(`message`: string): *[UnAuthorizedResponse](_route_response_unauth_.unauthorizedresponse.md)*

*Overrides [APIResponse](_route_response_api_.apiresponse.md).[constructor](_route_response_api_.apiresponse.md#constructor)*

*Defined in [route/response/unauth.ts:3](https://github.com/claukers/miqro-express/blob/3953b02/src/route/response/unauth.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[UnAuthorizedResponse](_route_response_unauth_.unauthorizedresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[body](_route_response_api_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/3953b02/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[status](_route_response_api_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/3953b02/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[send](_route_response_api_.apiresponse.md#send)*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/3953b02/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
