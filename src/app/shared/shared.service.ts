import {Injectable} from '@angular/core';
import {Item} from './shared.models';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    items: BehaviorSubject<Item[]> = new BehaviorSubject([]);
    ite: Item[] = [];

    constructor() {
        this.ite.push({
            id: '',
            u_id: '',
            name: 'Sugar',
            quantity: 2,
            unit_price: 3200,
            is_deleted: 0,
            user_id: '1',
            description: '',
            created_at: '',
            date_created: ''
        });
        this.items.next(this.ite);
    }

    static pad = n => n < 10 ? '0' + n : n;

    post(item: Item): Promise<boolean> {
        this.ite.push(item);
        return new Promise((res, rej) => {
            this.items.next(this.ite);
            return res(true);
        });
    }

    get() {
        return this.items.asObservable();
    }

    timeStamp(dt?, type = 'dt', calc?: { days: 3 }) {

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
            return `${year}-${SharedService.pad(month + 1)}-${SharedService.pad(date)}T${SharedService.pad(hour)}:${SharedService.pad(min)}:${SharedService.pad(ms)}`;
        }
        if (type === 'd') {
            return year + '-' + SharedService.pad(month + 1) + '-' + SharedService.pad(date);
        }
        if (type === 't') {
            return `${SharedService.pad(h)}:${SharedService.pad(min)} ${a}`;
        }
    }

    tStamp() {
        return (new Date()).getTime();
    }
}
