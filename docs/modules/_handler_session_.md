[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/session"](_handler_session_.md)

# Module: "handler/session"

## Index

### Functions

* [GroupPolicyHandler](_handler_session_.md#const-grouppolicyhandler)
* [SessionHandler](_handler_session_.md#const-sessionhandler)

## Functions

### `Const` GroupPolicyHandler

▸ **GroupPolicyHandler**(`options`: GroupPolicyOptions, `logger?`: Logger): *[AsyncNextCallback](_handler_common_index_.md#asyncnextcallback)‹void›*

*Defined in [handler/session.ts:70](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/session.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | GroupPolicyOptions |
`logger?` | Logger |

**Returns:** *[AsyncNextCallback](_handler_common_index_.md#asyncnextcallback)‹void›*

___

### `Const` SessionHandler

▸ **SessionHandler**(`authService`: VerifyTokenService, `logger?`: Logger): *[AsyncNextCallback](_handler_common_index_.md#asyncnextcallback)‹void›*

*Defined in [handler/session.ts:13](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/session.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`authService` | VerifyTokenService |
`logger?` | Logger |

**Returns:** *[AsyncNextCallback](_handler_common_index_.md#asyncnextcallback)‹void›*
