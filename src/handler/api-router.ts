import { basename, join, parse, resolve } from "path";
import { lstatSync, readdirSync } from "fs";
import { Router, RouterOptions } from "express";
import { getLogger, GroupPolicy, Logger, SimpleMap, Util } from "@miqro/core";
import { FeatureHandler, FeatureRouter, FeatureRouterOptions, FeatureRouterPathOptions } from "./feature-router";
import { ParseRequestHandler, ParseHandlerOptions } from "./parse";
import { NextCallback, ParseResultsHandler, ParseResultsHandlerOptions } from "./common";
import { ResponseHandler, ResponseHandlerOptions } from "./response";
import { SessionHandler, SessionHandlerOptions } from "./session";
import { GroupPolicyHandler } from "./group";
import { JSONfyResultsHandler } from "./jsonfy";
import { TagResponseUUIDHandler } from "./tag";

export interface APIHandlerArgs extends APIHandlerOptions {
  handler: FeatureHandler;
}

export interface APIHandlerOptions extends ParseHandlerOptions {
  results?: ParseResultsHandlerOptions;
  responseHandler?: NextCallback;
  responseHandlerOptions?: ResponseHandlerOptions;
  description?: string;
  session?: SessionHandlerOptions;
  authLogger?: Logger;
  policy?: GroupPolicy;
  jsonfy?: true;
  tag?: true;
}

export interface APIRoute extends APIHandlerArgs {
  name?: string;
  methods?: string[];
  path?: string | string[];
}

export const APIHandler = (options: APIHandlerArgs, logger?: Logger): NextCallback[] => {
  if (!logger) {
    logger = Util.getLogger("APIRouteHandler");
  }
  const ret: NextCallback[] = [];
  if (options.session || options.policy) {
    const authLogger = !options.authLogger ? logger : options.authLogger;
    if (options.session) {
      ret.push(SessionHandler(options.session, authLogger));
    }
    if (options.policy) {
      ret.push(GroupPolicyHandler(options.policy, authLogger));
    }
  }
  ret.push(ParseRequestHandler({
    ...options
  }));

  const realHandlers = options.handler(logger);

  if (realHandlers instanceof Array) {
    for (const h of realHandlers) {
      ret.push(h);
    }
  } else {
    ret.push(realHandlers);
  }

  const responseHandlers: NextCallback[] = [];
  if (options.results) {
    if (options.jsonfy) {
      responseHandlers.push(JSONfyResultsHandler(logger));
    }
    if (options.tag) {
      responseHandlers.push(TagResponseUUIDHandler(logger));
    }
    responseHandlers.push(ParseResultsHandler(options.results, logger));
    if (options.responseHandler) {
      responseHandlers.push(options.responseHandler);
    } else {
      responseHandlers.push(ResponseHandler(options.responseHandlerOptions, logger));
    }
  } else if (options.responseHandler) {
    if (options.jsonfy) {
      responseHandlers.push(JSONfyResultsHandler());
    }
    if (options.tag) {
      responseHandlers.push(TagResponseUUIDHandler());
    }
    responseHandlers.push(options.responseHandler);
  }
  for (const r of responseHandlers) {
    ret.push(r);
  }
  return ret;
};

export interface APIRouterOptions {
  dirname: string;
  apiName?: string;
  options?: RouterOptions;
  path?: string;
  auth?: {
    config: SessionHandlerOptions;
    identifier: string;
  };
  only?: string[];
}

export interface FeatureAPIRouterPathOptions extends FeatureRouterPathOptions {
  apiHandlerOptions: APIHandlerOptions;
}

export interface FeatureRouterWithAPIRouterOptions extends FeatureRouterOptions {
  features: SimpleMap<FeatureAPIRouterPathOptions>;
}

export const traverseAPIRouteDir = (logger: Logger, featureName: string, dirname: string, basePath = "/", features: FeatureRouterWithAPIRouterOptions = { features: {} }): FeatureRouterWithAPIRouterOptions => {
  logger.debug(`loading routes from [${dirname}]`);
  const files = readdirSync(dirname);
  const dirs = files.filter(f => lstatSync(join(dirname, f)).isDirectory());
  const methods = files.filter(f => !lstatSync(join(dirname, f)).isDirectory());
  for (const f of dirs) {
    const { name } = parse(f);
    features = traverseAPIRouteDir(logger, `${featureName}_${name}`.toUpperCase(), join(dirname, f), `${basePath}/${name}`, features);
  }
  for (const f of methods) {
    const { name, ext } = parse(f);
    if (name !== "index" && ((ext === ".ts" || ext === ".js") && name.slice(-2) !== ".d")) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let route: APIRoute = require(join(dirname, name));
      if ((route as any).default && (route as any).__esModule === true) {
        route = (route as any).default;
      }
      const methods = [name];
      if (typeof route === "function") {
        route = {
          handler: route
        };
      } else {
        if (typeof route.methods !== "undefined" && !(route.methods instanceof Array)) {
          throw new Error(`${resolve(dirname, name)} doesnt export methods as a string array`);
        } else if (typeof route.methods !== "undefined") {
          methods.splice(0, methods.length);
          for (const m of route.methods) {
            methods.push(m);
          }
        }
        if (typeof route.path !== "string" && typeof route.path !== "undefined" && !(route.path instanceof Array)) {
          throw new Error(`${resolve(dirname, name)} doesnt export path as a string or a string array`);
        }
        if (typeof route.handler !== "function" || typeof route.handler === "undefined") {
          throw new Error(`${resolve(dirname, name)} doesnt export handler as a function`);
        }
        if (typeof route.name !== "string" && typeof route.name !== "undefined") {
          throw new Error(`${resolve(dirname, name)} doesnt export name as a string`);
        }
      }
      const handler = route.handler;
      const apiHandler: FeatureHandler = (logger: Logger) => {
        return APIHandler({
          ...route,
          handler
        }, logger);
      };
      if (route.path instanceof Array) {
        for (let i = 0; i < route.path.length; i++) {
          const p = route.path[i];
          if (typeof p !== "string" || !p) {
            throw new Error(`${resolve(dirname, name)} doesnt export path as a string or a string array`);
          }
          const subName = p.replace(/[^a-z0-9+]+/gi, '_');
          const newFeatureSubPath = `${featureName}_${route.name ? route.name : name}_${subName}`.toUpperCase();
          features.features[newFeatureSubPath] = {
            apiHandlerOptions: {
              ...route
            },
            path: `${basePath}${p && p != "/" ? `${p}` : ""}`,
            methods,
            implementation: apiHandler,
            identifier: newFeatureSubPath
          };
        }
      } else {
        const newFeature = `${featureName}_${route.name ? route.name : name}`.toUpperCase();
        features.features[newFeature] = {
          apiHandlerOptions: {
            ...route
          },
          path: `${basePath}${route.path && route.path != "/" ? `${route.path}` : ""}`,
          methods,
          implementation: apiHandler,
          identifier: newFeature
        };
      }
    }
  }
  return features;
};

export const APIRouter = (options: APIRouterOptions, logger?: Logger): Router => {
  const { dirname } = options;
  const apiName = options.apiName ? options.apiName : basename(dirname);
  const apiPath = options.path ? options.path : `/${apiName}`;
  if (!logger) {
    logger = Util.getLogger(`${apiName}`.toUpperCase());
  }
  return FeatureRouter({
    ...traverseAPIRouteDir(logger, apiName.toUpperCase(), dirname, apiPath),
    options: options.options,
    only: options.only,
    auth: options.auth
  }, logger);
};
