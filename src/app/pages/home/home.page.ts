import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AddItemComponent} from '../../components/add-item/add-item.component';
import {EditMode, Item} from '../../shared/shared.models';
import {SharedService} from '../../shared/shared.service';
import {DatabaseService} from '../../database/database.service';
import Notiflix from 'notiflix';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    items: Item[] = [];

    constructor(
        private modalCtrl: ModalController,
        private service: SharedService,
        private database: DatabaseService
    ) {
    }

    async ngOnInit() {
        await this.getData();
    }

    async onAddItem(item: Item = null, color = null) {
        const data: EditMode = {type: 'new', color, title: (item) ? 'Edit Item' : 'Add Item', item};
        const modal = await this.modalCtrl.create({
            component: AddItemComponent,
            animated: true,
            componentProps: {data}
        });
        await modal.present();
        modal.onDidDismiss().then((res: { data: Item }) => {
            if (res.data) {
                if (res.data.id === '0') {
                    this.insert(res.data, 'INSERT');
                } else {
                    this.insert(res.data, 'UPDATE');
                }
            }
        });
    }

    getData() {
        // this.items.push(
        //     {
        //     id: '1',
        //     u_id: '12345',
        //     name: 'Sugar',
        //     quantity: 2,
        //     unit_price: 3200,
        //     is_deleted: '0',
        //     user_id: 'mukeloamos97@gmail.com',
        //     description: '',
        //     created_at: '',
        //     created_by: '',
        // },
        //     {
        //     id: '1',
        //     u_id: '123456',
        //     name: 'Salt',
        //     quantity: 2,
        //     unit_price: 1500,
        //     is_deleted: '0',
        //     user_id: '1',
        //     description: '',
        //     created_at: '',
        //     created_by: 'mukeloamos97@gmail.com',
        // }
        // );
        this.database.dbReady.subscribe((status) => {
            if (status) {
                this.database.getItem();
                this.database.getData().subscribe((items) => {
                    this.items = items;
                });
            }
        });
    }

    insert(data: Item, type = 'INSERT') {
        if (type === 'INSERT') {
            this.database.insertItem([
                null, data.u_id, data.name, data.quantity, data.unit_price,
                data.description, data.user_id, data.created_at, data.is_deleted
            ]);
        }
        if (type === 'UPDATE') {
            this.database.updateItem(data.id, [data.id, data.u_id, data.name, data.quantity, data.unit_price,
                data.description, data.user_id, data.created_at, data.is_deleted
            ]);
        }
    }

    getColor(index = 0) {
        const selected = (index > 8) ? index % 8 : index;
        const colors = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee',
            '#4cc9f0', '#160f29', '#246a73', '#368f8b', '#f3dfc1', '#ddbea8'];
        return colors[selected];
    }

    onDeleteItem(item: Item) {
        Notiflix.Loading.Pulse('Deleting Item...');
        this.database.deleteItem(item.id).then(() => {
            Notiflix.Loading.Remove(1500);
        });
    }

}
