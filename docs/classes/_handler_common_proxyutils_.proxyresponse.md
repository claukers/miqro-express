[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/common/proxyutils"](../modules/_handler_common_proxyutils_.md) › [ProxyResponse](_handler_common_proxyutils_.proxyresponse.md)

# Class: ProxyResponse

## Hierarchy

* [APIResponse](_handler_responses_api_.apiresponse.md)

  ↳ **ProxyResponse**

## Index

### Constructors

* [constructor](_handler_common_proxyutils_.proxyresponse.md#constructor)

### Properties

* [body](_handler_common_proxyutils_.proxyresponse.md#optional-body)
* [response](_handler_common_proxyutils_.proxyresponse.md#response)
* [status](_handler_common_proxyutils_.proxyresponse.md#status)

### Methods

* [send](_handler_common_proxyutils_.proxyresponse.md#send)

## Constructors

###  constructor

\+ **new ProxyResponse**(`response`: [ProxyRequestResponse](../interfaces/_handler_common_proxyutils_.proxyrequestresponse.md)): *[ProxyResponse](_handler_common_proxyutils_.proxyresponse.md)*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[constructor](_handler_responses_api_.apiresponse.md#constructor)*

*Defined in [handler/common/proxyutils.ts:5](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/common/proxyutils.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`response` | [ProxyRequestResponse](../interfaces/_handler_common_proxyutils_.proxyrequestresponse.md) |

**Returns:** *[ProxyResponse](_handler_common_proxyutils_.proxyresponse.md)*

## Properties

### `Optional` body

• **body**? : *any*

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[body](_handler_responses_api_.apiresponse.md#optional-body)*

*Defined in [handler/responses/api.ts:7](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/api.ts#L7)*

___

###  response

• **response**: *[ProxyRequestResponse](../interfaces/_handler_common_proxyutils_.proxyrequestresponse.md)*

*Defined in [handler/common/proxyutils.ts:6](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/common/proxyutils.ts#L6)*

___

###  status

• **status**: *number* = 200

*Inherited from [APIResponse](_handler_responses_api_.apiresponse.md).[status](_handler_responses_api_.apiresponse.md#status)*

*Defined in [handler/responses/api.ts:4](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/responses/api.ts#L4)*

## Methods

###  send

▸ **send**(`res`: Response): *void*

*Overrides [APIResponse](_handler_responses_api_.apiresponse.md).[send](_handler_responses_api_.apiresponse.md#send)*

*Defined in [handler/common/proxyutils.ts:10](https://github.com/claukers/miqro-express/blob/e61598b/src/handler/common/proxyutils.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`res` | Response |

**Returns:** *void*
