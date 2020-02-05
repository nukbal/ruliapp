
export default function compress(url: string) {
  let ext = '.jpg';
  const regex = url.match(/(\.|=)(gif|jpe?g|png|webp|mp4)/i);
  let safeUrl = url;

  if (regex) {
    safeUrl = safeUrl.substring(0, regex.index);
    ext = `.${regex[2]!}`;
  }

  const paramIdx = safeUrl.indexOf('?');
  if (paramIdx > -1) {
    safeUrl = safeUrl.substring(0, paramIdx);
  }

  return safeUrl
    .replace(/^(http|https)/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .replace('ruliweb', '') + ext;
}
