import { APIResponse } from "./api";
import { TextResponse } from "./text";

export class HtmlResponse extends TextResponse {
  constructor(html: string) {
    super(html, 200, {
      ['Content-Type']: 'plain/html'
    });
  }
}
