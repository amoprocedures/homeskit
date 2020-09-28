import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import Notiflix from 'notiflix';
import {environment} from '../environments/environment';
const RGBA = environment.NOTIFLIX_RGBA;
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            Notiflix.Report.Init({
                fontFamily: 'Questrial\', sans-serif',
                success: {
                    backOverlayColor: RGBA
                },
                warning: {
                    backOverlayColor: RGBA
                },
                info: {
                    backOverlayColor: RGBA
                },
                danger: {
                    backOverlayColor: RGBA
                },
                borderRadius: '30px'
            });
        });
    }

    ngOnInit() {
    }
}
