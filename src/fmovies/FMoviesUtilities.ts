import * as app from '..';
import * as captcha from '2captcha';
import {evaluateCaptchaAsync, solveCaptcha} from './evaluators/captcha';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import playwright from 'playwright-core';

export class FMoviesUtilities {
  private static captchaPromise?: Promise<void>;

  static mapLanguage(label: string) {
    if (label === 'Arabic') return 'ar-ME';
    if (label === 'French') return 'fr-FR';
    if (label === 'German') return 'de-DE';
    if (label === 'Italian') return 'it-IT';
    if (label === 'English') return 'en-US';
    if (label === 'Portuguese') return 'pt-BR';
    if (label === 'Russian') return 'ru-RU';
    if (label === 'Spanish') return 'es-ES';
    if (label === 'Turkish') return 'tr-TR';
    return;
  }

  static async tryCaptchaAsync(logger: app.LoggerService, page: playwright.Page) {
    const question = await page.evaluate(evaluateCaptchaAsync);
    if (this.captchaPromise) {
      logger.debug(`2captcha PARALLEL on ${page.url()}`);
      await this.captchaPromise;
      logger.debug(`2captcha RETRYING on ${page.url()}`);
      await page.reload();
      await this.tryCaptchaAsync(logger, page);
    } else if (question) try {
      logger.debug(`2captcha CHECKING ${question.key} on ${question.url}`);
      this.captchaPromise = this.solveAsync(page, question.key, question.url);
      await this.captchaPromise;
      logger.debug(`2captcha FINISHED ${question.key} on ${question.url}`);
    } finally {
      delete this.captchaPromise;
    }
  }

  private static async solveAsync(page: playwright.Page, key: string, url: string) {
    const solver = new captcha.Solver(await readKeyAsync());
    const solution = await solver.recaptcha(key, url);
    const navigationPromise = page.waitForNavigation({waitUntil: 'domcontentloaded'});
    await page.evaluate(solveCaptcha, solution.data);
    await navigationPromise;
  }
}

async function readKeyAsync() {
  const filePath = path.join(os.homedir(), 'animeloyalty', '2captcha.txt');
  const apiKey = await fs.readFile(filePath, 'utf8');
  return apiKey;
}
