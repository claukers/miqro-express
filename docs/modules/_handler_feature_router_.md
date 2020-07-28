[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/feature-router"](_handler_feature_router_.md)

# Module: "handler/feature-router"

## Index

### Interfaces

* [FeatureRouterOptions](../interfaces/_handler_feature_router_.featurerouteroptions.md)
* [FeatureRouterPathOptions](../interfaces/_handler_feature_router_.featurerouterpathoptions.md)

### Type aliases

* [FeatureHandler](_handler_feature_router_.md#featurehandler)

### Variables

* [FEATURE_ROUTER_METHODS](_handler_feature_router_.md#const-feature_router_methods)

### Functions

* [FeatureRouter](_handler_feature_router_.md#const-featurerouter)

## Type aliases

###  FeatureHandler

Ƭ **FeatureHandler**: *function*

*Defined in [handler/feature-router.ts:6](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/feature-router.ts#L6)*

#### Type declaration:

▸ (`logger?`: any): *[NextCallback](_handler_common_index_.md#nextcallback)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logger?` | any |

## Variables

### `Const` FEATURE_ROUTER_METHODS

• **FEATURE_ROUTER_METHODS**: *string[]* = ["use", "get", "post", "put", "delete", "patch", "options"]

*Defined in [handler/feature-router.ts:24](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/feature-router.ts#L24)*

## Functions

### `Const` FeatureRouter

▸ **FeatureRouter**(`options`: [FeatureRouterOptions](../interfaces/_handler_feature_router_.featurerouteroptions.md), `logger?`: Logger): *Router*

*Defined in [handler/feature-router.ts:26](https://github.com/claukers/miqro-express/blob/8fe809c/src/handler/feature-router.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [FeatureRouterOptions](../interfaces/_handler_feature_router_.featurerouteroptions.md) |
`logger?` | Logger |

**Returns:** *Router*
