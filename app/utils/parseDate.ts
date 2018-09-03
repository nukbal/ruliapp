
export default function parseDate(str: string): Date | undefined {
  const len = str.length;
  if (len === 0 || len < 5) return;

  if (len === 5) {
    const timeArr = str.split(':');
    const date = new Date();
    date.setHours(parseInt(timeArr[0], 10));
    date.setMinutes(parseInt(timeArr[1], 10));
    return date;
  } else if (len === 14) {
    let year = parseInt(str.substring(0, 2), 10);
    let dateStr = str + '';
    if (year < 90) {
      dateStr = '20' + dateStr;
    } else {
      dateStr = '19' + dateStr;
    }
    return new Date(dateStr);
  } else {
    return new Date(str);
  }
}
