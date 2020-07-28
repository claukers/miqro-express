[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["middleware/index"](_middleware_index_.md)

# Module: "middleware/index"

## Index

### Functions

* [BodyParserHandler](_middleware_index_.md#const-bodyparserhandler)
* [MorganHandler](_middleware_index_.md#const-morganhandler)
* [UUIDHandler](_middleware_index_.md#const-uuidhandler)
* [setupMiddleware](_middleware_index_.md#const-setupmiddleware)

## Functions

### `Const` BodyParserHandler

▸ **BodyParserHandler**(`logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [middleware/index.ts:41](https://github.com/claukers/miqro-express/blob/8fe809c/src/middleware/index.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`logger?` | Logger |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*

___

### `Const` MorganHandler

▸ **MorganHandler**(`logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [middleware/index.ts:16](https://github.com/claukers/miqro-express/blob/8fe809c/src/middleware/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`logger?` | Logger |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*

___

### `Const` UUIDHandler

▸ **UUIDHandler**(): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [middleware/index.ts:9](https://github.com/claukers/miqro-express/blob/8fe809c/src/middleware/index.ts#L9)*

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*

___

### `Const` setupMiddleware

▸ **setupMiddleware**(`app`: Express, `logger?`: Logger): *void*

*Defined in [middleware/index.ts:57](https://github.com/claukers/miqro-express/blob/8fe809c/src/middleware/index.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`app` | Express |
`logger?` | Logger |

**Returns:** *void*
