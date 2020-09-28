import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() {
    }

    static pad = n => n < 10 ? '0' + n : n;

    dateTime(dt?, type = 'dt') {

        dt = (dt) ? dt : new Date();
        const date = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        const hour = dt.getHours();
        const min = dt.getMinutes();
        const ms = dt.getSeconds();
        const a = (hour > 12) ? 'PM' : 'AM';
        const h = (hour > 12) ? (hour - 12) : hour;

        if (type === 'dt') {
            return `${year}-${UtilService.pad(month + 1)}-${UtilService.pad(date)}T${UtilService.pad(hour)}:${UtilService.pad(min)}:${UtilService.pad(ms)}`;
        }
        if (type === 'd') {
            return year + '-' + UtilService.pad(month + 1) + '-' + UtilService.pad(date);
        }
        if (type === 't') {
            return `${UtilService.pad(h)}:${UtilService.pad(min)} ${a}`;
        }
    }

    timeStamp() {
        return (new Date()).getTime();
    }

    dateDiff(option: { days?, format? } = {days: 0, format: 'dt'}) {
        const lastWorkingDay = new Date();
        lastWorkingDay.setDate(lastWorkingDay.getDate() - option.days);
        return this.dateTime((lastWorkingDay), option.format);
    }
}
