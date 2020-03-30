[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/session"](_route_session_.md)

# Module: "route/session"

## Index

### Functions

* [GroupPolicyHandler](_route_session_.md#const-grouppolicyhandler)
* [SessionHandler](_route_session_.md#const-sessionhandler)

## Functions

### `Const` GroupPolicyHandler

▸ **GroupPolicyHandler**(`options`: IGroupPolicyOptions, `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:48](https://github.com/claukers/miqro-express/blob/b08eced/src/route/session.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | IGroupPolicyOptions |
`logger?` | any |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

___

### `Const` SessionHandler

▸ **SessionHandler**(`authService`: IVerifyTokenService, `logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*

*Defined in [route/session.ts:13](https://github.com/claukers/miqro-express/blob/b08eced/src/route/session.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`authService` | IVerifyTokenService |
`logger?` | any |

**Returns:** *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)*
