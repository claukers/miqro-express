[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/response/index"](../modules/_route_response_index_.md) › [APIResponse](_route_response_index_.apiresponse.md)

# Class: APIResponse

## Hierarchy

* **APIResponse**

## Index

### Constructors

* [constructor](_route_response_index_.apiresponse.md#constructor)

### Properties

* [body](_route_response_index_.apiresponse.md#optional-body)
* [status](_route_response_index_.apiresponse.md#status)

### Methods

* [send](_route_response_index_.apiresponse.md#send)

## Constructors

###  constructor

\+ **new APIResponse**(`body?`: any): *[APIResponse](_route_response_index_.apiresponse.md)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`body?` | any |

**Returns:** *[APIResponse](_route_response_index_.apiresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/b49d4d2/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
