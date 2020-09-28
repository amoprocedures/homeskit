import {Component, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Notiflix from 'notiflix';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ApiResponse} from "../../shared/shared.models";

const {API_BASE_URL, CORS_URL} = environment;

@Component({
    selector: 'app-signin',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

    form: FormGroup;

    constructor(
        private modalCtrl: ModalController,
        private fb: FormBuilder,
        private toastCtrl: ToastController,
        private http: HttpClient) {
        this.form = this.fb.group({
            email: [''],
            password: ['']
        });
    }

    ngOnInit() {
    }

    async onDismiss() {
        await this.modalCtrl.dismiss();
    }

    async onLogin() {
        const form: { email, password } = this.form.value;
        if (form.email.length === 0) {
            this.makeToast('Email field is required');
            return;
        }
        if (form.password.length === 0) {
            this.makeToast('Password field is required');
            return;
        }

        let body = `email=${form.email}&password=${form.password}`;
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };
        Notiflix.Loading.Hourglass();
        this.http.post(`https://cors-anywhere.herokuapp.com/${API_BASE_URL}/api/v1/auth.php/login`, body, options)
            .subscribe((data: ApiResponse) => {
                Notiflix.Loading.Remove(1500);
                setTimeout(() => {
                    if (data.status === false && data.error.length > 0) {
                        console.log(data);
                        this.makeToast(data.error[0],4000);
                    } else {
                        console.log(data);
                    }
                }, 1400);
            }, err => console.log(err));
    }

    makeToast(message?, duration = 2000) {
        this.toastCtrl.create({
            duration,
            message,
            position: 'top'
        }).then(async (toast) => {
            await toast.present();
        });
    }
}
