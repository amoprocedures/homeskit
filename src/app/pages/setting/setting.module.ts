import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SettingPageRoutingModule} from './setting-routing.module';

import {SettingPage} from './setting.page';
import {SharedModules} from '../../shared/shared.modules';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SettingPageRoutingModule,
        SharedModules
    ],
    declarations: [SettingPage]
})
export class SettingPageModule {
}
