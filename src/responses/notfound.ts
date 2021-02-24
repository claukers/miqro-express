import { APIResponse } from "./api";
export { MethodNotImplementedError as NotFoundError } from "@miqro/core";

export class NotFoundResponse extends APIResponse {
  constructor() {
    super({
      success: false,
      message: "not found"
    }, 404);
  }
}

export const NOT_FOUND = new NotFoundResponse();
