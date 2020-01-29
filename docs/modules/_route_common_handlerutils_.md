[miqro-express](../README.md) › [Globals](../globals.md) › ["route/common/handlerutils"](_route_common_handlerutils_.md)

# Module: "route/common/handlerutils"

## Index

### Functions

* [createErrorResponse](_route_common_handlerutils_.md#const-createerrorresponse)
* [createServiceResponse](_route_common_handlerutils_.md#const-createserviceresponse)
* [getResults](_route_common_handlerutils_.md#const-getresults)
* [setResults](_route_common_handlerutils_.md#const-setresults)

## Functions

### `Const` createErrorResponse

▸ **createErrorResponse**(`e`: any, `req`: Request): *Promise‹[APIResponse](../classes/_index_.apiresponse.md)›*

*Defined in [route/common/handlerutils.ts:13](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/common/handlerutils.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | any |
`req` | Request |

**Returns:** *Promise‹[APIResponse](../classes/_index_.apiresponse.md)›*

___

### `Const` createServiceResponse

▸ **createServiceResponse**(`req`: any, `res`: any): *Promise‹[ServiceResponse](../classes/_index_.serviceresponse.md)‹››*

*Defined in [route/common/handlerutils.ts:35](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/common/handlerutils.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |
`res` | any |

**Returns:** *Promise‹[ServiceResponse](../classes/_index_.serviceresponse.md)‹››*

___

### `Const` getResults

▸ **getResults**(`req`: any): *any[]*

*Defined in [route/common/handlerutils.ts:50](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/common/handlerutils.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |

**Returns:** *any[]*

___

### `Const` setResults

▸ **setResults**(`req`: any, `results`: any[]): *void*

*Defined in [route/common/handlerutils.ts:46](https://github.com/claukers/miqro-express/blob/4a37b0c/src/route/common/handlerutils.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |
`results` | any[] |

**Returns:** *void*
