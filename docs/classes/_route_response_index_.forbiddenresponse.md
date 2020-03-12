[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/response/index"](../modules/_route_response_index_.md) › [ForbiddenResponse](_route_response_index_.forbiddenresponse.md)

# Class: ForbiddenResponse

## Hierarchy

* [APIResponse](_index_.apiresponse.md)

  ↳ **ForbiddenResponse**

## Index

### Constructors

* [constructor](_route_response_index_.forbiddenresponse.md#constructor)

### Properties

* [body](_route_response_index_.forbiddenresponse.md#optional-body)
* [status](_route_response_index_.forbiddenresponse.md#status)

### Methods

* [send](_route_response_index_.forbiddenresponse.md#send)

## Constructors

###  constructor

\+ **new ForbiddenResponse**(`message`: string): *[ForbiddenResponse](_route_response_index_.forbiddenresponse.md)*

*Overrides [APIResponse](_index_.apiresponse.md).[constructor](_index_.apiresponse.md#constructor)*

*Defined in [route/response/forbidden.ts:3](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/forbidden.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[ForbiddenResponse](_route_response_index_.forbiddenresponse.md)*

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
