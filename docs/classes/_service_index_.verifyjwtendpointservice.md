[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["service/index"](../modules/_service_index_.md) › [VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)

# Class: VerifyJWTEndpointService

## Hierarchy

* **VerifyJWTEndpointService**

## Implements

* VerifyTokenService

## Index

### Constructors

* [constructor](_service_index_.verifyjwtendpointservice.md#constructor)

### Properties

* [logger](_service_index_.verifyjwtendpointservice.md#protected-logger)
* [instance](_service_index_.verifyjwtendpointservice.md#static-protected-instance)

### Methods

* [verify](_service_index_.verifyjwtendpointservice.md#verify)
* [getInstance](_service_index_.verifyjwtendpointservice.md#static-getinstance)

## Constructors

###  constructor

\+ **new VerifyJWTEndpointService**(): *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*

*Defined in [service/index.ts:16](https://github.com/claukers/miqro-express/blob/5fac12b/src/service/index.ts#L16)*

**Returns:** *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*

## Properties

### `Protected` logger

• **logger**: *Logger* = null

*Defined in [service/index.ts:16](https://github.com/claukers/miqro-express/blob/5fac12b/src/service/index.ts#L16)*

___

### `Static` `Protected` instance

▪ **instance**: *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)* = null

*Defined in [service/index.ts:8](https://github.com/claukers/miqro-express/blob/5fac12b/src/service/index.ts#L8)*

## Methods

###  verify

▸ **verify**(`__namedParameters`: object): *Promise‹Session›*

*Defined in [service/index.ts:33](https://github.com/claukers/miqro-express/blob/5fac12b/src/service/index.ts#L33)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹Session›*

___

### `Static` getInstance

▸ **getInstance**(): *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*

*Defined in [service/index.ts:10](https://github.com/claukers/miqro-express/blob/5fac12b/src/service/index.ts#L10)*

**Returns:** *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*
