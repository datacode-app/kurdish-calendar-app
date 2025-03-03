import moment from 'moment';

declare module 'moment-hijri' {
  export = moment;
}

declare module 'moment' {
  interface Moment {
    iHijri(): boolean;
    format(format?: string): string;
    
    // Hijri getters
    iYear(): number;
    iMonth(): number;
    iDate(): number;
    iDayOfYear(): number;
    iWeek(): number;
    iWeekYear(): number;
    
    // Hijri setters
    iYear(h: number): Moment;
    iMonth(h: number): Moment;
    iDate(h: number): Moment;
    
    // Conversion
    toHijri(): Moment;
    clone(): Moment;
  }
  
  function iMoment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): moment.Moment;
} 