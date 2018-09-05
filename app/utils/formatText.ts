
const charSet = {
  '&quot;': '"',
  '&apos;': '\'',
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
}


const regex = new RegExp('(&quot;|&apos;|&amp;|&gt;|&lt;)', 'g');

export default function formatText(str: string) {
  if (!str) return '';

  return str.replace(regex, (_, tag: string) => {
    if (!tag) return '';
    // @ts-ignore
    return charSet[tag] || '';
  });
}
