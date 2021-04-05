import { basename, join, parse, resolve } from "path";
import { lstatSync, readdirSync } from "fs";
import { Router, Method, getLogger, Logger, SimpleMap } from "@miqro/core";
import { FeatureHandler, FeatureRouter, FeatureRouterOptions, FeatureRouterPathOptions } from "./feature-router";
import { APIHandler, APIHandlerArgs, APIHandlerOptions } from "./api-handler";

export interface APIRoute extends APIHandlerArgs {
  name?: string;
  methods?: Method[];
  path?: string | string[];
}

export interface APIRouterOptions {
  dirname: string;
  apiName?: string;
  path?: string;
}

export interface FeatureAPIRouterPathOptions extends FeatureRouterPathOptions {
  apiHandlerOptions: APIHandlerOptions;
}

export interface FeatureRouterWithAPIRouterOptions extends FeatureRouterOptions {
  features: SimpleMap<FeatureAPIRouterPathOptions>;
}

export const traverseAPIRouteDir = (logger: Logger, featureName: string, dirname: string, basePath = "/", features: FeatureRouterWithAPIRouterOptions = { features: {} }): FeatureRouterWithAPIRouterOptions => {
  try {
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
        let methods: Method[] = [name] as Method[];
        if (typeof route === "function") {
          route = {
            handler: route
          } as any;
        } else {
          if (typeof route.methods !== "undefined" && !(route.methods instanceof Array)) {
            throw new Error(`${resolve(dirname, name)} doesnt export methods as a string array`);
          } else if (typeof route.methods !== "undefined") {
            methods = [];
            for (const m of route.methods) {
              methods.push(m);
            }
          }
          if (typeof route.path !== "string" && typeof route.path !== "undefined" && !(route.path instanceof Array)) {
            throw new Error(`${resolve(dirname, name)} doesnt export path as a string or a string array`);
          }
          if ((!(route.handler instanceof Array) && typeof route.handler !== "function") || typeof route.handler === "undefined") {
            throw new Error(`${resolve(dirname, name)} doesnt export handler as a function or an array`);
          }
          if (typeof route.name !== "string" && typeof route.name !== "undefined") {
            throw new Error(`${resolve(dirname, name)} doesnt export name as a string`);
          }
        }
        const realHandler = route.handler;

        if (route.path instanceof Array) {
          for (let i = 0; i < route.path.length; i++) {
            const p = route.path[i];
            if (typeof p !== "string" || !p) {
              throw new Error(`${resolve(dirname, name)} doesnt export path as a string or a string array`);
            }
            const subName = p.replace(/[^a-z0-9+]+/gi, '_');
            const newFeatureSubPath = `${featureName}_${route.name ? route.name : name}_${subName}`.toUpperCase();
            const identifier = newFeatureSubPath;
            const apiHandler = APIHandler({
              identifier,
              ...route,
              handler: realHandler
            });
            features.features[newFeatureSubPath] = {
              apiHandlerOptions: {
                ...route
              },
              path: `${basePath}${p && p != "/" ? `${p}` : ""}`,
              methods,
              handler: apiHandler,
              identifier
            };
          }
        } else {
          const newFeature = `${featureName}_${route.name ? route.name : name}`.toUpperCase();
          const identifier = newFeature;
          const apiHandler: FeatureHandler = APIHandler({
            identifier,
            ...route,
            handler: realHandler
          });
          features.features[newFeature] = {
            apiHandlerOptions: {
              ...route
            },
            path: `${basePath}${route.path && route.path != "/" ? `${route.path}` : ""}`,
            methods,
            handler: apiHandler,
            identifier
          };
        }
      }
    }
    return features;
  } catch (e) {
    throw e;
  }
};

export const APIRouter = (options: APIRouterOptions, logger?: Logger): Router => {
  const { dirname } = options;
  const apiName = options.apiName ? options.apiName : basename(dirname);
  const apiPath = options.path ? options.path : `/${apiName}`;
  if (!logger) {
    logger = getLogger(`${apiName}`.toUpperCase());
  }
  return FeatureRouter({
    ...traverseAPIRouteDir(logger, apiName.toUpperCase(), dirname, apiPath)
  }, logger);
};
