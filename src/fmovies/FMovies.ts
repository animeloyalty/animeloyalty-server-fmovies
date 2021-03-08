import * as app from '..';
import * as ncm from '@nestjs/common';
import {evaluatePage} from './evaluators/page';
import {evaluateSeriesAsync} from './evaluators/series';
import {FMoviesContext} from './FMoviesContext';
import {FMoviesUtilities} from './FMoviesUtilities';
import {initStream} from './evaluators/stream';
import querystring from 'querystring';
const baseUrl = 'https://fmovies.to';

@ncm.Injectable()
export class FMovies implements app.IProvider {
  private readonly browserService: app.BrowserService;
  private readonly composeService: app.ComposeService;
  private readonly loggerService: app.LoggerService;

  constructor(browserService: app.BrowserService, composeService: app.ComposeService, loggerService: app.LoggerService) {
    this.browserService = browserService;
    this.composeService = composeService;
    this.loggerService = loggerService;
  }

  contextAsync() {
    const id = 'fmovies';
    const label = 'FMovies';
    const pages = FMoviesContext.pages();
    return Promise.resolve(new app.api.RemoteProvider({id, label, pages}));
  }

  isSeriesAsync(seriesUrl: string) {
    const isSeries = /^https:\/\/fmovies\.to\/film\/[^\/]+$/.test(seriesUrl);
    return Promise.resolve(isSeries);
  }

  isStreamAsync(streamUrl: string) {
    const isStream = /^https:\/\/fmovies\.to\/film\/[^\/]+\/[^\/]+$/.test(streamUrl);
    return Promise.resolve(isStream);
  }

  async pageAsync(page?: string, options?: Array<string>, pageNumber = 1) {
    const pageSource = FMoviesContext.findPage(page);
    const pageUrl = createPageUrl(pageSource, options, pageNumber).toString();
    return await this.browserService.pageAsync(async (page, userAgent) => {
      await page.goto(pageUrl, {waitUntil: 'domcontentloaded'});
      const headers = Object.assign({'user-agent': userAgent}, defaultHeaders);
      const search = await page.evaluate(evaluatePage);
      return this.composeService.search(pageUrl, search, headers);
    });
  }

  async searchAsync(query: string, pageNumber = 1) {
    const queryRaw = querystring.stringify({keyword: query, page: pageNumber});
    const queryUrl = new URL(`/search?${queryRaw}`, baseUrl).toString();
    return await this.browserService.pageAsync(async (page, userAgent) => {
      await page.goto(queryUrl, {waitUntil: 'domcontentloaded'});
      const headers = Object.assign({'user-agent': userAgent}, defaultHeaders);
      const search = await page.evaluate(evaluatePage);
      return this.composeService.search(queryUrl, search, headers);
    });
  }

  async seriesAsync(seriesUrl: string) {
    return await this.browserService.pageAsync(async (page, userAgent) => {
      await page.goto(seriesUrl, {waitUntil: 'domcontentloaded'});
      await FMoviesUtilities.tryCaptchaAsync(this.loggerService, page);
      const headers = Object.assign({'user-agent': userAgent}, defaultHeaders);
      const series = await page.evaluate(evaluateSeriesAsync);
      return this.composeService.series(seriesUrl, series, headers);
    });
  }

  async streamAsync(streamUrl: string) {
    return await this.browserService.pageAsync(async (page, userAgent) => {
      const [streamPromise, subtitlePromise] = new app.Observer(page).getAsync(/^https:\/\/mcloud2\.to\/info\//, /^https:\/\/fmovies\.to\/ajax\/episode\/subtitles/);
      await page.addInitScript(initStream);
      await page.goto(streamUrl, {waitUntil: 'domcontentloaded'});
      await FMoviesUtilities.tryCaptchaAsync(this.loggerService, page);
      const streamData = await streamPromise.then(x => x.json()) as StreamResponse;
      const subtitleData = await subtitlePromise.then(x => x.json()) as SubtitleResponse;
      const headers = Object.assign({'user-agent': userAgent}, defaultHeaders);
      return await this.composeService.streamAsync(streamUrl, new app.api.RemoteStream({
        sources: streamData.media.sources
          .filter(x => x.file.endsWith('.m3u8'))
          .map(x => ({type: 'hls', url: x.file})),
        subtitles: subtitleData
          .filter(x => FMoviesUtilities.mapLanguage(x.label))
          .map(x => ({language: FMoviesUtilities.mapLanguage(x.label)!, type: 'vtt', url: x.file}))
      }), headers);
    });
  }
}

function createPageUrl(page?: app.api.RemoteProviderPage, options?: Array<string>, pageNumber = 1) { 
  if (page && page.id === 'genres') return options && options.length && options.every(x => page.options.find(y => x === y.id))
    ? new URL(`filter?${querystring.stringify({'type[]': 'series', 'genre[]': options, genre_mode: 'and', page: pageNumber})}`, baseUrl)
    : new URL(`filter?${querystring.stringify({'type[]': 'series', 'sort': 'views:desc', page: pageNumber})}`, baseUrl);
  return page
    ? new URL(`filter?${querystring.stringify({'type[]': 'series', 'sort': page.id, page: pageNumber})}`, baseUrl)
    : new URL(`filter?${querystring.stringify({'type[]': 'series', 'sort': 'views:desc', page: pageNumber})}`, baseUrl);
}

const defaultHeaders = {
  origin: 'https://fmovies.to',
  referer: 'https://fmovies.to/'
};

type StreamResponse = {
  success: boolean;
  media: {sources: Array<{file: string}>};
}

type SubtitleResponse = Array<{
  file: string;
  label: string;
}>;
