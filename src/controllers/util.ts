export default function datesAreOnSameDay(first:Date, second:Date):boolean {
  return first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate();
}
