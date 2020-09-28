import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MenuPageModule} from './menu/menu.module';
import {AddItemComponent} from './components/add-item/add-item.component';
import {SharedModules} from './shared/shared.modules';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SignInComponent} from './components/signin/sign-in.component';
import {AuthInterceptor} from "./auth/auth.interceptor";

@NgModule({
    declarations: [AppComponent, AddItemComponent, SignInComponent],
    entryComponents: [AddItemComponent, SignInComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        HttpClientModule,
        AppRoutingModule,
        MenuPageModule,
        SharedModules
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        SQLite,
        SQLitePorter
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: AuthInterceptor,
        //     multi: true
        // }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
