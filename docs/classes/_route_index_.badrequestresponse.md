[miqro-express](../README.md) › [Globals](../globals.md) › ["route/index"](../modules/_route_index_.md) › [BadRequestResponse](_route_index_.badrequestresponse.md)

# Class: BadRequestResponse

## Hierarchy

* [APIResponse](_index_.apiresponse.md)

  ↳ **BadRequestResponse**

## Index

### Constructors

* [constructor](_route_index_.badrequestresponse.md#constructor)

### Properties

* [body](_route_index_.badrequestresponse.md#optional-body)
* [status](_route_index_.badrequestresponse.md#status)

### Methods

* [send](_route_index_.badrequestresponse.md#send)

## Constructors

###  constructor

\+ **new BadRequestResponse**(`message`: string): *[BadRequestResponse](_route_index_.badrequestresponse.md)*

*Overrides [APIResponse](_index_.apiresponse.md).[constructor](_index_.apiresponse.md#constructor)*

*Defined in [route/response/badrequest.ts:3](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/response/badrequest.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[BadRequestResponse](_route_index_.badrequestresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_index_.apiresponse.md).[body](_index_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_index_.apiresponse.md).[status](_index_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Inherited from [APIResponse](_index_.apiresponse.md).[send](_index_.apiresponse.md#send)*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
