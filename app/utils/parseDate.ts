
function parseTime(date: Date, str: string) {
  const timeArr = str.split(':');
  date.setHours(parseInt(timeArr[0], 10));
  date.setMinutes(parseInt(timeArr[1], 10));
  return date;
}

export default function parseDate(str: string): Date | undefined {
  const len = str.length;
  if (len === 0 || len < 5) return;
  const date = new Date();

  if (len === 5) {
    return parseTime(date, str);
  } else {
    const [dateStr, timeStr] = str.split(' ');
    const [yearStr, monthStr, dayStr] = dateStr.split('.');

    let year;
    if (yearStr.length < 4) {
      year = parseInt('20' + yearStr, 10);
    } else {
      year = parseInt(yearStr, 10);
    }
    date.setFullYear(year);
    date.setMonth(parseInt(monthStr, 10) - 1);
    date.setDate(parseInt(dayStr, 10));    

    return parseTime(date, timeStr);
  }
}
