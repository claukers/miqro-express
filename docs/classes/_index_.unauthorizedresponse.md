[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["index"](../modules/_index_.md) › [UnAuthorizedResponse](_index_.unauthorizedresponse.md)

# Class: UnAuthorizedResponse

## Hierarchy

* [APIResponse](_index_.apiresponse.md)

  ↳ **UnAuthorizedResponse**

## Index

### Constructors

* [constructor](_index_.unauthorizedresponse.md#constructor)

### Properties

* [body](_index_.unauthorizedresponse.md#optional-body)
* [status](_index_.unauthorizedresponse.md#status)

### Methods

* [send](_index_.unauthorizedresponse.md#send)

## Constructors

###  constructor

\+ **new UnAuthorizedResponse**(`message`: string): *[UnAuthorizedResponse](_index_.unauthorizedresponse.md)*

*Overrides [APIResponse](_index_.apiresponse.md).[constructor](_index_.apiresponse.md#constructor)*

*Defined in [route/response/unauth.ts:3](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/unauth.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[UnAuthorizedResponse](_index_.unauthorizedresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_index_.apiresponse.md).[body](_index_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_index_.apiresponse.md).[status](_index_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Inherited from [APIResponse](_index_.apiresponse.md).[send](_index_.apiresponse.md#send)*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
