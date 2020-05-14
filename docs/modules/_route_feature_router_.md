[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["route/feature-router"](_route_feature_router_.md)

# Module: "route/feature-router"

## Index

### Interfaces

* [FeatureRouterOptions](../interfaces/_route_feature_router_.featurerouteroptions.md)
* [FeatureRouterPathOptions](../interfaces/_route_feature_router_.featurerouterpathoptions.md)

### Type aliases

* [FeatureHandler](_route_feature_router_.md#featurehandler)

### Variables

* [FEATURE_ROUTER_METHODS](_route_feature_router_.md#const-feature_router_methods)

### Functions

* [FeatureRouter](_route_feature_router_.md#const-featurerouter)

## Type aliases

###  FeatureHandler

Ƭ **FeatureHandler**: *function*

Defined in route/feature-router.ts:6

#### Type declaration:

▸ (`logger?`: any): *[INextHandlerCallback](_route_common_handlerutils_.md#inexthandlercallback)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logger?` | any |

## Variables

### `Const` FEATURE_ROUTER_METHODS

• **FEATURE_ROUTER_METHODS**: *string[]* = ["use", "get", "post", "put", "delete", "patch", "options"]

Defined in route/feature-router.ts:24

## Functions

### `Const` FeatureRouter

▸ **FeatureRouter**(`options`: [FeatureRouterOptions](../interfaces/_route_feature_router_.featurerouteroptions.md), `logger?`: any): *Router*

Defined in route/feature-router.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`options` | [FeatureRouterOptions](../interfaces/_route_feature_router_.featurerouteroptions.md) |
`logger?` | any |

**Returns:** *Router*
