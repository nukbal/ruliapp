
function numeric(num: number) {
  const str = `0${num}`;
  return str.slice(-2);
}

export default function format(d: Date | string) {
  const date = new Date(d);
  const month = numeric(date.getMonth() + 1);
  const day = numeric(date.getDate());
  const hour = numeric(date.getHours());
  const min = numeric(date.getMinutes());
  return `${date.getFullYear()}/${month}/${day} ${hour}:${min}`;
}
