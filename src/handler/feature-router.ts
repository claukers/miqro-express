import {FeatureToggle, Logger, SimpleMap, Util, VerifyTokenService} from "@miqro/core";
import {Router, RouterOptions} from "express";
import {SessionHandler} from "./session";
import {NextCallback} from "./common";

export type FeatureHandler = (logger: Logger) => NextCallback[] | NextCallback;

export interface FeatureRouterPathOptions {
  identifier: string;
  path: string;
  methods: string[];
  implementation: FeatureHandler;
}

export interface FeatureRouterOptions {
  options?: RouterOptions,
  features: SimpleMap<FeatureRouterPathOptions>;
  auth?: {
    service: VerifyTokenService;
    identifier: string;
  }; // if undefined all features in this router will be set without it;
  only?: string[]; // if undefined all features are set-up (adding some feature here doesnt by-pass the FeatureToggle.isFeatureEnabled(..) call)
}

export const FEATURE_ROUTER_METHODS = ["use", "get", "post", "put", "delete", "patch", "options"];

export const FeatureRouter = (options: FeatureRouterOptions, logger?: Logger): Router => {
  if (!logger) {
    logger = Util.getComponentLogger("FeatureRouter");
  }
  const toSetup = options.only ? options.only : Object.keys(options.features);
  const router = Router(options.options);
  if (options.auth) {
    const {service, identifier} = options.auth;
    if (!service) {
      throw new Error(`no auth service`);
    } else if (!identifier) {
      throw new Error(`no auth identifier`);
    } else {
      logger.info(`setting up session handler on features [${toSetup.join(",")}]`);
      router.use(
        SessionHandler(
          service,
          Util.getComponentLogger(identifier)
        ) as any
      );
    }
  } else {
    logger.debug(`NOT setting up session handler on features [${toSetup.join(",")}]`);
  }
  const enabled: string[] = [];
  const disabled: string[] = [];
  for (const featureName of toSetup) {
    const handlerOptions = options.features[featureName];
    if (!handlerOptions) {
      throw new Error(`no handler options for feature [${featureName}]`);
    } else {
      const {path, implementation, identifier, methods} = handlerOptions;
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
              throw new Error(`feature [${featureName}] method [${method.toLowerCase()}] not defined! use only [${FEATURE_ROUTER_METHODS.join(",")}]`);
            }
          }
        } else {
          throw new Error(`feature [${featureName}] no methods defined`);
        }
        if (FeatureToggle.isFeatureEnabled(featureName)) {
          logger.debug(`feature [${featureName}] enabled`);
          enabled.push(featureName);
          for (const method of methods) {
            logger.info(`setting up feature [${featureName}] on [${method.toLowerCase()}][${path}]`);
            (router as any)[method.toLowerCase()](path, implementation(Util.getComponentLogger(identifier)));
          }
        } else {
          logger.debug(`feature [${featureName}] disabled`);
          disabled.push(featureName);
        }
      }
    }
  }
  if (enabled.length > 0) {
    logger.info(`enabled features [${enabled.join(",")}]`);
  }
  if (disabled.length > 0) {
    logger.info(`disabled features [${disabled.join(",")}]`);
    logger.info(`to enable them just add the env var FEATURE_TOGGLE_<feature>=true`);
  }
  return router;
};
