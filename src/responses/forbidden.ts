import { APIResponse } from "./api";

export class ForbiddenResponse extends APIResponse {
  constructor(message: string) {
    super({
      success: false,
      message
    }, 403);
  }
}
