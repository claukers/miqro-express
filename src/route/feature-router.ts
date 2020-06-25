import {FeatureToggle, Logger, SimpleMapInterface, Util, VerifyTokenServiceInterface} from "@miqro/core";
import {Router} from "express";
import {INextHandlerCallback} from "./common";
import {SessionHandler} from "./session";

export type FeatureHandler = (logger?: any) => INextHandlerCallback[];

export interface FeatureRouterPathOptions {
  identifier: string;
  path: string;
  methods: string[];
  implementation: FeatureHandler;
}

export interface FeatureRouterOptions {
  features: SimpleMapInterface<FeatureRouterPathOptions>;
  auth?: {
    service: VerifyTokenServiceInterface;
    identifier: string;
  }; // if undefined all features in this router will be set without it;
  only?: string[]; // if undefined all features are set-up (adding some feature here doesnt by-pass the FeatureToggle.isFeatureEnabled(..) call)
}

const FEATURE_ROUTER_METHODS = ["use", "get", "post", "put", "delete", "patch", "options"];

export const FeatureRouter = (options: FeatureRouterOptions, logger?: Logger): Router => {
  if (!logger) {
    logger = Util.getComponentLogger("FeatureRouter");
  }
  const toSetup = options.only ? options.only : Object.keys(options.features);
  const router = Router();
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
    logger.warn(`NOT setting up session handler on features [${toSetup.join(",")}]`);
  }
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
        if (FeatureToggle.isFeatureEnabled(featureName)) {
          logger.debug(`feature [${featureName}] enabled`);
          if (methods.length > 0) {
            for (const method of methods) {
              if (FEATURE_ROUTER_METHODS.indexOf(method) === -1) {
                throw new Error(`feature [${featureName}] method [${method}] not defined! use only [${FEATURE_ROUTER_METHODS.join(",")}]`);
              }
              logger.info(`setting up [${featureName}] on [${method}][${path}]`);
              router[method](path, implementation(Util.getComponentLogger(identifier)));
            }
          } else {
            throw new Error(`feature [${featureName}] no methods defined`);
          }
        } else {
          logger.warn(`feature [${featureName}] disabled`);
        }
      }
    }
  }
  return router;
};
