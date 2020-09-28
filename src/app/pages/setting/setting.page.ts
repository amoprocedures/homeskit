import {Component, OnInit} from '@angular/core';
import {ApiResponse, Item, LoggedUser} from '../../shared/shared.models';
import {BackupService} from '../../shared/backup.service';
import Notiflix from 'notiflix';
import {AlertController, ModalController} from '@ionic/angular';
import {SignInComponent} from '../../components/signin/sign-in.component';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

    email = 'mukeloamos97@gmail.com';
    sync = new Date().toISOString().substring(0, 10);
    first = 'Mukelo';
    last = 'Amos';
    img = '';

    user: LoggedUser;

    constructor(
        private http: BackupService,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController) {
    }

    async ngOnInit() {
        // await this.makeBackUp();
    }

    async makeBackUp() {
        const backup: Item[] = [
            {
                id: '1',
                u_id: '1',
                name: 'Eating Salt',
                quantity: 4,
                unit_price: 1500,
                is_deleted: 0,
                user_id: 'mukeloamos97@gmail.com',
                description: null,
                created_by: 'M.A',
                created_at: '2020-08-01T01:02:00'
            }, {
                id: '2',
                u_id: '2',
                name: 'Sugar',
                quantity: 2,
                unit_price: 3000,
                is_deleted: 0,
                user_id: 'mukeloamos97@gmail.com',
                description: null,
                created_by: 'M.A',
                created_at: '2020-08-01T01:00:00'
            }
        ];
        this.backupStatus();
        this.http
            .postBackUp(backup)
            .subscribe(async (resp: ApiResponse) => {
                this.http.setStatus({status: false, message: resp.message, result: resp.response});
                await this.showAlert({message: resp.message, header: 'Successful', subHeader: ''});
            }, async (error) => {
                await this.showAlert({message: 'Something went wrong. please try again.', header: 'Oops!', subHeader: ''});
                Notiflix.Loading.Remove();
                console.log(`${JSON.stringify(error)}`);
            });
    }

    backupStatus() {
        this.http.backingUp().subscribe(async (data) => {
            if (data?.status) {
                Notiflix.Loading.Pulse(data?.message);
                console.log(data);
            } else {
                console.log(data);
                Notiflix.Loading.Remove();
            }
        }, error => {
            Notiflix.Loading.Remove();
            console.log(`${JSON.stringify(error)}`);
        });
    }

    async showAlert({message, header, subHeader}) {
        const alert = await this.alertCtrl
            .create({
                animated: true,
                subHeader,
                message,
                header,
                buttons: [
                    {
                        role: 'close',
                        text: 'OK'
                    }
                ]
            });
        await alert.present();
    }

    async onShow(type = 'signin') {
        const modal = await this.modalCtrl.create({
            animated: true,
            component: SignInComponent,
            componentProps: {data: {}}
        });
        modal.present();
    }

}
