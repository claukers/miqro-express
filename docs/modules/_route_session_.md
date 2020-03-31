[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/session"](_route_session_.md)

# Module: "route/session"

## Index

### Functions

* [GroupPolicyHandler](_route_session_.md#const-grouppolicyhandler)
* [SessionHandler](_route_session_.md#const-sessionhandler)

## Functions

### `Const` GroupPolicyHandler

▸ **GroupPolicyHandler**(`options`: IGroupPolicyOptions, `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:52](https://github.com/claukers/miqro-express/blob/ae7e18a/src/route/session.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | IGroupPolicyOptions |
`logger?` | any |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` SessionHandler

▸ **SessionHandler**(`authService?`: IVerifyTokenService, `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:14](https://github.com/claukers/miqro-express/blob/ae7e18a/src/route/session.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`authService?` | IVerifyTokenService |
`logger?` | any |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
