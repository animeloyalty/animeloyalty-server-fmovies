/**
 * Initialize the stream.
 * @returns {void}
 */
function initStream() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('_watching')) continue;
    localStorage.removeItem(key);
  }
}

if (typeof module !== 'undefined') {
  module.exports = {initStream};
} else {
  console.log(initStream());
}
