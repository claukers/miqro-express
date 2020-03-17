[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/response/badrequest"](../modules/_route_response_badrequest_.md) › [BadRequestResponse](_route_response_badrequest_.badrequestresponse.md)

# Class: BadRequestResponse

## Hierarchy

* [APIResponse](_route_response_api_.apiresponse.md)

  ↳ **BadRequestResponse**

## Index

### Constructors

* [constructor](_route_response_badrequest_.badrequestresponse.md#constructor)

### Properties

* [body](_route_response_badrequest_.badrequestresponse.md#optional-body)
* [status](_route_response_badrequest_.badrequestresponse.md#status)

### Methods

* [send](_route_response_badrequest_.badrequestresponse.md#send)

## Constructors

###  constructor

\+ **new BadRequestResponse**(`message`: string): *[BadRequestResponse](_route_response_badrequest_.badrequestresponse.md)*

*Overrides [APIResponse](_route_response_api_.apiresponse.md).[constructor](_route_response_api_.apiresponse.md#constructor)*

*Defined in [route/response/badrequest.ts:3](https://github.com/claukers/miqro-express/blob/7e34ed5/src/route/response/badrequest.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[BadRequestResponse](_route_response_badrequest_.badrequestresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[body](_route_response_api_.apiresponse.md#optional-body)*

*Defined in [route/response/api.ts:5](https://github.com/claukers/miqro-express/blob/7e34ed5/src/route/response/api.ts#L5)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[status](_route_response_api_.apiresponse.md#status)*

*Defined in [route/response/api.ts:4](https://github.com/claukers/miqro-express/blob/7e34ed5/src/route/response/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *Promise‹void›*

*Inherited from [APIResponse](_route_response_api_.apiresponse.md).[send](_route_response_api_.apiresponse.md#send)*

*Defined in [route/response/api.ts:6](https://github.com/claukers/miqro-express/blob/7e34ed5/src/route/response/api.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *Promise‹void›*
