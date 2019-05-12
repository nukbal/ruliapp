
export default function compress(url: string) {
  const ext = url.match(/\.[0-9a-z]+$/i);
  if (ext) {
    const safeStr = url
      .replace(/^(http|https)/g, '')
      .replace(ext[0], '')
      .replace(/[^a-zA-Z0-9-_]/g, '');
    return safeStr + ext;
  }
  // eslint-disable-next-line prefer-template
  return url
    .replace(/^(http|https)/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '') + '.jpg';
}
