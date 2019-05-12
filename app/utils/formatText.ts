
const charSet = {
  '&quot;': '"',

  '&apos;': '\'',
  '&#039;': '\'',

  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
};

const regex = new RegExp(`(${Object.keys(charSet).join('|')})`, 'g');

export default function formatText(str: string) {
  if (!str) return '';

  return str.replace(regex, (_, tag: string) => {
    if (!tag) return '';
    // @ts-ignore
    return charSet[tag] || '';
  });
}
