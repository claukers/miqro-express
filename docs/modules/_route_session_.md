[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/session"](_route_session_.md)

# Module: "route/session"

## Index

### Functions

* [GroupPolicyHandler](_route_session_.md#const-grouppolicyhandler)
* [SessionHandler](_route_session_.md#const-sessionhandler)

## Functions

### `Const` GroupPolicyHandler

▸ **GroupPolicyHandler**(`options`: GroupPolicyOptionsInterface, `logger?`: Logger): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:72](https://github.com/claukers/miqro-express/blob/56b5831/src/route/session.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | GroupPolicyOptionsInterface |
`logger?` | Logger |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` SessionHandler

▸ **SessionHandler**(`authService?`: VerifyTokenServiceInterface, `logger?`: Logger): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:15](https://github.com/claukers/miqro-express/blob/56b5831/src/route/session.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`authService?` | VerifyTokenServiceInterface |
`logger?` | Logger |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
