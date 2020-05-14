[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/session"](_route_session_.md)

# Module: "route/session"

## Index

### Functions

* [GroupPolicyHandler](_route_session_.md#const-grouppolicyhandler)
* [SessionHandler](_route_session_.md#const-sessionhandler)

## Functions

### `Const` GroupPolicyHandler

▸ **GroupPolicyHandler**(`options`: GroupPolicyOptionsInterface, `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:71](https://github.com/claukers/miqro-express/blob/410db9f/src/route/session.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | GroupPolicyOptionsInterface |
`logger?` | any |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` SessionHandler

▸ **SessionHandler**(`authService?`: VerifyTokenServiceInterface, `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:14](https://github.com/claukers/miqro-express/blob/410db9f/src/route/session.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`authService?` | VerifyTokenServiceInterface |
`logger?` | any |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
