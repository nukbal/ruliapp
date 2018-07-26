
export default function hashCode(str: string) {
  let hash = 0, i, chr;
  const length = str.length;
  if (length === 0) return hash;
  for (i = 0; i < length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}
