/**
 * Evaluate the series.
 * @typedef {import('animesync').api.RemoteSeries} RemoteSeries
 * @typedef {import('animesync').api.RemoteSeriesSeason} RemoteSeriesSeason
 * @typedef {import('animesync').api.RemoteSeriesSeasonEpisode} RemoteSeriesSeasonEpisode
 * @returns {Promise<RemoteSeries>}
 **/
async function evaluateSeriesAsync() {
  return awaitData().then(() => ({
    genres: Array.from(document.querySelectorAll('.meta a[href*="/genre/"]')).map(validateStrict),
    imageUrl: processUrl(document.querySelector('.poster img')),
    seasons: mapSeason(document.querySelector('.seasons')),
    synopsis: mapSynopsis(document.querySelector('.desc')),
    title: validateStrict(document.querySelector('.title')),
    url: location.href
  }));

  /**
   * Awaits the data.
   * @returns {Promise<void>}
   */
  async function awaitData() {
    const endTime = Date.now() + 10000;
    await new Promise((resolve, reject) => {
      (function tick() {
        if (document.querySelector('.seasons')) {
          resolve(null);
        } else if (endTime >= Date.now()) {
          setTimeout(tick, 0);
        } else {
          reject();
        }
      })();
    });  
  }

  /**
   * Fetch the episode container.
   * @param {Element} seasonNode 
   * @returns {Element}
   */
  function fetchEpisodeContainer(seasonNode) {
    const id = seasonNode.getAttribute('data-id');
    const range = seasonNode.getAttribute('data-ranges')?.split(',')?.shift();
    const episodeContainer = document.querySelector(`ul[id*='${id}_'][data-range='${range}']`);
    if (episodeContainer) return episodeContainer;
    throw new Error();
  }

  /**
   * Map the seasons.
   * @param {Element?} containerNode
   * @returns {Array<RemoteSeriesSeason>}
   */
  function mapSeason(containerNode) {
    if (!containerNode) return [];
    return Array.from(containerNode.querySelectorAll('li')).map((seasonNode) => {
      const episodes = mapSeasonEpisodes(seasonNode);
      const title = validateStrict(seasonNode.firstChild && seasonNode.firstChild.textContent);
      return {episodes, title};
    });
  }

  /**
   * Map the season episodes.
   * @param {Element?} seasonNode 
   * @returns {Array<RemoteSeriesSeasonEpisode>}
   */
  function mapSeasonEpisodes(seasonNode) {
    if (!seasonNode) return [];
    return Array.from(fetchEpisodeContainer(seasonNode).querySelectorAll('li')).map((episodeNode) => {
      const data = processName(episodeNode.textContent && episodeNode.textContent.trim());
      const isPremium = false;
      const name = data.name;
      const title = data.title;
      const url = processUrl(episodeNode.querySelector('a'));
      return {isPremium, name, title, url};
    });
  }

  /**
   * Map the synopsis.
   * @param {Element?} synopsisNode 
   * @returns {string|undefined}
   */
  function mapSynopsis(synopsisNode) {
    synopsisNode
      ?.querySelector('.more')
      ?.dispatchEvent(new Event('click'));
    return validate(synopsisNode
      && synopsisNode.firstChild
      && synopsisNode.firstChild.textContent);
  }

  /**
   * Process the name.
   * @param {string?} value
   * @returns {{name: string, title: string|undefined}}
   */
  function processName(value) {
    const match = value?.match(/^(?:Episode\s)?(.+?)(?:\:\s*(.*))?$/);
    if (match) return {name: match[1], title: match[2]};
    throw new Error();
  }

  /**
   * Process the URL.
   * @throws If the URL is invalid.
   * @param {Element|string?} value 
   * @param {string=} attributeName
   * @returns {string}
   */
  function processUrl(value, attributeName) {
    if (typeof value === 'string') {
      return new URL(value, location.href).toString();
    } else if (value && value.nodeName === 'A') {
      return processUrl((attributeName && value.getAttribute(attributeName)) ?? value.getAttribute('href'));
    } else if (value && value.nodeName === 'IMG') {
      return processUrl((attributeName && value.getAttribute(attributeName)) ?? value.getAttribute('src'));
    } else {
      throw new Error();
    }
  }

  /**
   * Validate the text content.
   * @param {(Element|string)?} value 
   * @returns {string|undefined}
   */
  function validate(value) {
    if (typeof value === 'string') {
      return value.trim().replace(/\s+/g, ' ') || undefined;
    } else if (value) {
      return validate(value.textContent);
    } else {
      return undefined;
    }
  }

  /**
   * Validate the text content.
   * @throws If the text content is empty.
   * @param {(Element|string)?} value 
   * @returns {string}
   */
  function validateStrict(value) {
    const result = validate(value);
    if (result) return result;
    throw new Error();
  }
}

if (typeof module !== 'undefined') {
  module.exports = {evaluateSeriesAsync};
} else {
  evaluateSeriesAsync().then(console.log.bind(console));
}
