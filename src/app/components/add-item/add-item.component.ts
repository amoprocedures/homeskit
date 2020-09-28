import {Component, Input, OnInit} from '@angular/core';
import {EditMode} from '../../shared/shared.models';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SharedService} from '../../shared/shared.service';
import {timestamp} from 'rxjs/operators';
import Notiflix from 'notiflix';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
    @Input()
    data: EditMode;
    form: FormGroup;
    amount = 0;
    color = '';

    constructor(
        private modalCtrl: ModalController,
        private service: SharedService,
        private fb: FormBuilder,
        private toastCtrl: ToastController) {
    }

    ngOnInit() {
        this.color = (this.data.color) ? this.data.color : 'var(--ion-color-primary)';
        const now = this.service.timeStamp();
        const timeStamp = this.service.tStamp();
        this.form = this.fb.group({
            id: [((this.data?.item) ? this.data?.item?.id : '0')],
            u_id: [((this.data?.item) ? this.data?.item?.u_id : timeStamp)],
            name: [this.data?.item?.name],
            quantity: [this.data?.item?.quantity],
            unit_price: [this.data?.item?.unit_price],
            description: [this.data?.item?.description],
            user_id: [this.data?.item?.user_id],
            created_at: [((this.data.item) ? this.data?.item.created_at : now)],
            is_deleted: [0]
        });
        this.amount = (this.data.item) ? (this.data?.item?.unit_price * this.data?.item?.quantity) : 0;
    }

    async onClose() {
        await this.modalCtrl.dismiss(null);
    }

    onSave() {
        if (!this.form.controls.name.value || this.form.controls.name.value.trim().length === 0) {
            this.showToastUI('Item name is required');
            return;
        }

        if (!this.form.controls.quantity.value || this.form.controls.quantity.value <= 0.01) {
            this.showToastUI('Quantity is required > 0.01');
            return;
        }

        if (!this.form.controls.unit_price.value || this.form.controls.unit_price.value <= 0.01) {
            this.showToastUI('Price is required > 0.01');
            return;
        }

        const message = (this.form.value.id === '0') ? 'Saving Item...' : 'Updating Changes...';
        Notiflix.Loading.Pulse(message);
        setTimeout(async () => {
            await this.modalCtrl.dismiss(this.form.value).then(() => {
                Notiflix.Loading.Remove();
            });
        }, 1500);
    }

    sumTotal() {
        const {unit_price, quantity} = this.form.value;
        const qty = (quantity) ? quantity : 0;
        const price = (unit_price) ? unit_price : 0;
        this.amount = qty * price;
    }

    showToastUI(msg: string) {
        this.toastCtrl.create({
            message: msg,
            duration: 1000
        }).then((toast) => {
            toast.present();
        });
    }

}
