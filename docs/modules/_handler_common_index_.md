[@miqro/handlers](../README.md) › [Globals](../globals.md) › ["handler/common/index"](_handler_common_index_.md)

# Module: "handler/common/index"

## Index

### References

* [ProxyOptionsInterface](_handler_common_index_.md#proxyoptionsinterface)
* [ProxyRequestResponse](_handler_common_index_.md#proxyrequestresponse)
* [ProxyResponse](_handler_common_index_.md#proxyresponse)
* [ProxyServiceInterface](_handler_common_index_.md#proxyserviceinterface)
* [RequestConfig](_handler_common_index_.md#requestconfig)
* [createProxyResponse](_handler_common_index_.md#createproxyresponse)

### Namespaces

* [__global](_handler_common_index_.__global.md)

### Interfaces

* [HandleAllOptionsOutput](../interfaces/_handler_common_index_.handlealloptionsoutput.md)

### Type aliases

* [AsyncCallback](_handler_common_index_.md#asynccallback)
* [AsyncNextCallback](_handler_common_index_.md#asyncnextcallback)
* [Callback](_handler_common_index_.md#callback)
* [ErrorCallback](_handler_common_index_.md#errorcallback)
* [HandleAllOptions](_handler_common_index_.md#handlealloptions)
* [NextCallback](_handler_common_index_.md#nextcallback)

### Functions

* [HandleAll](_handler_common_index_.md#const-handleall)
* [Handler](_handler_common_index_.md#const-handler)
* [getResults](_handler_common_index_.md#const-getresults)
* [setResults](_handler_common_index_.md#const-setresults)

## References

###  ProxyOptionsInterface

• **ProxyOptionsInterface**:

___

###  ProxyRequestResponse

• **ProxyRequestResponse**:

___

###  ProxyResponse

• **ProxyResponse**:

___

###  ProxyServiceInterface

• **ProxyServiceInterface**:

___

###  RequestConfig

• **RequestConfig**:

___

###  createProxyResponse

• **createProxyResponse**:

## Type aliases

###  AsyncCallback

Ƭ **AsyncCallback**: *function*

*Defined in [handler/common/index.ts:23](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L23)*

#### Type declaration:

▸ (`req`: Request, `res`: Response): *Promise‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |

___

###  AsyncNextCallback

Ƭ **AsyncNextCallback**: *function*

*Defined in [handler/common/index.ts:26](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L26)*

#### Type declaration:

▸ (`req`: Request, `res`: Response, `next`: NextFunction): *Promise‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`next` | NextFunction |

___

###  Callback

Ƭ **Callback**: *function*

*Defined in [handler/common/index.ts:22](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L22)*

#### Type declaration:

▸ (`req`: Request, `res`: Response): *T*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |

___

###  ErrorCallback

Ƭ **ErrorCallback**: *function*

*Defined in [handler/common/index.ts:20](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L20)*

#### Type declaration:

▸ (`err`: Error, `req`: Request, `res`: Response, `next`: NextFunction): *T*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |
`req` | Request |
`res` | Response |
`next` | NextFunction |

___

###  HandleAllOptions

Ƭ **HandleAllOptions**: *function*

*Defined in [handler/common/index.ts:86](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L86)*

#### Type declaration:

▸ (`req`: Request): *Promise‹[HandleAllOptionsOutput](../interfaces/_handler_common_index_.handlealloptionsoutput.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |

___

###  NextCallback

Ƭ **NextCallback**: *function*

*Defined in [handler/common/index.ts:25](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L25)*

#### Type declaration:

▸ (`req`: Request, `res`: Response, `next`: NextFunction): *T*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`next` | NextFunction |

## Functions

### `Const` HandleAll

▸ **HandleAll**(`generator`: [HandleAllOptions](_handler_common_index_.md#handlealloptions), `logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [handler/common/index.ts:88](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`generator` | [HandleAllOptions](_handler_common_index_.md#handlealloptions) |
`logger?` | Logger |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*

___

### `Const` Handler

▸ **Handler**(`fn`: [AsyncCallback](_handler_common_index_.md#asynccallback) | [Callback](_handler_common_index_.md#callback), `logger?`: Logger): *[NextCallback](_handler_common_index_.md#nextcallback)*

*Defined in [handler/common/index.ts:47](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L47)*

Wraps an async express request handler but catches the return value and appends it to req.results

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fn` | [AsyncCallback](_handler_common_index_.md#asynccallback) &#124; [Callback](_handler_common_index_.md#callback) | express request handler ´async function´. |
`logger?` | Logger | logger for logging errors ´ILogger´.  |

**Returns:** *[NextCallback](_handler_common_index_.md#nextcallback)*

___

### `Const` getResults

▸ **getResults**(`req`: Request): *any[]*

*Defined in [handler/common/index.ts:34](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |

**Returns:** *any[]*

___

### `Const` setResults

▸ **setResults**(`req`: Request, `results`: any[]): *void*

*Defined in [handler/common/index.ts:29](https://github.com/claukers/miqro-express/blob/70eb4a6/src/handler/common/index.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`results` | any[] |

**Returns:** *void*
