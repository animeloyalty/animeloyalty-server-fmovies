import * as app from '..';
import playwright from 'playwright-core';

export class Observer {
  private readonly _responses: Array<{expression: RegExp, future: app.Future<playwright.Response>}>;

  constructor(page: playwright.Page) {
    page.on('response', this.onResponse.bind(this));
    this._responses = [];
  }

  getAsync(...expression: Array<RegExp>) {
    return expression.map((expression) => {
      const future = new app.Future<playwright.Response>(app.settings.core.chromeTimeoutNavigation);
      this._responses.push({expression, future});
      return future.getAsync();
    });
  }

  private onResponse(request: playwright.Response) {
    for (const {expression, future} of this._responses) {
      if (!expression.test(request.url())) continue;
      future.resolve(request);
    }
  }
}
