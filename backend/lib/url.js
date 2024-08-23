function isValidCatboxUrl(url) {
  const urlRegex = /^https:\/\/files\.catbox\.moe\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
  return urlRegex.test(url);
}

function isValidUrl(url) {
  urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[^\s]*)?$/;
  return urlRegex.test(url);
}

module.exports = { isValidCatboxUrl, isValidUrl };
