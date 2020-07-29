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

*Defined in [service/index.ts:15](https://github.com/claukers/miqro-express/blob/70eb4a6/src/service/index.ts#L15)*

**Returns:** *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*

## Properties

### `Protected` logger

• **logger**: *Logger*

*Defined in [service/index.ts:15](https://github.com/claukers/miqro-express/blob/70eb4a6/src/service/index.ts#L15)*

___

### `Static` `Protected` instance

▪ **instance**: *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*

*Defined in [service/index.ts:7](https://github.com/claukers/miqro-express/blob/70eb4a6/src/service/index.ts#L7)*

## Methods

###  verify

▸ **verify**(`__namedParameters`: object): *Promise‹Session | null›*

*Defined in [service/index.ts:32](https://github.com/claukers/miqro-express/blob/70eb4a6/src/service/index.ts#L32)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹Session | null›*

___

### `Static` getInstance

▸ **getInstance**(): *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*

*Defined in [service/index.ts:9](https://github.com/claukers/miqro-express/blob/70eb4a6/src/service/index.ts#L9)*

**Returns:** *[VerifyJWTEndpointService](_service_index_.verifyjwtendpointservice.md)*
