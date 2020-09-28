import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {CategoryStat, Item} from '../shared/shared.models';
import {UtilService} from '../shared/util.service';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    db: SQLiteObject;
    dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    items: BehaviorSubject<Item[]> = new BehaviorSubject([]);
    statsData: BehaviorSubject<CategoryStat[]> = new BehaviorSubject([]);
    generalStats = [];

    constructor(
        private sqlite: SQLite,
        private http: HttpClient,
        private platform: Platform,
        private util: UtilService
    ) {
        if (this.platform.ready() && this.platform.is('cordova')) {
            this.createInstance();
        }
    }

    createInstance() {
        this.sqlite.create({
            name: 'home_plex.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                this.db = db;
                this.runSeed();
            })
            .catch(e => console.log(e));
    }

    runSeed() {
        this.http
            .get('assets/db/seed.sql', {responseType: 'text'})
            .subscribe((sqlQuery) => {
                this.db.executeSql(sqlQuery, []).then(() => {
                    this.dbReady.next(true);
                });
            }, error => {
                console.log(`Table Exists : ${JSON.stringify(error)}`);
            });
    }

    insertItem(data: Array<any>) {
        this.db.executeSql('INSERT INTO items values(?,?,?,?,?,?,?,?,?)', data).then(() => {
            this.getItem();
        });
    }

    updateItem(id = null, data: Array<any>) {
        this.db
            .executeSql(`REPLACE INTO items values(?,?,?,?,?,?,?,?,?)`, data)
            .then(() => {
                this.getItem();
            });

    }

    getItem() {
        this.db.executeSql(`SELECT * FROM items where is_deleted=0 order by id DESC`, [])
            .then((res) => {
                const data = [];
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const item: Item = res.rows.item(i);
                        data.push(item);
                    }
                }
                this.items.next(data);
                this.getStatsBetween([
                    {
                        from: this.util.dateDiff({format: 'd', days: 0}),
                        to: this.util.dateDiff({format: 'd', days: 0}),
                        type: 'Today',
                        short_name: 'T'
                    },
                    {
                        from: this.util.dateDiff({format: 'd', days: 1}),
                        to: this.util.dateDiff({format: 'd', days: 1}),
                        type: 'Yesterday',
                        short_name: 'Y'
                    },
                    {
                        from: this.util.dateDiff({format: 'd', days: 7}),
                        to: this.util.dateDiff({format: 'd', days: 0}),
                        type: 'This Week',
                        short_name: 'W'
                    },
                    {
                        from: this.util.dateDiff({format: 'd', days: 30}),
                        to: this.util.dateDiff({format: 'd', days: 0}),
                        type: 'This Month',
                        short_name: 'M'
                    },
                    {
                        from: this.util.dateDiff({format: 'd', days: 365}),
                        to: this.util.dateDiff({format: 'd', days: 0}),
                        type: 'This Year',
                        short_name: 'Y'
                    }
                ]);
            })
            .catch(e => {
                console.log(`Error ${JSON.stringify(e)}`);
            });
    }

    deleteItem(id = null) {
        return this.db.executeSql(`UPDATE items set is_deleted = 'true' WHERE id = ${id}`, []).then(() => {
            this.getItem();
        });
    }

    getData() {
        return this.items.asObservable();
    }

    findItemByDate(date = ['2000-01-01']) {
        const dateString = `'${date.join('\',\'')}'`;
        const sql = `select * , sum(unit_price * quantity) as total_price, date(created_at) as date_created from items where date(created_at) in (${dateString}) and is_deleted = 0 group by date_created;`;
        this.db.executeSql(sql, [])
            .then((res) => {
                const items = [];
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const item: Item = res.rows.item(i);
                        items.push(item);
                    }
                }
            });
    }

    getStatistics(from = null, to = null) {
        this.db.executeSql(`SELECT * FROM item where is_deleted = 0 AND created_at BETWEEN date('${from}') and date('${to}') and is_deleted = 0`, [])
            .then((res) => {
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const item: Item = res.rows.item(i);
                    }
                }
            });
    }

    getAggregateData(date = ['2000-01-01']) {
        const dateString = `'${date.join('\',\'')}'`;
        const sql = `select count(id) as no_of_items, sum(unit_price * quantity) as total_price, date(created_at) as date_created from items where date(created_at) in (${dateString}) and is_deleted = 0 group by date_created;`;
        this.db
            .executeSql(sql, [])
            .then((res) => {
                const items = [];
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const item = res.rows.item(i);
                        items.push(item);
                    }
                }
            });
    }

    getStatsBetween(ranges: { from, to, type?, short_name? }[]) {
        this.generalStats = [];
        ranges.map((range) => {
            const sql = `SELECT count(id) as no_of_items, sum(unit_price * quantity) as total_price, date(created_at) as date_created FROM items WHERE date(created_at) BETWEEN date('${range.from}') AND date('${range.to}') AND is_deleted ='false';`;
            this.db
                .executeSql(sql, [])
                .then((res) => {
                    if (res.rows.length > 0) {
                        for (let i = 0; i < res.rows.length; i++) {
                            const item: CategoryStat = res.rows.item(i);
                            item.type = range.type;
                            item.short_name = range.short_name;
                            this.updateStatsUI(item);
                        }
                    }
                });
        });
    }

    updateStatsUI(item: CategoryStat) {
        this.generalStats.push(item);
        this.statsData.next(this.generalStats);
    }

    statsUIData() {
        return this.statsData.asObservable();
    }
}
