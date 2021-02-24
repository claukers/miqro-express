import { APIResponse } from "./api";

export class RedirectResponse extends APIResponse {
  constructor(url: string) {
    super({
      success: true,
      message: "content moved"
    }, 302, {
      ["location"]: url
    });
  }
}
