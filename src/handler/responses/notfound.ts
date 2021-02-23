import { APIResponse } from "./api";
export { MethodNotImplementedError as NotFoundError } from "@miqro/core";

export class NotFoundResponse extends APIResponse {
  constructor() {
    super({
      success: false,
      message: "not found"
    });
    this.status = 404;
  }
}
