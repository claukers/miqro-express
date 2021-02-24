import { getLogger, isFeatureEnabled, Logger, SimpleMap } from "@miqro/core";
import { Handler, AppHandler } from "./common";

export type FeatureHandler = Array<Handler> | Handler;

export interface FeatureRouterPathOptions {
  identifier: string;
  path: string;
  methods: string[];
  implementation: FeatureHandler;
}

export interface FeatureRouterOptions {
  features: SimpleMap<FeatureRouterPathOptions>;
}

export const FEATURE_ROUTER_METHODS = ["use", "get", "post", "put", "delete", "patch", "options"];

export const FeatureRouter = (options: FeatureRouterOptions, logger?: Logger): Array<AppHandler> => {
  if (!logger) {
    logger = getLogger("FeatureRouter");
  }
  const ret: Array<AppHandler> = [];
  const toSetup = Object.keys(options.features);
  const enabled: string[] = [];
  const disabled: string[] = [];
  for (const featureName of toSetup) {
    const handlerOptions = options.features[featureName];
    if (!handlerOptions) {
      throw new Error(`no handler options for feature [${featureName}]`);
    } else {
      const { path, implementation, identifier, methods } = handlerOptions;
      if (!methods) {
        throw new Error(`no methods for feature [${featureName}]`);
      } else if (!identifier) {
        throw new Error(`no identifier for feature [${featureName}]`);
      } else if (!implementation) {
        throw new Error(`no implementation for feature [${featureName}]`);
      } else if (!path) {
        throw new Error(`no path for feature [${featureName}]`);
      } else {
        if (methods.length > 0) {
          for (const method of methods) {
            if (FEATURE_ROUTER_METHODS.indexOf(method.toLowerCase()) === -1) {
              throw new Error(`feature [${featureName}] method [${method.toUpperCase()}] not defined! use only [${FEATURE_ROUTER_METHODS.join(",")}]`);
            }
          }
        } else {
          throw new Error(`feature [${featureName}] no methods defined`);
        }
        if (isFeatureEnabled(featureName)) {
          logger.debug(`feature [${featureName}] enabled`);
          enabled.push(featureName);
          for (const method of methods) {
            logger.info(`[${featureName}] on [${method.toUpperCase()}:${path}]`);
            ret.push({
              method: method.toLocaleLowerCase(),
              pathname: path,
              handler: implementation
            });
          }
        } else {
          logger.debug(`feature [${featureName}] disabled`);
          disabled.push(featureName);
        }
      }
    }
  }
  if (enabled.length > 0) {
    logger.debug(`enabled features [${enabled.join(",")}]`);
  }
  if (disabled.length > 0) {
    logger.warn(`disabled features [${disabled.join(",")}]`);
    logger.warn(`to enable them just add the env var <feature>=true`);
  } else {
    logger.debug(`no features disabled`);
  }
  return ret;
};
