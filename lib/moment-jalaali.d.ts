import moment from 'moment';

declare module 'moment-jalaali' {
  export = moment;
}

declare module 'moment' {
  interface Moment {
    jYear(): number;
    jMonth(): number;
    jDate(): number;
    jDayOfYear(): number;
    jWeek(): number;
    jWeekYear(): number;
  }
} 