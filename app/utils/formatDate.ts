
function numeric(num: number) {
  const str = '0' + num;
  return str.substring(str.length - 2, str.length);
}

export default function format(d: Date | string) {
  let date = new Date(d);
  const month = numeric(date.getMonth() + 1);
  const day = numeric(date.getDate());
  const hour = numeric(date.getHours());
  const min = numeric(date.getMinutes());
  return `${date.getFullYear()}/${month}/${day} ${hour}:${min}`;
}
