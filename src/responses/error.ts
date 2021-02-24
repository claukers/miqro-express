import { APIResponse } from "./api";

export class ErrorResponse extends APIResponse {
  constructor(e: Error | string) {
    super({
      success: false,
      message: typeof e === "string" ? e : e.message
    }, 503);
  }
}
