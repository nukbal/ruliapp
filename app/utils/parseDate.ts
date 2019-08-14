
function setKstOffset(date: Date) {
  return new Date(date.getTime() - (9 * 60 * 60 * 1000));
}

function parseTime(date: Date, str: string) {
  const timeArr = str.split(':');
  date.setUTCHours(parseInt(timeArr[0], 10));
  date.setUTCMinutes(parseInt(timeArr[1], 10));
  return setKstOffset(date);
}

export default function parseDate(str: string): Date | undefined {
  const len = str.length;
  if (len < 5) return;

  const date = new Date();
  date.setUTCMilliseconds(0);
  date.setUTCSeconds(0);
  date.setUTCMinutes(0);
  date.setUTCHours(0);

  if (len === 5) {
    return parseTime(date, str);
  }

  const [dateStr, timeStr] = str.split(' ');
  const [yearStr, monthStr, dayStr] = dateStr.split(/\.|-/);

  let year;
  if (yearStr.length < 4) {
    year = parseInt(`20${yearStr}`, 10);
  } else {
    year = parseInt(yearStr, 10);
  }
  date.setUTCFullYear(year);
  date.setUTCMonth(parseInt(monthStr, 10) - 1);
  date.setUTCDate(parseInt(dayStr, 10));

  if (timeStr) {
    return parseTime(date, timeStr);
  }
  return setKstOffset(date);
}
