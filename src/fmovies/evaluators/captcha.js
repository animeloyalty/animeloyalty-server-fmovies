/**
 * Evaluate the captcha.
 * @returns {Promise<{key: string, url: string} | undefined>}
 */
async function evaluateCaptchaAsync() {
  return await new Promise((resolve, reject) => {
    const endTime = Date.now() + 10000;
    detect(endTime, resolve, reject);
  });

  /**
   * Detect the captcha.
   * @param {number} endTime
   * @param {(captcha?: {key: string, url: string}) => void} resolve
   * @param {(error?: Error) => void} reject
   */
  function detect(endTime, resolve, reject) {
    (function tick() {
      if (document.querySelector('.g-recaptcha iframe')) {
        resolve(mapKey(location.href));
      } else if (document.querySelector('.seasons')) {
        resolve();
      } else if (endTime >= Date.now()) {
        setTimeout(tick, 0);
      } else {
        reject();
      }
    })();
  }

  /**
   * Map the key.
   * @param {string} url
   * @returns {{key: string, url: string}}
   */
  function mapKey(url) {
    const iframe = document.querySelector('.g-recaptcha iframe');
    const src = iframe ? iframe.getAttribute('src') : null;
    const key = src ? new URL(src).searchParams.get('k') : null;
    if (key) return {key, url};
    throw new Error();
  }
}

/**
 * Solve the captcha.
 * @param {string} response
 * @returns {boolean}
 */
function solveCaptcha(response) {
  const captcha = Array.from(document.querySelectorAll('textarea'))
    .filter(x => x.classList.contains('g-recaptcha-response'))
    .shift();
  if (captcha) {
    captcha.value = response;
    captcha.form?.submit();
    return true;
  } else {
    return false;
  }
}

if (typeof module !== 'undefined') {
  module.exports = {evaluateCaptchaAsync, solveCaptcha};
} else {
  evaluateCaptchaAsync().then(console.log.bind(console));
}
