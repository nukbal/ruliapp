
export default function compress(url: string) {
  const ext = url.match(/\.[0-9a-z]+$/i);
  if (ext) {
    const newUrl = ext[0] === '.gif' ? url.replace('ruliweb.com/mo', 'ruliweb.net/ori') : url;
    const safeStr = newUrl
      .replace(/^(http|https)/g, '')
      .replace(ext[0], '')
      .replace(/[^a-zA-Z0-9-_]/g, '');
    return safeStr + ext;
  }
  return url
    .replace(/^(http|https)/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '') + '.jpg';
}
