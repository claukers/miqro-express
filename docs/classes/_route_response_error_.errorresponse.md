[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/response/error"](../modules/_route_response_error_.md) › [ErrorResponse](_route_response_error_.errorresponse.md)

# Class: ErrorResponse

## Hierarchy

* [APIResponse](_route_response_api_.apiresponse.md)

  ↳ **ErrorResponse**

## Index

### Constructors

* [constructor](_route_response_error_.errorresponse.md#constructor)

### Properties

* [body](_route_response_error_.errorresponse.md#optional-body)
* [status](_route_response_error_.errorresponse.md#status)

### Methods

* [send](_route_response_error_.errorresponse.md#send)

## Constructors

###  constructor

\+ **new ErrorResponse**(`e`: Error): *[ErrorResponse](_route_response_error_.errorresponse.md)*

*Overrides [APIResponse](_route_response_api_.apiresponse.md).[constructor](_route_response_api_.apiresponse.md#constructor)*

*Defined in [route/response/error.ts:3](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/error.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | Error |

**Returns:** *[ErrorResponse](_route_response_error_.errorresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[body](_route_response_api_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[status](_route_response_api_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[send](_route_response_api_.apiresponse.md#send)*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/0917369/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
