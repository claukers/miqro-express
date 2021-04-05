import { TestHelper, App, request, RequestOptions, RequestResponse, ResponseError } from "@miqro/core";
import { APIRouter, APIRouterOptions } from "./handler";
import { middleware } from "./middleware";

export const APITestHelper = async (options: APIRouterOptions, request: RequestOptions, cb?: (response: RequestResponse) => void): Promise<RequestResponse | void> => {
  const app = new App();
  app.use(middleware());
  app.use(APIRouter(options));
  return TestHelper(app, request, cb);
}
