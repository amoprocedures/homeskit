import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackingUpProgress, Item} from './shared.models';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';

const BASE_URL = environment.API_BASE_URL;

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    private backing: BehaviorSubject<BackingUpProgress> = new BehaviorSubject({
        status: false,
        message: 'Data updating be patient...'
    });

    constructor(private http: HttpClient) {
    }

    postBackUp(backup: Item[]) {
        this.setStatus({status: true, message: 'Data updating be patient...'});
        return this.http
            .post(`${BASE_URL}/backup`, {backup});
    }

    setStatus(update: BackingUpProgress) {
        this.backing.next(update);
    }

    backingUp() {
        return this.backing.asObservable();
    }

}
