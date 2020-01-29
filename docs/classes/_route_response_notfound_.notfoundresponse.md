[miqro-express](../README.md) › [Globals](../globals.md) › ["route/response/notfound"](../modules/_route_response_notfound_.md) › [NotFoundResponse](_route_response_notfound_.notfoundresponse.md)

# Class: NotFoundResponse

## Hierarchy

* [APIResponse](_index_.apiresponse.md)

  ↳ **NotFoundResponse**

## Index

### Constructors

* [constructor](_route_response_notfound_.notfoundresponse.md#constructor)

### Properties

* [body](_route_response_notfound_.notfoundresponse.md#optional-body)
* [status](_route_response_notfound_.notfoundresponse.md#status)

### Methods

* [send](_route_response_notfound_.notfoundresponse.md#send)

## Constructors

###  constructor

\+ **new NotFoundResponse**(): *[NotFoundResponse](_route_response_notfound_.notfoundresponse.md)*

*Overrides [APIResponse](_index_.apiresponse.md).[constructor](_index_.apiresponse.md#constructor)*

*Defined in [route/response/notfound.ts:3](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/response/notfound.ts#L3)*

**Returns:** *[NotFoundResponse](_route_response_notfound_.notfoundresponse.md)*

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